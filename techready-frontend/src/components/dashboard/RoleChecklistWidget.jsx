import React, { useEffect, useMemo, useState } from "react";
import { apiGet, apiPost } from "./api";

function groupByCategory(items) {
  const map = new Map();
  for (const it of items) {
    const key = it.category || "General";
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(it);
  }
  return Array.from(map.entries());
}

function pct(done, total) {
  if (!total) return 0;
  return Math.round((done / total) * 100);
}

function normalize(str) {
  return (str || "").toLowerCase().trim();
}

export default function RoleChecklistWidget({ roleId, onRoleChange }) {
  const [roles, setRoles] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");

  // Load roles once
  useEffect(() => {
    apiGet("/api/dashboard/roles")
      .then((json) => {
        const list = json.roles || [];
        setRoles(list);

        if (!roleId && list.length && onRoleChange) {
          onRoleChange(list[0].roleId);
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load checklist whenever role changes
  useEffect(() => {
    if (!roleId) return;
    let mounted = true;
    setLoading(true);
    setErr("");

    apiGet(`/api/dashboard/role/${roleId}/checklist`)
      .then((json) => mounted && setItems(json.items || []))
      .catch((e) => mounted && setErr(e.message || "Failed"))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [roleId]);

  // Search-filtered items
  const filteredItems = useMemo(() => {
    const q = normalize(query);
    if (!q) return items;

    return items.filter((it) => {
      const hay = [
        it.title,
        it.detail,
        it.category,
        it.priority,
        ...(it.resources || []).map((r) => r.label),
      ]
        .filter(Boolean)
        .join(" ");
      return normalize(hay).includes(q);
    });
  }, [items, query]);

  const grouped = useMemo(() => groupByCategory(filteredItems), [filteredItems]);

  const doneCount = filteredItems.filter((x) => x.completed).length;
  const totalCount = filteredItems.length;

  const p0Remaining = filteredItems.filter(
    (x) => x.priority === "P0" && !x.completed
  ).length;

  // Remaining hours (sum incomplete estHours)
  const remainingHours = useMemo(() => {
    return filteredItems
      .filter((x) => !x.completed)
      .reduce((sum, x) => sum + (Number(x.estHours) || 0), 0);
  }, [filteredItems]);

  // “This week focus”: top 3 undone tasks (on full items list, not filtered)
  const thisWeek = useMemo(() => {
    const prioRank = (p) => (p === "P0" ? 0 : p === "P1" ? 1 : 2);
    return [...items]
      .filter((x) => !x.completed)
      .sort((a, b) => {
        const pa = prioRank(a.priority);
        const pb = prioRank(b.priority);
        if (pa !== pb) return pa - pb;
        const oa = a.order ?? 999;
        const ob = b.order ?? 999;
        return oa - ob;
      })
      .slice(0, 3);
  }, [items]);

  async function toggle(itemId) {
    // Optimistic UI
    setItems((prev) =>
      prev.map((x) => (x._id === itemId ? { ...x, completed: !x.completed } : x))
    );

    try {
      await apiPost(`/api/dashboard/role/${roleId}/checklist/${itemId}/toggle`);
    } catch (e) {
      // rollback if failed
      setItems((prev) =>
        prev.map((x) => (x._id === itemId ? { ...x, completed: !x.completed } : x))
      );
      alert("Could not update checklist (backend issue).");
    }
  }

  return (
    <div className="rounded-2xl border p-4 bg-white">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Role-based Preparation Checklist</h3>

          <p className="text-sm opacity-70">
            Progress: {doneCount}/{totalCount} ({pct(doneCount, totalCount)}%) • P0 remaining:{" "}
            {p0Remaining} • Remaining: ~{remainingHours}h
          </p>

          {/* Progress bar */}
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-2 rounded-full bg-blue-600"
              style={{ width: `${pct(doneCount, totalCount)}%` }}
            />
          </div>

          {/* Search */}
          <div className="mt-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks (e.g., arrays, resume, OS)…"
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
            {query && (
              <div className="mt-1 text-xs opacity-70">
                Showing {filteredItems.length} matching item(s).{" "}
                <button
                  className="underline"
                  onClick={() => setQuery("")}
                  type="button"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        <select
          value={roleId || ""}
          onChange={(e) => onRoleChange && onRoleChange(e.target.value)}
          className="rounded-lg border px-2 py-2 text-sm"
        >
          {roles.map((r) => (
            <option key={r.roleId} value={r.roleId}>
              {r.title}
            </option>
          ))}
          {!roles.length && <option value="sde">SDE</option>}
        </select>
      </div>

      {/* This week focus */}
      <div className="mt-4 rounded-xl border p-3 bg-gray-50">
        <div className="font-medium">This week focus</div>
        {thisWeek.length === 0 ? (
          <div className="mt-1 text-sm opacity-70">You’re all caught up 🎉</div>
        ) : (
          <ul className="mt-2 space-y-2">
            {thisWeek.map((it) => (
              <li key={it._id} className="flex items-start gap-3">
                <button
                  onClick={() => toggle(it._id)}
                  className="mt-1 h-5 w-5 rounded border bg-white hover:bg-gray-100"
                  title="Mark done"
                  type="button"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {it.title}{" "}
                    <span className="ml-2 rounded-md border px-2 py-0.5 text-xs opacity-70">
                      {it.priority || "P1"}
                    </span>
                  </div>
                  {it.category ? (
                    <div className="text-xs opacity-70">Category: {it.category}</div>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4">
        {loading && <div className="text-sm opacity-70">Loading…</div>}
        {err && <div className="text-sm text-red-600">Error: {err}</div>}

        {!loading && !err && (
          <div className="space-y-4">
            {grouped.map(([cat, catItems]) => (
              <div key={cat} className="rounded-xl border p-3">
                <div className="font-medium">{cat}</div>
                <ul className="mt-2 space-y-2">
                  {catItems.map((it) => (
                    <li key={it._id} className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={!!it.completed}
                        onChange={() => toggle(it._id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-sm font-medium">
                            {it.title}{" "}
                            <span className="ml-2 rounded-md border px-2 py-0.5 text-xs opacity-70">
                              {it.priority || "P1"}
                            </span>
                          </div>
                          {it.estHours ? (
                            <div className="text-xs opacity-70">~{it.estHours}h</div>
                          ) : null}
                        </div>

                        {it.detail ? <div className="text-sm opacity-80">{it.detail}</div> : null}

                        {it.resources?.length ? (
                          <div className="mt-1 flex flex-wrap gap-2">
                            {it.resources.map((r, idx) => (
                              <a
                                key={idx}
                                href={r.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs underline opacity-80"
                              >
                                {r.label || "Resource"}
                              </a>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

