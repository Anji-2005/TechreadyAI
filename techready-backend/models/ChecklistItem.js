// models/ChecklistItem.js
import mongoose from "mongoose";

const ChecklistItemSchema = new mongoose.Schema(
  {
    roleId: { type: String, required: true, index: true },
    category: { type: String, required: true },  // e.g. "DSA", "Projects", "Resume"
    title: { type: String, required: true },
    detail: { type: String, default: "" },
    priority: { type: String, enum: ["P0", "P1", "P2"], default: "P1" },
    estHours: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    resources: {
      type: [
        {
          label: String,
          url: String,
        },
      ],
      default: [],
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ChecklistItemSchema.index({ roleId: 1, category: 1, order: 1 });

export default mongoose.model("ChecklistItem", ChecklistItemSchema);
