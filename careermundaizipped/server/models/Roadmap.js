import mongoose from "mongoose";

const roadmapSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    targetRole: String,
    overallProgress: { type: Number, default: 0 },
    phases: [
      {
        phase: String,
        weeks: String,
        status: { type: String, enum: ["done", "active", "todo"], default: "todo" },
        items: [String],
        _id: false,
      },
    ],
    skillGaps: [{ skill: String, you: Number, required: Number, _id: false }],
  },
  { timestamps: true },
);

export const Roadmap = mongoose.model("Roadmap", roadmapSchema);
