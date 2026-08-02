import { Seo } from "@/components/Seo";
import { Loader2, Mic, RefreshCw, Send, Square } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { evaluateInterviewAnswer } from "@/lib/api";
import { interviewQuestions } from "@/lib/mock-data";


type Feedback = {
  score: number;
  metrics: { label: string; value: number }[];
  good: string[];
  fix: string[];
};

function InterviewCoach() {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const evaluate = (evaluateInterviewAnswer);

  const question = interviewQuestions[index];

  async function submit() {
    if (answer.trim().length < 20) {
      toast.error("Give a fuller answer — at least a couple of sentences.");
      return;
    }
    setLoading(true);
    setFeedback(null);
    try {
      const result = await evaluate({
        data: {
          question: question.question,
          category: question.category,
          answer: answer.trim(),
        },
      });
      setFeedback(result);
      toast.success("Feedback ready");
    } catch (err) {
      console.error(err);
      toast.error("Failed to evaluate answer. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function toggleRecording() {
    setRecording((r) => {
      if (r) {
        setAnswer(
          (a) =>
            a +
            (a ? " " : "") +
            "[Voice answer transcribed] In my final year project I led the rebuild of our booking flow after users kept dropping at checkout.",
        );
        toast.success("Voice answer transcribed");
      } else {
        toast.info("Recording… speak your answer");
      }
      return !r;
    });
  }

  return (
    <AppShell title="Interview Coach" subtitle="Practise out loud. Get feedback that stings usefully.">
      <div className="grid gap-5 lg:grid-cols-5">
        <div className="glass rounded-3xl p-6 lg:col-span-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary">{question.category}</Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIndex((i) => (i + 1) % interviewQuestions.length);
                setAnswer("");
                setFeedback(null);
              }}
            >
              <RefreshCw className="mr-1.5 size-3.5" /> New question
            </Button>
          </div>
          <h2 className="mt-4 text-xl font-semibold leading-snug">{question.question}</h2>
          <p className="mt-2 text-xs text-muted-foreground">{question.hint}</p>

          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer, or record it with your voice…"
            className="mt-5 min-h-40 resize-none"
          />

          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant={recording ? "destructive" : "outline"}
              onClick={toggleRecording}
              className="gap-2"
            >
              {recording ? <Square className="size-4" /> : <Mic className="size-4" />}
              {recording ? "Stop recording" : "Record answer"}
            </Button>
            <Button
              className="gradient-brand gap-2 text-primary-foreground"
              onClick={submit}
              disabled={loading}
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              Get AI feedback
            </Button>
          </div>
        </div>

        <div className="lg:col-span-2">
          {!feedback && !loading && (
            <div className="glass grid h-full place-items-center rounded-3xl p-8 text-center text-sm text-muted-foreground">
              Answer the question to unlock your feedback report.
            </div>
          )}
          {loading && (
            <div className="glass grid h-full place-items-center rounded-3xl p-8">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          )}
          {feedback && (
            <div className="glass rounded-3xl p-6 animate-rise">
              <p className="text-sm text-muted-foreground">Answer score</p>
              <p className="font-display text-5xl font-extrabold gradient-text">{feedback.score}</p>
              <div className="mt-5 space-y-3">
                {feedback.metrics.map((m) => (
                  <div key={m.label}>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{m.label}</span>
                      <span>{Math.round(m.value)}</span>
                    </div>
                    <Progress value={m.value} className="mt-1.5 h-1.5" />
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <p className="text-xs font-semibold text-success">What worked</p>
                <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                  {feedback.good.map((g) => (
                    <li key={g}>• {g}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-5">
                <p className="text-xs font-semibold text-warning">Improve next time</p>
                <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                  {feedback.fix.map((g) => (
                    <li key={g}>• {g}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

export default function Page() {
  return (
    <>
      <Seo title={"Interview Coach — CareerMind AI"} description={"Practise real interview questions by text or voice and get structured AI feedback."} />
      <ProtectedRoute>
      <InterviewCoach />
    </ProtectedRoute>
    </>
  );
}
