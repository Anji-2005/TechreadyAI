import React, { useEffect, useMemo, useState } from "react";
import { apiGet } from "./api";

function formatYYYYMM(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function prettyDateRange(startISO, endISO) {
  const s = new Date(startISO);
  const e = new Date(endISO);
  const opts = { day: "2-digit", month: "short" };
  return `${s.toLocaleDateString("en-IN", opts)} – ${e.toLocaleDateString("en-IN", opts)}`;
}

function roleIdToLabels(roleId) {
  // Match your seeded events roles array (e.g. ["SDE", "Data Analyst", "ML Engineer"])
  if (roleId === "data-analyst") return ["Data Analyst", "Data Analytics", "Analyst"];
  if (roleId === "ml-engineer") return ["ML Engineer", "Machine Learning Engineer", "ML"];
  return ["SDE", "Software Engineer", "Developer"];
}

export default function HiringCalendarWidget({ roleId }) {
  const [month, setMonth] = useState(() => formatYYYYMM(new Date()));
  const [data, setData] = useState({ events: [] });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr("");

    apiGet(`/api/dashboard/hiring-calendar?month=${month}`)
      .then((json) => mounted && setData(json))
      .catch((e) => mounted && setErr(e.message || "Failed"))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [month]);

  const monthLabel = useMemo(() => {
    const [y, m] = month.split("-").map(Number);
    const d = new Date(y, m - 1, 1);
    return d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  }, [month]);

  const filteredEvents = useMemo(() => {
    const events = data.events || [];
    if (!roleId) return events;

    const labels = roleIdToLabels(roleId).map((x) => x.toLowerCase());
    return events.filter((ev) => {
      const roles = (ev.roles || []).map((r) => String(r).toLowerCase());
      // If event has no roles tagged, show it to everyone
      if (!roles.length) return true;
      return roles.some((r) => labels.some((lbl) => r.includes(lbl)));
    });
  }, [data.events, roleId]);

  return (
    <div className="rounded-2xl border p-4 bg-white">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">Indian Hiring Calendar</h3>
          <p className="text-sm opacity-70">
            Current-month focus • {monthLabel}
            {roleId ? " • Filtered by role" : ""}
          </p>
        </div>

        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded-lg border px-2 py-1"
        />
      </div>

      <div className="mt-3">
        {loading && <div className="text-sm opacity-70">Loading…</div>}
        {err && <div className="text-sm text-red-600">Error: {err}</div>}

        {!loading && !err && filteredEvents.length === 0 && (
          <div className="text-sm opacity-70">
            No events for this month for the selected role yet.
          </div>
        )}

        <ul className="mt-2 space-y-3">
          {filteredEvents.map((ev) => (
            <li key={ev._id} className="rounded-xl border p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{ev.title}</div>
                  <div className="text-sm opacity-70">
                    {prettyDateRange(ev.startDate, ev.endDate)}
                  </div>

                  {ev.roles?.length > 0 && (
                    <div className="mt-1 text-xs opacity-70">
                      Roles: {ev.roles.join(", ")}
                    </div>
                  )}

                  {ev.notes && <div className="mt-2 text-sm">{ev.notes}</div>}
                </div>

                {ev.link ? (
                  <a
                    href={ev.link}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border px-3 py-1 text-sm hover:opacity-80"
                  >
                    Open
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

