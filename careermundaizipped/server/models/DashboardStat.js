import mongoose from "mongoose";

const dashboardStatSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    profileCompletion: { type: Number, default: 0 },
    currentCvScore: { type: Number, default: null },
    progressData: [{ month: String, score: Number, matches: Number, _id: false }],
    skillRadar: [{ skill: String, you: Number, market: Number, _id: false }],
    insights: [{ title: String, body: String, tone: String, _id: false }],
    notifications: [String],
  },
  { timestamps: true },
);

export const DashboardStat = mongoose.model("DashboardStat", dashboardStatSchema);
