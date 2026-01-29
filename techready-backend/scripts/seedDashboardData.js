import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import HiringEvent from "../models/HiringEvent.js";
import Role from "../models/Role.js";
import ChecklistItem from "../models/ChecklistItem.js";
import RoleGuide from "../models/RoleGuide.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

async function run() {
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is missing. Check your .env in backend root.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected for seeding");

  // Roles
  await Role.updateOne(
    { roleId: "sde" },
    { $set: { title: "Software Developer (SDE)", shortDesc: "DSA + projects + CS fundamentals" } },
    { upsert: true }
  );

  await Role.updateOne(
    { roleId: "data-analyst" },
    { $set: { title: "Data Analyst", shortDesc: "SQL + dashboards + business thinking" } },
    { upsert: true }
  );

  await Role.updateOne(
    { roleId: "ml-engineer" },
    { $set: { title: "ML Engineer", shortDesc: "ML fundamentals + projects + deployment basics" } },
    { upsert: true }
  );

  // Checklist (example for SDE)
  const sdeItems = [
    { category: "DSA", title: "Finish Arrays + Strings basics", priority: "P0", estHours: 8, order: 1 },
    { category: "DSA", title: "Solve 40 problems (2-pointer, hashing, sliding window)", priority: "P0", estHours: 20, order: 2 },
    { category: "CS Fundamentals", title: "OS basics: process/thread, scheduling, deadlock", priority: "P1", estHours: 6, order: 1 },
    { category: "Projects", title: "1 full-stack project with auth + CRUD + deployment", priority: "P0", estHours: 25, order: 1 },
    { category: "Resume", title: "Quantify impact in 3 bullets per project", priority: "P0", estHours: 2, order: 1 },
  ];

  await ChecklistItem.deleteMany({ roleId: "sde" });
  await ChecklistItem.insertMany(sdeItems.map((x) => ({ roleId: "sde", ...x })));

  // Role guide (example for SDE)
  await RoleGuide.updateOne(
    { roleId: "sde" },
    {
      $set: {
        overview:
          "SDE hiring in India typically evaluates DSA problem solving, communication, and at least one solid deployed project.",
        interviewFormat: [
          "Online assessment (DSA)",
          "1–2 coding rounds (medium DSA)",
          "CS fundamentals (OS/DBMS/Networks) for many companies",
          "Project deep-dive + behavioral",
        ],
        roadmap: [
          {
            week: "Week 1–2",
            focus: "Core DSA + Resume clean-up",
            tasks: ["Arrays/Strings/Hashing", "Rewrite resume bullets with metrics", "Deploy one project"],
          },
          {
            week: "Week 3–4",
            focus: "Intermediate DSA + CS basics",
            tasks: ["Sliding window, stacks, binary search", "OS + DBMS basics notes", "Mock interviews (2)"],
          },
        ],
        standoutProjects: [
          "Real users + auth + payments/notifications (even small scale)",
          "Good engineering: clean API, validations, pagination, logs",
          "Deployed on Vercel/Render + database + monitoring basics",
        ],
        mistakesToAvoid: [
          "Only LeetCode with no projects",
          "Projects with no measurable outcome and no deployment",
          "Not being able to explain trade-offs / edge cases",
        ],
        resources: [
          { label: "Striver DSA Sheet", url: "https://takeuforward.org/" },
          { label: "System Design (basics)", url: "https://github.com/donnemartin/system-design-primer" },
        ],
      },
    },
    { upsert: true }
  );

  // Hiring calendar sample (for current month; edit freely)
  // NOTE: Put approximate India hiring season items—this is meant to be customizable.
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth(); // 0-based

  await HiringEvent.deleteMany({ title: /TechReady AI Sample/i });

  await HiringEvent.insertMany([
    {
      title: "TechReady AI Sample: Product company internship shortlisting window",
      orgType: "Product",
      roles: ["SDE", "Data Analyst", "ML Engineer"],
      startDate: new Date(Date.UTC(y, m, 1)),
      endDate: new Date(Date.UTC(y, m, 20)),
      link: "",
      notes: "Track career pages + referrals + LinkedIn openings.",
      tags: ["internship", "shortlisting"],
    },
    {
      title: "TechReady AI Sample: Hackathon season (good for projects + referrals)",
      orgType: "Hackathon",
      roles: ["SDE", "ML Engineer"],
      startDate: new Date(Date.UTC(y, m, 10)),
      endDate: new Date(Date.UTC(y, m, 30)),
      link: "",
      notes: "Aim for 1 submission + write-up.",
      tags: ["hackathon"],
    },
  ]);

  console.log("Seed complete ✅");
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
