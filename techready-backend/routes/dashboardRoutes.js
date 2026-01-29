// routes/dashboardRoutes.js
import express from "express";
import HiringEvent from "../models/HiringEvent.js";

import Role from "../models/Role.js";
import ChecklistItem from "../models/ChecklistItem.js";
import UserChecklistProgress from "../models/UserChecklistProgress.js";
import RoleGuide from "../models/RoleGuide.js";

const router = express.Router();

function monthRangeUTC(yyyyMM) {
  const [y, m] = yyyyMM.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
  const end = new Date(Date.UTC(y, m, 1, 1, 0, 0, 0)); // next month start
  return { start, end };
}

/** 1) Indian Hiring Calendar (current month focus) */
router.get("/hiring-calendar", async (req, res) => {
  try {
    const now = new Date();
    const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    const yyyy = ist.getUTCFullYear();
    const mm = String(ist.getUTCMonth() + 1).padStart(2, "0");
    const month = req.query.month || `${yyyy}-${mm}`;

    const { start, end } = monthRangeUTC(month);

    const events = await HiringEvent.find({
      isActive: true,
      startDate: { $lt: end },
      endDate: { $gte: start },
    })
      .sort({ startDate: 1 })
      .lean();

    res.json({ month, events });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to load hiring calendar", error: err.message });
  }
});

/** 2) Roles list (for dropdown) */
router.get("/roles", async (req, res) => {
  try {
    const roles = await Role.find({ isActive: true }).sort({ title: 1 }).lean();
    res.json({ roles });
  } catch (err) {
    res.status(500).json({ message: "Failed to load roles", error: err.message });
  }
});

/** 3) Checklist for role (merged with user progress)
 *  NOTE: using demo user until you add auth
 */
router.get("/role/:roleId/checklist", async (req, res) => {
  try {
    const { roleId } = req.params;

    // Temporary user id (until auth is added)
    const userId = "demo-user";

    const items = await ChecklistItem.find({ roleId, isActive: true })
      .sort({ category: 1, order: 1 })
      .lean();

    const progress = await UserChecklistProgress.find({ userId, roleId }).lean();
    const progressMap = new Map(progress.map((p) => [String(p.itemId), p.completed]));

    const merged = items.map((it) => ({
      ...it,
      completed: progressMap.get(String(it._id)) || false,
    }));

    res.json({ roleId, items: merged });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to load checklist", error: err.message });
  }
});

/** 4) Toggle checklist item completion */
router.post("/role/:roleId/checklist/:itemId/toggle", async (req, res) => {
  try {
    const { roleId, itemId } = req.params;
    const userId = "demo-user";

    const existing = await UserChecklistProgress.findOne({
      userId,
      roleId,
      itemId,
    });

    const nextCompleted = !(existing?.completed);

    const updated = await UserChecklistProgress.findOneAndUpdate(
      { userId, roleId, itemId },
      {
        $set: {
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date() : null,
        },
      },
      { upsert: true, new: true }
    ).lean();

    res.json({ ok: true, progress: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update progress", error: err.message });
  }
});

/** 5) Guide for role ("How to prepare for this role") */
router.get("/role/:roleId/guide", async (req, res) => {
  try {
    const { roleId } = req.params;
    const guide = await RoleGuide.findOne({ roleId, isActive: true }).lean();
    res.json({ roleId, guide: guide || null });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to load role guide", error: err.message });
  }
});

export default router;
