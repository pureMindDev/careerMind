import mongoose from "mongoose";

const interviewPracticeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    question: { type: String, required: true },
    category: String,
    answer: { type: String, required: true },
    score: Number,
    metrics: [{ label: String, value: Number, _id: false }],
    feedbackGood: [String],
    feedbackFix: [String],
  },
  { timestamps: true },
);

export const InterviewPractice = mongoose.model("InterviewPractice", interviewPracticeSchema);
