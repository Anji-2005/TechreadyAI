// models/UserChecklistProgress.js
import mongoose from "mongoose";

const UserChecklistProgressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true }, // adapt to your auth user id type
    roleId: { type: String, required: true, index: true },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

UserChecklistProgressSchema.index({ userId: 1, roleId: 1, itemId: 1 }, { unique: true });

export default mongoose.model("UserChecklistProgress", UserChecklistProgressSchema);
