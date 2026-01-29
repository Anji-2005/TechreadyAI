import React, { useEffect, useState } from "react";
import { apiGet } from "./api";

export default function RoleGuideWidget({ roleId }) {
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roleId) return;
    let mounted = true;
    setLoading(true);
    apiGet(`/api/dashboard/role/${roleId}/guide`)
      .then((json) => mounted && setGuide(json.guide))
      .catch(() => mounted && setGuide(null))
      .finally(() => mounted && setLoading(false));
    return () => (mounted = false);
  }, [roleId]);

  return (
    <div className="rounded-2xl border p-4">
      <h3 className="text-lg font-semibold">How to prepare for this role</h3>
      <p className="text-sm opacity-70">A quick, structured plan you can follow.</p>

      {loading && <div className="mt-3 text-sm opacity-70">Loading…</div>}

      {!loading && !guide && (
        <div className="mt-3 text-sm opacity-70">
          No guide found for this role yet. Add it in <code>RoleGuide</code> seed.
        </div>
      )}

      {!loading && guide && (
        <div className="mt-3 space-y-4">
          {guide.overview ? (
            <div className="rounded-xl border p-3">
              <div className="font-medium">Overview</div>
              <div className="text-sm opacity-90">{guide.overview}</div>
            </div>
          ) : null}

          {guide.interviewFormat?.length ? (
            <div className="rounded-xl border p-3">
              <div className="font-medium">Interview format</div>
              <ul className="mt-2 list-disc pl-5 text-sm opacity-90">
                {guide.interviewFormat.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {guide.roadmap?.length ? (
            <div className="rounded-xl border p-3">
              <div className="font-medium">Roadmap</div>
              <div className="mt-2 space-y-3">
                {guide.roadmap.map((w, i) => (
                  <div key={i} className="rounded-lg border p-3">
                    <div className="text-sm font-semibold">{w.week}: {w.focus}</div>
                    <ul className="mt-2 list-disc pl-5 text-sm opacity-90">
                      {(w.tasks || []).map((t, j) => <li key={j}>{t}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {guide.standoutProjects?.length ? (
            <div className="rounded-xl border p-3">
              <div className="font-medium">Standout projects</div>
              <ul className="mt-2 list-disc pl-5 text-sm opacity-90">
                {guide.standoutProjects.map((x, i) => <li key={i}>{x}</li>)}
              </ul>
            </div>
          ) : null}

          {guide.mistakesToAvoid?.length ? (
            <div className="rounded-xl border p-3">
              <div className="font-medium">Mistakes to avoid</div>
              <ul className="mt-2 list-disc pl-5 text-sm opacity-90">
                {guide.mistakesToAvoid.map((x, i) => <li key={i}>{x}</li>)}
              </ul>
            </div>
          ) : null}

          {guide.resources?.length ? (
            <div className="rounded-xl border p-3">
              <div className="font-medium">Resources</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {guide.resources.map((r, i) => (
                  <a
                    key={i}
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border px-3 py-1 text-sm hover:opacity-80"
                  >
                    {r.label || "Link"}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
