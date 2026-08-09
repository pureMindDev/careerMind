import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { AuthCard } from "@/components/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";


function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Forgot your password?"
      subtitle="We'll email you a secure reset link."
      footer={
        <Link to="/login" className="font-medium text-foreground hover:text-primary">
          Back to login
        </Link>
      }
    >
      {sent ? (
        <div className="flex items-start gap-3 rounded-2xl border border-success/30 bg-success/10 p-4">
          <CheckCircle2 className="mt-0.5 size-5 text-success" />
          <p className="text-sm">
            If an account exists for <span className="font-medium">{email}</span>, a reset link is on
            its way.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button
            type="submit"
            disabled={loading}
            className="gradient-brand h-11 w-full text-primary-foreground"
          >
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            Send reset link
          </Button>
        </form>
      )}
    </AuthCard>
  );
}

export default function Page() {
  return (
    <>
      <Seo title={"Reset your password — CareerMind AI"} description={"Send yourself a password reset link for CareerMind AI."} />
      <ForgotPasswordPage />
    </>
  );
}
