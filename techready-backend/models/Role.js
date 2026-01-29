// models/Role.js
import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema(
  {
    roleId: { type: String, unique: true, required: true }, // e.g. "sde", "data-analyst"
    title: { type: String, required: true },                // e.g. "Software Developer (SDE)"
    shortDesc: { type: String, default: "" },
    tags: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Role", RoleSchema);
