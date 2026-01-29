import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

import HiringCalendarWidget from "../components/dashboard/HiringCalendarWidget";
import RoleChecklistWidget from "../components/dashboard/RoleChecklistWidget";
import RoleGuideWidget from "../components/dashboard/RoleGuideWidget";

function Spinner() {
  return (
    <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin" />
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <div className="h-6 w-40 bg-gray-200 rounded mb-4 animate-pulse" />
      <div className="h-4 w-full bg-gray-200 rounded mb-2 animate-pulse" />
      <div className="h-4 w-5/6 bg-gray-200 rounded mb-2 animate-pulse" />
      <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
    </div>
  );
}

export default function Dashboard() {
  const location = useLocation();
  const { role, year, time } = location.state || {};

  const payload = useMemo(
    () => ({
      role,
      year,
      time,
      resumeText: "", // later we’ll send extracted resume text
    }),
    [role, year, time]
  );

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [phase, setPhase] = useState("Starting analysis…");

  // Dashboard widgets role selection (for RoleGuideWidget)
  // We normalize a few common role labels to your backend roleIds.
  const initialRoleId = useMemo(() => {
    const r = (role || "").toLowerCase().trim();
    if (!r) return "sde";
    if (r.includes("data")) return "data-analyst";
    if (r.includes("ml") || r.includes("machine")) return "ml-engineer";
    return "sde";
  }, [role]);

  // ✅ Unified roleId state (used by checklist dropdown AND guide)
  const [roleId, setRoleId] = useState(initialRoleId);

  async function fetchAnalysis() {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      // Nice “AI” progress phases
      setPhase("Parsing resume & context…");
      const t1 = setTimeout(() => setPhase("Checking ATS compatibility…"), 600);
      const t2 = setTimeout(() => setPhase("Detecting skill gaps…"), 1200);
      const t3 = setTimeout(() => setPhase("Generating roadmap & calendar…"), 1800);

      const res = await fetch("/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to analyze");
      }

      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
      setPhase("Done");
    }
  }

  useEffect(() => {
    fetchAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Your Placement Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Target Role: {role || "N/A"} | Graduation: {year || "N/A"} | Time:{" "}
              {time || "N/A"}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchAnalysis}
              disabled={loading}
              className={`px-5 py-2 rounded-lg border font-medium ${
                loading ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-50"
              }`}
            >
              Regenerate Plan
            </button>
            <button
              className="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
              onClick={() => window.print()}
              disabled={loading}
              title="Quick export via browser print (Save as PDF)"
            >
              Download Report
            </button>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <>
            <div className="bg-white p-6 rounded-xl shadow flex items-center gap-3">
              <Spinner />
              <div>
                <h2 className="text-lg font-semibold">Analyzing…</h2>
                <p className="text-gray-600">{phase}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkeletonCard />
              <SkeletonCard />
            </div>

            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="bg-white p-6 rounded-xl shadow border border-red-200">
            <h2 className="text-xl font-semibold text-red-600">Error</h2>
            <p className="text-gray-700 mt-2">{error}</p>
            <div className="mt-4">
              <button
                onClick={fetchAnalysis}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Result state */}
        {!loading && !error && result && (
          <>
            {/* ATS Score */}
            <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">ATS Score</h2>
                <p className="text-gray-600">
                  Placement Readiness: {result.readiness}
                </p>
              </div>
              <div className="text-4xl font-bold text-blue-600">
                {result.atsScore}/100
              </div>
            </div>

            {/* Top Fixes */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-4">
                Top Resume Improvements
              </h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                {result.topFixes.map((fix, i) => (
                  <li key={i}>{fix}</li>
                ))}
              </ul>
            </div>

            {/* Skill Gaps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-lg font-semibold mb-4">Skills Present</h3>
                <div className="flex flex-wrap gap-2">
                  {result.skillsPresent.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-lg font-semibold mb-4">Skills to Improve</h3>
                <div className="flex flex-wrap gap-2">
                  {result.skillsMissing.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Roadmap */}
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-4">
                Personalized 4-Week Roadmap
              </h3>

              <div className="space-y-4">
                {result.roadmap.map((week, i) => (
                  <div key={i} className="border rounded-lg p-4 bg-gray-50">
                    <h4 className="font-semibold mb-2">Week {i + 1}</h4>
                    <ul className="list-disc pl-5 text-gray-700">
                      {week.tasks.map((task, j) => (
                        <li key={j}>{task}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* ✅ New Dashboard Widgets (DB-backed) */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <HiringCalendarWidget roleId={roleId} />
              {/* ✅ pass unified role state into checklist */}
              <RoleChecklistWidget roleId={roleId} onRoleChange={setRoleId} />
            </div>

            {/* ✅ guide follows the same role */}
            <RoleGuideWidget roleId={roleId} />

            {/* Optional: keep the old static hiringCalendar from /analyze (you can remove later) */}
            {Array.isArray(result.hiringCalendar) &&
              result.hiringCalendar.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow">
                  <h3 className="text-lg font-semibold mb-4">
                    (From AI Analysis) Hiring Calendar Summary
                  </h3>

                  <div className="space-y-3">
                    {result.hiringCalendar.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center border rounded-lg p-4"
                      >
                        <span className="font-medium">{item.month}</span>
                        <span className="text-gray-600">{item.focus}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
}
