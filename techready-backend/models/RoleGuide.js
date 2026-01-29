// models/RoleGuide.js
import mongoose from "mongoose";

const RoleGuideSchema = new mongoose.Schema(
  {
    roleId: { type: String, required: true, unique: true },
    overview: { type: String, default: "" },
    interviewFormat: { type: [String], default: [] },
    roadmap: {
      type: [
        {
          week: String,          // e.g. "Week 1-2"
          focus: String,         // e.g. "Arrays/Strings + Resume"
          tasks: [String],
        },
      ],
      default: [],
    },
    standoutProjects: { type: [String], default: [] },
    mistakesToAvoid: { type: [String], default: [] },
    resources: {
      type: [
        { label: String, url: String }
      ],
      default: [],
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("RoleGuide", RoleGuideSchema);
