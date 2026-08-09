import { Seo } from "@/components/Seo";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Check, Circle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";
import { getOrCreateRoadmap, type RoadmapData } from "@/lib/api";


function Roadmap() {
  const { user } = useAuth();
  const [data, setData] = useState<RoadmapData>({
    targetRole: "Senior Frontend Engineer",
    overallProgress: 0,
    phases: [],
    skillGaps: [],
  });
  const [loading, setLoading] = useState(true);
  const fetchRoadmap = (getOrCreateRoadmap);

  useEffect(() => {
    let cancelled = false;
    fetchRoadmap({
      data: {
        targetRole: user?.targetRole,
        skills: [],
        level: "mid",
      },
    })
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        console.error("Roadmap failed", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchRoadmap, user?.targetRole]);

  return (
    <AppShell title="Career Roadmap" subtitle="Your personalised path to the next role.">
      <div className="glass rounded-3xl p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Overall progress</p>
            <p className="font-display text-4xl font-bold gradient-text">{data.overallProgress}%</p>
          </div>
          <p className="text-xs text-muted-foreground">Target role: {data.targetRole} · 16 weeks</p>
        </div>
        <Progress value={data.overallProgress} className="mt-4" />
      </div>

      {loading && (
        <div className="glass mt-5 rounded-3xl p-10 text-center text-sm text-muted-foreground">
          <Loader2 className="mx-auto mb-2 size-5 animate-spin" />
          Building your personalised roadmap…
        </div>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          {!loading &&
            data.phases.map((phase) => (
              <div key={phase.phase} className="glass relative rounded-3xl p-6 animate-rise">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={
                      phase.status === "done"
                        ? "grid size-9 place-items-center rounded-xl bg-success/20 text-success"
                        : phase.status === "active"
                          ? "gradient-brand grid size-9 place-items-center rounded-xl text-primary-foreground glow-soft"
                          : "grid size-9 place-items-center rounded-xl bg-secondary text-muted-foreground"
                    }
                  >
                    {phase.status === "done" ? (
                      <Check className="size-4" />
                    ) : phase.status === "active" ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Circle className="size-4" />
                    )}
                  </span>
                  <div>
                    <h2 className="text-base font-semibold">{phase.phase}</h2>
                    <p className="text-xs text-muted-foreground">{phase.weeks}</p>
                  </div>
                  <Badge variant="secondary" className="ml-auto capitalize">
                    {phase.status === "done" ? "Completed" : phase.status === "active" ? "In progress" : "Upcoming"}
                  </Badge>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {phase.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span
                        className={`mt-1.5 size-1.5 shrink-0 rounded-full ${
                          phase.status === "done" ? "bg-success" : "bg-primary"
                        }`}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>

        <div className="glass h-fit rounded-3xl p-6 lg:col-span-2">
          <h2 className="text-base font-semibold">Skill-gap analysis</h2>
          <p className="text-xs text-muted-foreground">Current level vs level needed for target roles</p>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.skillGaps} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis
                  type="category"
                  dataKey="skill"
                  width={90}
                  stroke="var(--color-muted-foreground)"
                  fontSize={11}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="have" name="You" fill="var(--color-chart-1)" radius={[0, 6, 6, 0]} />
                <Bar dataKey="need" name="Needed" fill="var(--color-chart-2)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function Page() {
  return (
    <>
      <Seo title={"Career Roadmap — CareerMind AI"} description={"A personalised 16-week learning path with milestones and skill-gap analysis."} />
      <ProtectedRoute>
      <Roadmap />
    </ProtectedRoute>
    </>
  );
}
