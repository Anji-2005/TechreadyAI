// models/HiringEvent.js
import mongoose from "mongoose";

const HiringEventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    orgType: {
      type: String,
      enum: ["Product", "Service", "Startup", "Government", "Hackathon", "Campus", "Other"],
      default: "Other",
    },
    roles: {
      type: [String], // e.g. ["SDE", "Data Analyst", "ML Engineer"]
      default: [],
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    locationScope: { type: String, default: "India" },
    link: { type: String, default: "" },
    notes: { type: String, default: "" },
    tags: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

HiringEventSchema.index({ startDate: 1, endDate: 1, isActive: 1 });

export default mongoose.model("HiringEvent", HiringEventSchema);
