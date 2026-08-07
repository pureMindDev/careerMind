import { Seo } from "@/components/Seo";
import { AlertTriangle, CheckCircle2, FileText, Loader2, Lightbulb, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/AuthContext";
import { uploadCV } from "@/lib/api";


type Analysis = {
  score: number;
  breakdown: { label: string; value: number }[];
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
};

function CvAnalyzer() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function accept(f: File | undefined) {
    if (!f) return;
    const ok = /\.(pdf|docx)$/i.test(f.name);
    if (!ok) {
      toast.error("Only PDF or DOCX files are supported.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB.");
      return;
    }
    setFile(f);
    setStatus("idle");
    setAnalysis(null);
  }

  async function analyse() {
    if (!file) return;
    setStatus("loading");
    try {
      // Text extraction happens server-side (Multer + pdf-parse/mammoth) —
      // more reliable than parsing PDFs in the browser and avoids shipping
      // a PDF.js worker to every visitor.
      const result = await uploadCV(file, user?.targetRole);
      setAnalysis(result);
      setStatus("done");
      toast.success("Analysis complete");
    } catch (err) {
      console.error(err);
      setStatus("error");
      toast.error(err instanceof Error ? err.message : "Analysis failed");
    }
  }

  return (
    <AppShell title="AI CV Analyzer" subtitle="Upload your CV and see it the way recruiters do.">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          accept(e.dataTransfer.files[0]);
        }}
        className={`glass flex flex-col items-center rounded-3xl border-dashed p-10 text-center transition-all duration-300 ${
          dragging ? "border-primary glow" : ""
        }`}
      >
        <span className="gradient-brand grid size-14 place-items-center rounded-2xl glow-soft">
          <Upload className="size-6 text-primary-foreground" />
        </span>
        <p className="mt-5 font-semibold">Drop your CV here</p>
        <p className="mt-1 text-sm text-muted-foreground">PDF or DOCX, up to 5MB</p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(e) => accept(e.target.files?.[0])}
        />
        <Button variant="outline" className="mt-5" onClick={() => inputRef.current?.click()}>
          Choose file
        </Button>
        {file && (
          <div className="mt-6 flex w-full max-w-md items-center gap-3 rounded-2xl border border-border p-4 text-left">
            <FileText className="size-5 text-primary" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(0)} KB · ready to analyse
              </p>
            </div>
            <Button
              size="sm"
              className="gradient-brand ml-auto text-primary-foreground"
              onClick={analyse}
              disabled={status === "loading"}
            >
              {status === "loading" && <Loader2 className="mr-2 size-4 animate-spin" />}
              Analyse
            </Button>
          </div>
        )}
      </div>

      {status === "loading" && (
        <div className="glass mt-5 rounded-3xl p-8 text-center">
          <Loader2 className="mx-auto size-6 animate-spin text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">
            Extracting text, scoring structure and comparing against your target roles…
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="glass mt-5 rounded-3xl p-8 text-center text-sm text-destructive">
          Could not analyse this file. Make sure it is a valid PDF or DOCX and try again.
        </div>
      )}

      {analysis && (
        <div className="mt-5 grid gap-5 lg:grid-cols-3 animate-rise">
          <div className="glass rounded-3xl p-6 text-center">
            <p className="text-sm text-muted-foreground">CV score</p>
            <p className="mt-2 font-display text-6xl font-extrabold gradient-text">
              {analysis.score}
            </p>
            <p className="text-xs text-muted-foreground">out of 100</p>
            <div className="mt-6 space-y-3 text-left">
              {analysis.breakdown.map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{b.label}</span>
                    <span className="font-medium">{b.value}</span>
                  </div>
                  <Progress value={b.value} className="mt-1.5 h-1.5" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5 lg:col-span-2">
            <div className="glass rounded-3xl p-6">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <CheckCircle2 className="size-4 text-success" /> Strengths
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {analysis.strengths.map((s) => (
                  <li key={s} className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-success" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass rounded-3xl p-6">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <AlertTriangle className="size-4 text-warning" /> Weaknesses
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {analysis.weaknesses.map((s) => (
                  <li key={s} className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-warning" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass rounded-3xl p-6">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <Lightbulb className="size-4 text-accent" /> Suggested improvements
              </h2>
              <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
                {analysis.improvements.map((s, i) => (
                  <li key={s} className="flex gap-3">
                    <span className="font-display text-xs text-accent">0{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

export default function Page() {
  return (
    <>
      <Seo title={"AI CV Analyzer — CareerMind AI"} description={"Upload a PDF or DOCX CV and get a score out of 100 with strengths and fixes."} />
      <ProtectedRoute>
      <CvAnalyzer />
    </ProtectedRoute>
    </>
  );
}
