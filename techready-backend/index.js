import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || true,
    credentials: true,
  })
);

// Body parser MUST come before routes
app.use(express.json({ limit: "2mb" }));

// Optional: root route so localhost:5000 doesn't show "Cannot GET /"
app.get("/", (req, res) => {
  res.send("TechReady backend is running. Use /health or POST /analyze");
});

// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true, service: "techready-backend" });
});

/**
 * POST /analyze
 * For now: returns realistic JSON (mock AI output)
 * Later: replace with actual LLM call.
 */
app.post("/analyze", async (req, res) => {
  const { role, year, time, resumeText } = req.body || {};

  if (!role || !year || !time) {
    return res.status(400).json({
      error: "Missing required fields: role, year, time",
    });
  }

  await new Promise((resolve) => setTimeout(resolve, 2000));

  const result = {
    atsScore: role === "SDE" ? 62 : 68,
    readiness: role === "SDE" ? "Needs DSA Focus" : "Moderately Ready",
    topFixes: [
      "Add measurable outcomes to projects (numbers, impact, scale)",
      "Improve ATS formatting (consistent headings + bullet structure)",
      "Add role-relevant keywords and tools in Skills/Projects",
    ],
    skillsPresent:
      role === "SDE"
        ? ["Java", "OOP", "Arrays", "Git"]
        : ["Python", "Statistics", "Pandas"],
    skillsMissing:
      role === "SDE"
        ? ["DSA Patterns", "System Design Basics", "Projects with deployment"]
        : ["Advanced SQL", "Excel Dashboards", "Case Study Thinking"],
    roadmap: [
      {
        week: 1,
        tasks:
          role === "SDE"
            ? ["Revise arrays/strings", "Solve 10 easy + 5 medium DSA"]
            : ["Revise SQL basics", "Practice joins & subqueries"],
      },
      {
        week: 2,
        tasks:
          role === "SDE"
            ? ["Learn hashing/two pointers", "Build 1 mini project"]
            : ["Build Excel dashboard project", "Learn Pivot Tables"],
      },
      {
        week: 3,
        tasks:
          role === "SDE"
            ? ["Trees/recursion basics", "2 mock interviews (DSA)"]
            : ["Power BI basics", "Mini analytics project"],
      },
      {
        week: 4,
        tasks:
          role === "SDE"
            ? ["Revise patterns", "Resume refinement + GitHub cleanup"]
            : ["Mock interviews", "Resume improvement"],
      },
    ],
    hiringCalendar: [
      { month: "Feb–Mar", focus: "Internship hiring (IT/Analytics)" },
      { month: "Jul–Sep", focus: "Campus placements (major season)" },
      { month: "Oct–Nov", focus: "Big 4 / Consulting / late drives" },
    ],
    meta: {
      input: { role, year, time, resumeTextProvided: Boolean(resumeText) },
      generatedAt: new Date().toISOString(),
    },
  };

  res.json(result);
});

// ✅ NEW: dashboard APIs
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("✅ MongoDB connected");
    } else {
      console.log("⚠️ MONGO_URI missing: Dashboard features will not persist data");
    }

    app.listen(PORT, () => {
      console.log(`TechReady backend running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
}

start();


