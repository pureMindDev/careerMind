const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";
const TOKEN_KEY = "careermind.token";

export function getToken() {
  return typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; form?: FormData } = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (!options.form) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_URL}/api${path}`, {
    method: options.method ?? (options.body || options.form ? "POST" : "GET"),
    headers,
    body: options.form ?? (options.body ? JSON.stringify(options.body) : undefined),
  });

  const text = await res.text();
  const payload = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(payload?.message || `Request failed (${res.status})`);
  return payload as T;
}

/* ---------------- types ---------------- */

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  plan: "Starter" | "Pro" | "Campus";
  role: "user" | "admin";
  targetRole?: string;
  bio?: string;
  theme?: string;
  emailVerified?: boolean;
};

export type CvAnalysis = {
  score: number;
  breakdown: { label: string; value: number }[];
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
};

export type JobMatch = {
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

export type InterviewFeedback = {
  score: number;
  metrics: { label: string; value: number }[];
  good: string[];
  fix: string[];
};

export type RoadmapData = {
  targetRole: string;
  overallProgress: number;
  phases: {
    phase: string;
    weeks: string;
    status: "done" | "active" | "todo";
    items: string[];
  }[];
  skillGaps: { skill: string; you: number; required: number }[];
};

export type DashboardStats = {
  profileCompletion: number;
  currentCvScore: number | null;
  progressData: { month: string; score: number; matches: number }[];
  skillRadar: { skill: string; you: number; market: number }[];
  insights: { title: string; body: string; tone: "warning" | "primary" | "success" }[];
  notifications: string[];
};

/* ---------------- auth ---------------- */

export const signupRequest = (data: { name: string; email: string; password: string }) =>
  request<{ token: string; user: UserProfile }>("/auth/signup", { body: data });

export const loginRequest = (data: { email: string; password: string }) =>
  request<{ token: string; user: UserProfile }>("/auth/login", { body: data });

export const requestPasswordReset = (data: { email: string }) =>
  request<{ ok: true }>("/auth/forgot-password", { body: data });

export const confirmPasswordReset = (data: { token: string; password: string }) =>
  request<{ ok: true }>("/auth/reset-password", { body: data });

export const verifyEmail = (data: { token: string }) =>
  request<{ ok: true; user: UserProfile }>("/auth/verify-email", { body: data });

export const resendVerificationEmail = (data: { email: string }) =>
  request<{ ok: true }>("/auth/resend-verification", { body: data });

export const getUserProfile = () => request<UserProfile>("/auth/me");

export const ensureUserProfile = () => Promise.resolve({ ok: true as const });

export const updateUserProfile = (args: {
  data: { fullName?: string; targetRole?: string; bio?: string };
}) => request<{ ok: true }>("/auth/profile", { method: "PUT", body: args.data });

export const updateUserSettings = (args: {
  data: {
    theme?: string;
    notifyMatches?: boolean;
    notifyCv?: boolean;
    notifyRoadmap?: boolean;
    notifyDigest?: boolean;
    notifyProduct?: boolean;
  };
}) => request<{ ok: true }>("/auth/settings", { method: "PUT", body: args.data });

/* ---------------- features ---------------- */

export const analyzeCV = (args: {
  data: { text: string; targetRole?: string; fileName?: string; fileSize?: number };
}) => request<CvAnalysis>("/cv/analyze", { body: args.data });

export const getLatestCVAnalysis = () => request<CvAnalysis | null>("/cv/latest");

/** Multer-backed upload: server extracts the text from the PDF/DOCX itself. */
export const uploadCV = (file: File, targetRole?: string) => {
  const form = new FormData();
  form.append("cv", file);
  if (targetRole) form.append("targetRole", targetRole);
  return request<CvAnalysis>("/cv/upload", { form });
};

export const getJobs = () => request<JobMatch[]>("/jobs");

export const getJobMatches = (args: {
  data: { targetRole?: string; skills?: string[]; experience?: string };
}) => request<JobMatch[]>("/jobs/matches", { body: args.data });

export const evaluateInterviewAnswer = (args: {
  data: { question: string; category?: string; answer: string };
}) => request<InterviewFeedback>("/interview/evaluate", { body: args.data });

export const getOrCreateRoadmap = (args: {
  data: { targetRole?: string; skills?: string[]; level?: string };
}) => request<RoadmapData>("/roadmap", { body: args.data });

export const getDashboardStats = (args: { data: { targetRole?: string } }) =>
  request<DashboardStats>("/dashboard/stats", { body: args.data });
