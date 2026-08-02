import mongoose from "mongoose";

const cvAnalysisSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    fileName: String,
    fileSize: Number,
    score: { type: Number, required: true },
    breakdown: [{ label: String, value: Number, _id: false }],
    strengths: [String],
    weaknesses: [String],
    improvements: [String],
    rawText: String,
  },
  { timestamps: true },
);

export const CvAnalysis = mongoose.model("CvAnalysis", cvAnalysisSchema);
