import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { Job } from "./models/Job.js";
import { User } from "./models/User.js";

const jobs = [
  {
    title: "Frontend Engineer",
    company: "Northwind Labs",
    location: "Remote (EU)",
    type: "Full-time",
    salary: "£55k - £70k",
    description: "Build design-system driven product surfaces in React and TypeScript.",
    tags: ["react", "typescript", "design systems", "testing"],
  },
  {
    title: "Full-stack Developer",
    company: "Kaya Health",
    location: "London, UK (Hybrid)",
    type: "Full-time",
    salary: "£60k - £78k",
    description: "Own features end to end across Node, Express and MongoDB with a React frontend.",
    tags: ["node", "express", "mongodb", "react"],
  },
  {
    title: "Graduate Software Engineer",
    company: "Orbit Financial",
    location: "Manchester, UK",
    type: "Graduate",
    salary: "£32k - £38k",
    description: "Structured graduate programme across backend services and data pipelines.",
    tags: ["javascript", "sql", "algorithms"],
  },
  {
    title: "Product Data Analyst",
    company: "Lumen Retail",
    location: "Remote (UK)",
    type: "Full-time",
    salary: "£45k - £58k",
    description: "Turn product telemetry into decisions with SQL, Python and dashboards.",
    tags: ["sql", "python", "analytics", "visualisation"],
  },
  {
    title: "Junior DevOps Engineer",
    company: "Skyforge Cloud",
    location: "Remote (Global)",
    type: "Full-time",
    salary: "$70k - $90k",
    description: "Automate CI/CD, containers and infrastructure as code on AWS.",
    tags: ["aws", "docker", "terraform", "ci/cd"],
  },
  {
    title: "UX Engineer",
    company: "Perch Studio",
    location: "Berlin, DE (Hybrid)",
    type: "Contract",
    salary: "€500/day",
    description: "Bridge design and code: prototypes, accessibility and motion systems.",
    tags: ["react", "accessibility", "animation", "figma"],
  },
];

async function run() {
  await connectDB();
  await Job.deleteMany({});
  await Job.insertMany(jobs);
  console.log(`Seeded ${jobs.length} jobs`);

  const demoEmail = "demo@careermind.ai";
  if (!(await User.findOne({ email: demoEmail }))) {
    await User.create({
      name: "Demo User",
      email: demoEmail,
      password: "demopassword123",
      targetRole: "Senior Frontend Engineer",
      bio: "Frontend developer with 3 years of React experience moving into a senior role.",
    });
    console.log(`Seeded demo account: ${demoEmail} / demopassword123`);
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
