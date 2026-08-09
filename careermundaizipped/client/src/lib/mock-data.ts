export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  match: number;
  reasons: string[];
  missing: string[];
  tags: string[];
};

export const jobs: Job[] = [
  {
    id: "1",
    title: "Frontend Engineer",
    company: "Northwind Labs",
    location: "Remote · EU",
    type: "Full-time",
    salary: "$78k – $96k",
    match: 94,
    reasons: [
      "Your React and TypeScript depth maps to 9/10 core requirements",
      "3 shipped dashboard projects match their product surface",
      "Design-system experience is explicitly requested",
    ],
    missing: ["GraphQL"],
    tags: ["React", "TypeScript", "Tailwind"],
  },
  {
    id: "2",
    title: "Product Engineer (AI)",
    company: "Cortexa",
    location: "Berlin · Hybrid",
    type: "Full-time",
    salary: "$85k – $110k",
    match: 88,
    reasons: [
      "LLM integration work in your portfolio matches their stack",
      "Strong product sense signalled by your CV outcomes",
    ],
    missing: ["Python", "Vector databases"],
    tags: ["AI", "Next.js", "Node"],
  },
  {
    id: "3",
    title: "Junior Data Analyst",
    company: "Helio Retail",
    location: "London · On-site",
    type: "Graduate",
    salary: "$48k – $58k",
    match: 76,
    reasons: [
      "SQL and dashboarding experience covers the daily work",
      "Retail analytics coursework is directly relevant",
    ],
    missing: ["Power BI", "Statistics certification"],
    tags: ["SQL", "Analytics"],
  },
  {
    id: "4",
    title: "UX Engineer Intern",
    company: "Formlane",
    location: "Remote",
    type: "Internship",
    salary: "$2.4k / month",
    match: 71,
    reasons: ["Portfolio shows accessible component work", "Figma-to-code workflow match"],
    missing: ["Motion design", "User research"],
    tags: ["UX", "Figma", "React"],
  },
];

export const insights = [
  {
    title: "Your CV buries impact",
    body: "8 of 14 bullet points describe duties, not outcomes. Rewriting them with metrics typically lifts recruiter callbacks by ~34%.",
    tone: "warning" as const,
  },
  {
    title: "You are 2 skills from senior roles",
    body: "Adding system design and GraphQL unlocks 41 additional matched roles in your region.",
    tone: "primary" as const,
  },
  {
    title: "Strong interview trajectory",
    body: "Your last 3 mock interviews improved from 62 to 81. Keep drilling behavioural STAR structure.",
    tone: "success" as const,
  },
];

export const progressData = [
  { month: "Feb", score: 41, matches: 6 },
  { month: "Mar", score: 52, matches: 11 },
  { month: "Apr", score: 58, matches: 15 },
  { month: "May", score: 67, matches: 22 },
  { month: "Jun", score: 74, matches: 29 },
  { month: "Jul", score: 82, matches: 38 },
];

export const skillRadar = [
  { skill: "Frontend", you: 88, market: 70 },
  { skill: "Backend", you: 54, market: 68 },
  { skill: "AI / ML", you: 46, market: 72 },
  { skill: "Data", you: 61, market: 64 },
  { skill: "Comms", you: 78, market: 66 },
  { skill: "System design", you: 43, market: 74 },
];

export const roadmap = [
  {
    phase: "Phase 1 · Foundation",
    weeks: "Weeks 1–3",
    status: "done" as const,
    items: ["Advanced TypeScript patterns", "Testing with Vitest", "CV rewrite with impact metrics"],
  },
  {
    phase: "Phase 2 · Depth",
    weeks: "Weeks 4–8",
    status: "active" as const,
    items: ["System design fundamentals", "GraphQL + caching", "Ship one public case study"],
  },
  {
    phase: "Phase 3 · Signal",
    weeks: "Weeks 9–12",
    status: "todo" as const,
    items: ["Open-source contribution", "Mock interview loop x6", "Referral outreach sprint"],
  },
  {
    phase: "Phase 4 · Offer",
    weeks: "Weeks 13–16",
    status: "todo" as const,
    items: ["Salary negotiation drills", "Portfolio polish", "Final onsite simulations"],
  },
];

export const skillGaps = [
  { skill: "System design", have: 43, need: 75 },
  { skill: "GraphQL", have: 20, need: 65 },
  { skill: "Python", have: 35, need: 60 },
  { skill: "Cloud (AWS)", have: 28, need: 70 },
];

export const interviewQuestions = [
  {
    id: "q1",
    category: "Behavioural",
    question: "Tell me about a time you shipped something under an unrealistic deadline.",
    hint: "Use STAR: Situation, Task, Action, Result — and end with a measurable outcome.",
  },
  {
    id: "q2",
    category: "Technical",
    question: "How would you optimise a React dashboard that re-renders on every keystroke?",
    hint: "Talk about state colocation, memoisation, and measuring before optimising.",
  },
  {
    id: "q3",
    category: "Role fit",
    question: "Why this company, and what would you change about our product in week one?",
    hint: "Show research: one specific product observation beats generic praise.",
  },
  {
    id: "q4",
    category: "Failure",
    question: "Describe a rejection that changed how you work.",
    hint: "Own the failure quickly, then spend 70% of the answer on the change you made.",
  },
];

export const testimonials = [
  {
    name: "Amira Haddad",
    role: "Graduate → Frontend Engineer @ Klarna",
    quote:
      "I had 42 rejections and zero feedback. CareerMind told me exactly what recruiters were skipping. Four weeks later I signed an offer.",
  },
  {
    name: "Daniel Okoro",
    role: "Analyst → Product Manager @ Bolt",
    quote:
      "The skill-gap map was brutal and correct. I stopped applying blindly and started closing the two gaps that actually mattered.",
  },
  {
    name: "Sofia Lindqvist",
    role: "Final-year student",
    quote:
      "The interview coach caught my rambling answers before a real panel did. My mock score went from 58 to 87.",
  },
];

export const faqs = [
  {
    q: "How does the CV analysis actually work?",
    a: "We parse your PDF or DOCX, extract structure and language, then score it against how applicant tracking systems and human recruiters read a document — keywords, impact statements, formatting, and role alignment.",
  },
  {
    q: "Is my data private?",
    a: "Your CV and answers are yours. We never sell data, and you can permanently delete every uploaded document from Settings at any time.",
  },
  {
    q: "Do I need to be a graduate to use this?",
    a: "No. Students, graduates, career switchers, and senior professionals all use CareerMind — the roadmap adapts to your level.",
  },
  {
    q: "Can it help with interviews in my language?",
    a: "The interview coach supports text and voice answers, and gives feedback on structure, specificity, and confidence signals.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Plans are monthly, cancel in one click from Settings, and you keep access until the end of the period.",
  },
];

export const pricing = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    blurb: "See why you're getting rejected.",
    features: ["1 CV analysis / month", "10 job matches", "Basic skill gaps", "Community support"],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/ month",
    blurb: "The full career operating system.",
    features: [
      "Unlimited CV analyses",
      "Unlimited job matching + reasons",
      "Interview coach (text + voice)",
      "Personalised 16-week roadmap",
      "AI cover letters",
      "Portfolio builder",
    ],
    cta: "Go Pro",
    featured: true,
  },
  {
    name: "Campus",
    price: "$9",
    period: "/ student",
    blurb: "For universities and bootcamps.",
    features: [
      "Everything in Pro",
      "Cohort analytics dashboard",
      "Internship recommendations",
      "Admin seat management",
    ],
    cta: "Talk to us",
    featured: false,
  },
];
