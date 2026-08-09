import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight, Bell, Loader2, Sparkles, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { getDashboardStats } from "@/lib/api";
import type { DashboardStats } from "@/lib/api";


const toneClass = {
  warning: "border-warning/30 bg-warning/10",
  primary: "border-primary/30 bg-primary/10",
  success: "border-success/30 bg-success/10",
};

const fallbackData: DashboardStats = {
  profileCompletion: 0,
  currentCvScore: null,
  progressData: [
    { month: "Feb", score: 41, matches: 6 },
    { month: "Mar", score: 52, matches: 12 },
    { month: "Apr", score: 61, matches: 18 },
    { month: "May", score: 70, matches: 24 },
    { month: "Jun", score: 78, matches: 31 },
    { month: "Jul", score: 82, matches: 38 },
  ],
  skillRadar: [
    { skill: "Frontend", you: 88, market: 70 },
    { skill: "System Design", you: 54, market: 82 },
    { skill: "Data Analysis", you: 62, market: 75 },
    { skill: "Communication", you: 80, market: 78 },
    { skill: "Leadership", you: 45, market: 68 },
    { skill: "AI/ML", you: 38, market: 72 },
  ],
  insights: [
    { title: "Skill gap", body: "System design and AI/ML are the biggest gaps for your target role.", tone: "warning" },
    { title: "CV strength", body: "Your latest CV score is above average for applicants in this space.", tone: "primary" },
    { title: "Momentum", body: "You have practised 3 interviews this week. Keep the streak going.", tone: "success" },
  ],
  notifications: ["3 new roles matched above 85%", "Interview coach report ready", "Roadmap milestone completed"],
};

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>(fallbackData);
  const [loading, setLoading] = useState(true);
  const fetchStats = (getDashboardStats);

  useEffect(() => {
    let cancelled = false;
    fetchStats({ data: { targetRole: user?.targetRole } })
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((err) => {
        console.error("Dashboard stats failed", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchStats, user?.targetRole]);

  return (
    <AppShell
      title={`Welcome back, ${user?.name?.split(" ")[0] ?? "there"}`}
      subtitle="Here's where your career stands today."
    >
      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading your dashboard…
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="glass rounded-3xl p-6 animate-rise">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Profile completion</p>
            <Badge variant="secondary">{stats.profileCompletion}%</Badge>
          </div>
          <p className="mt-3 font-display text-4xl font-bold gradient-text">{stats.profileCompletion}%</p>
          <Progress value={stats.profileCompletion} className="mt-4" />
          <p className="mt-3 text-xs text-muted-foreground">
            Add 2 projects and a portfolio link to reach 100%.
          </p>
        </div>

        <div className="glass rounded-3xl p-6 animate-rise">
          <p className="text-sm text-muted-foreground">Current CV score</p>
          <p className="mt-3 font-display text-4xl font-bold">
            {stats.currentCvScore ?? "—"}
            <span className="text-lg text-muted-foreground">{stats.currentCvScore ? "/100" : ""}</span>
          </p>
          <p className="mt-4 flex items-center gap-1 text-xs text-success">
            <TrendingUp className="size-3.5" /> {stats.currentCvScore ? "+15 since your last upload" : "Upload a CV to get a score"}
          </p>
          <Button asChild size="sm" variant="outline" className="mt-4">
            <Link to="/cv-analyzer">Re-analyse CV</Link>
          </Button>
        </div>

        <div className="glass rounded-3xl p-6 animate-rise">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Bell className="size-4 text-accent" /> Live notifications
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            {stats.notifications.map((note: string, i: number) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                {note}
              </li>
            ))}

          </ul>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-5">
        <div className="glass rounded-3xl p-6 lg:col-span-3">
          <h2 className="text-base font-semibold">Career progress</h2>
          <p className="text-xs text-muted-foreground">CV score and matched roles over time</p>
          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.progressData}>
                <defs>
                  <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="matchFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    color: "var(--color-popover-foreground)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="var(--color-chart-1)"
                  fill="url(#scoreFill)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="matches"
                  stroke="var(--color-chart-2)"
                  fill="url(#matchFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-6 lg:col-span-2">
          <h2 className="text-base font-semibold">Skills vs market demand</h2>
          <p className="text-xs text-muted-foreground">Where you lead and where you lag</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={stats.skillRadar}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis
                  dataKey="skill"
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                />
                <Radar
                  dataKey="market"
                  stroke="var(--color-chart-2)"
                  fill="var(--color-chart-2)"
                  fillOpacity={0.15}
                />
                <Radar
                  dataKey="you"
                  stroke="var(--color-chart-1)"
                  fill="var(--color-chart-1)"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Recommended jobs</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/job-matcher">
                View all <ArrowUpRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-3 space-y-3">
            <div className="glass flex items-center gap-4 rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-0.5">
              <div className="min-w-0">
                <p className="truncate font-semibold">Open the Job Matcher</p>
                <p className="truncate text-xs text-muted-foreground">
                  AI-ranked roles with match reasons and missing skills.
                </p>
              </div>
              <div className="ml-auto text-right">
                <Button asChild size="sm" className="gradient-brand text-primary-foreground">
                  <Link to="/job-matcher">Find roles</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <Sparkles className="size-4 text-accent" /> AI insights
          </h2>
          <div className="mt-3 space-y-3">
            {stats.insights.map((i: { title: string; body: string; tone: "warning" | "primary" | "success" }) => (
              <div key={i.title} className={`rounded-2xl border p-5 ${toneClass[i.tone]}`}>
                <p className="text-sm font-semibold">{i.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{i.body}</p>
              </div>
            ))}

          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function Page() {
  return (
    <>
      <Seo title={"Dashboard — CareerMind AI"} description={"Track your profile completion, career progress, AI insights and matched jobs."} />
      <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
    </>
  );
}
