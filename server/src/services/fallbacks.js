/** Deterministic offline versions of every AI feature (used when AI_API_KEY is unset). */

function clamp(n) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function hashScore(text, seed = 7) {
  let h = seed;
  for (let i = 0; i < text.length; i += 1) h = (h * 31 + text.charCodeAt(i)) % 100003;
  return 55 + (h % 40);
}

export function fallbackCvAnalysis(text) {
  const words = text.split(/\s+/).filter(Boolean).length;
  const hasMetrics = /\d+%|\$\d|\d+x|\d+\+/.test(text);
  const hasSections = /(experience|education|skills)/i.test(text);
  const base = clamp(45 + Math.min(words / 25, 25) + (hasMetrics ? 12 : 0) + (hasSections ? 10 : 0));

  return {
    score: base,
    breakdown: [
      { label: "ATS readability", value: clamp(base + (hasSections ? 8 : -8)) },
      { label: "Impact & metrics", value: clamp(hasMetrics ? base + 6 : base - 18) },
      { label: "Role keyword match", value: clamp(base - 4) },
      { label: "Structure & length", value: clamp(words > 250 && words < 900 ? base + 6 : base - 12) },
      { label: "Clarity of language", value: clamp(base + 3) },
    ],
    strengths: [
      hasSections ? "Clear section headings that ATS parsers can read" : "Concise, readable layout",
      "Relevant experience is presented up front",
      "Technical vocabulary matches the target role",
    ],
    weaknesses: [
      hasMetrics ? "Some bullets still describe duties, not outcomes" : "Almost no quantified results",
      words < 250 ? "CV is too short to demonstrate depth" : "A few bullets run long and lose impact",
      "Summary does not name the target role explicitly",
    ],
    improvements: [
      "Rewrite each bullet as action + metric + result.",
      "Add a two-line summary naming your target role and top three skills.",
      "Mirror keywords from the job description in your skills section.",
      "Keep the CV to one or two pages with consistent tense.",
    ],
  };
}

export function fallbackJobMatch(job, profile) {
  const target = (profile.targetRole || "").toLowerCase();
  const tags = (job.tags || []).map((t) => t.toLowerCase());
  const skills = (profile.skills || []).map((s) => s.toLowerCase());
  const overlap = tags.filter((t) => skills.includes(t) || target.includes(t));
  const score = clamp(hashScore(job.title + job.company) + overlap.length * 6);

  return {
    match: score,
    reasons: [
      overlap.length
        ? `Your ${overlap.slice(0, 2).join(" and ")} experience maps directly to this role`
        : `The role sits in the same area as your target: ${profile.targetRole || "your stated focus"}`,
      `${job.type || "Role"} in ${job.location || "your region"} fits your stated preferences`,
    ],
    missing: tags.filter((t) => !overlap.includes(t)).slice(0, 3).map((t) => `Deeper ${t} experience`),
  };
}

export function fallbackInterviewFeedback(answer) {
  const words = answer.split(/\s+/).filter(Boolean).length;
  const star = /(situation|task|action|result|because|so that)/i.test(answer);
  const metrics = /\d/.test(answer);
  const base = clamp(50 + Math.min(words / 6, 25) + (star ? 10 : -5) + (metrics ? 8 : -5));

  return {
    score: base,
    metrics: [
      { label: "Structure (STAR)", value: clamp(star ? base + 8 : base - 15) },
      { label: "Specificity", value: clamp(metrics ? base + 6 : base - 12) },
      { label: "Conciseness", value: clamp(words > 260 ? base - 14 : base + 5) },
      { label: "Confidence signals", value: clamp(base) },
    ],
    good: [
      star ? "You followed a recognisable STAR structure" : "You answered the question directly",
      metrics ? "You backed the story with numbers" : "Your example was relevant to the role",
    ],
    fix: [
      metrics ? "Tie the result to a business outcome" : "Add at least one measurable result",
      words > 260 ? "Cut the setup and get to the action faster" : "Expand the action you personally took",
      "Close with what you would do differently next time",
    ],
  };
}

export function fallbackRoadmap(targetRole = "Senior Frontend Engineer") {
  return {
    targetRole,
    overallProgress: 25,
    phases: [
      {
        phase: "Foundations",
        weeks: "Weeks 1-4",
        status: "done",
        items: ["Core language deep-dive", "Data structures refresh", "Git and code review habits"],
      },
      {
        phase: "Core craft",
        weeks: "Weeks 5-8",
        status: "active",
        items: ["Testing strategy", "Performance profiling", "Design systems and accessibility"],
      },
      {
        phase: "Systems & scale",
        weeks: "Weeks 9-12",
        status: "todo",
        items: ["Architecture patterns", "Caching and data flow", "Observability basics"],
      },
      {
        phase: "Proof & interviews",
        weeks: "Weeks 13-16",
        status: "todo",
        items: ["Ship a portfolio project", "Mock interviews", "Salary negotiation prep"],
      },
    ],
    skillGaps: [
      { skill: "Testing", you: 55, required: 85 },
      { skill: "System design", you: 45, required: 80 },
      { skill: "Performance", you: 60, required: 85 },
      { skill: "Accessibility", you: 50, required: 75 },
      { skill: "Communication", you: 70, required: 85 },
      { skill: "Leadership", you: 40, required: 70 },
    ],
  };
}

export function fallbackDashboard({ profileCompletion, currentCvScore, interviewCount }) {
  const base = currentCvScore ?? 62;
  const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"];

  return {
    profileCompletion,
    currentCvScore: currentCvScore ?? null,
    progressData: months.map((month, i) => ({
      month,
      score: clamp(base - (months.length - 1 - i) * 5),
      matches: 4 + i * 2,
    })),
    skillRadar: [
      { skill: "Frontend", you: clamp(base + 6), market: 78 },
      { skill: "Backend", you: clamp(base - 12), market: 74 },
      { skill: "Data", you: clamp(base - 20), market: 66 },
      { skill: "Cloud", you: clamp(base - 8), market: 72 },
      { skill: "Communication", you: clamp(base + 10), market: 80 },
      { skill: "Leadership", you: clamp(base - 15), market: 68 },
    ],
    insights: [
      {
        title: "Your CV under-sells your impact",
        body: "Most bullets describe tasks. Quantify two of them this week to lift your score.",
        tone: "warning",
      },
      {
        title: "You match mid-level roles best",
        body: "Focus applications on roles asking for 2-4 years — your match rate is highest there.",
        tone: "primary",
      },
      {
        title: `${interviewCount} practice sessions logged`,
        body: "Keep the streak going: structure improves fastest with three sessions a week.",
        tone: "success",
      },
    ],
    notifications: [
      "3 new roles matched above 85%",
      "Your CV score changed since last upload",
      "New roadmap milestone unlocked",
    ],
  };
}
