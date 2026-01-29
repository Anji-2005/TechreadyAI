import mongoose from "mongoose";
import dotenv from "dotenv";
import HiringEvent from "../models/HiringEvent.js";

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  await HiringEvent.deleteMany({ title: /TechReady Sample/i });

  const now = new Date();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();

  await HiringEvent.insertMany([
    {
      title: "TechReady Sample: Internship shortlisting window",
      orgType: "Product",
      roles: ["SDE", "Data Analyst", "ML Engineer"],
      startDate: new Date(Date.UTC(y, m, 1)),
      endDate: new Date(Date.UTC(y, m, 18)),
      notes: "Track career pages + referrals + LinkedIn openings.",
      tags: ["internship", "shortlisting"],
      isActive: true,
    },
    {
      title: "TechReady Sample: Hackathon season (projects + referrals)",
      orgType: "Hackathon",
      roles: ["SDE", "ML Engineer"],
      startDate: new Date(Date.UTC(y, m, 10)),
      endDate: new Date(Date.UTC(y, m, 28)),
      notes: "Aim for 1 submission + write-up + LinkedIn post.",
      tags: ["hackathon"],
      isActive: true,
    },
  ]);

  console.log("✅ Seeded calendar events");
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error("❌ Seed failed:", e.message);
  process.exit(1);
});

