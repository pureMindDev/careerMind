import { Seo } from "@/components/Seo";
import { Building2, MapPin, Search, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";
import { getJobMatches } from "@/lib/api";


type Job = {
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

function JobMatcher() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [minMatch, setMinMatch] = useState(0);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchMatches = (getJobMatches);

  useEffect(() => {
    let cancelled = false;
    fetchMatches({
      data: {
        targetRole: user?.targetRole,
        skills: [],
        experience: "",
      },
    })
      .then((data) => {
        if (!cancelled) setJobs(data as Job[]);
      })
      .catch((err) => {
        console.error("Job matcher failed", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [fetchMatches, user?.targetRole]);

  const filtered = useMemo(
    () =>
      jobs.filter(
        (j) =>
          j.match >= minMatch &&
          (j.title + j.company + j.tags.join(" ")).toLowerCase().includes(query.toLowerCase()),
      ),
    [query, minMatch, jobs],
  );

  return (
    <AppShell title="Job Matcher" subtitle="Ranked by real compatibility with your profile.">
      <div className="glass flex flex-col gap-3 rounded-3xl p-5 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search role, company or skill"
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {[0, 70, 85].map((v) => (
            <Button
              key={v}
              size="sm"
              variant={minMatch === v ? "default" : "outline"}
              className={minMatch === v ? "gradient-brand text-primary-foreground" : ""}
              onClick={() => setMinMatch(v)}
            >
              {v === 0 ? "All" : `${v}%+`}
            </Button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="glass mt-5 rounded-3xl p-10 text-center text-sm text-muted-foreground">
          Calculating AI match scores for your profile…
        </div>
      )}

      <div className="mt-5 space-y-4">
        {!loading &&
          filtered.map((job) => (
            <article
              key={job.id}
              className="glass rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1 animate-rise"
            >
              <div className="flex flex-wrap items-start gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold">{job.title}</h2>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Building2 className="size-3.5" /> {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5" /> {job.location}
                    </span>
                    <span>{job.type}</span>
                    <span>{job.salary}</span>
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.tags.map((t) => (
                      <Badge key={t} variant="secondary">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="w-full sm:w-40">
                  <p className="font-display text-3xl font-bold gradient-text">{job.match}%</p>
                  <p className="text-[11px] text-muted-foreground">compatibility</p>
                  <Progress value={job.match} className="mt-2 h-1.5" />
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-success/25 bg-success/10 p-4">
                  <p className="flex items-center gap-2 text-xs font-semibold">
                    <Sparkles className="size-3.5 text-success" /> Why it matches
                  </p>
                  <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                    {job.reasons.map((r) => (
                      <li key={r}>• {r}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-warning/25 bg-warning/10 p-4">
                  <p className="text-xs font-semibold">What&apos;s missing</p>
                  <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                    {job.missing.map((r) => (
                      <li key={r}>• {r}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button size="sm" className="gradient-brand text-primary-foreground">
                  Generate cover letter
                </Button>
                <Button size="sm" variant="outline">
                  Save role
                </Button>
              </div>
            </article>
          ))}
        {!loading && filtered.length === 0 && (
          <div className="glass rounded-3xl p-10 text-center text-sm text-muted-foreground">
            No roles match those filters yet. Try lowering the threshold.
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function Page() {
  return (
    <>
      <Seo title={"Job Matcher — CareerMind AI"} description={"See compatibility percentages and the reasons each job matches your skills."} />
      <ProtectedRoute>
      <JobMatcher />
    </ProtectedRoute>
    </>
  );
}
