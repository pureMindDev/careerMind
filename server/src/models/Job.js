import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: String,
    type: String,
    salary: String,
    description: String,
    tags: [String],
  },
  { timestamps: true },
);

export const Job = mongoose.model("Job", jobSchema);
