import { Seo } from "@/components/Seo";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, Mail, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AuthCard } from "@/components/AuthCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

type Status = "pending" | "verifying" | "success" | "error";

function VerifyEmailPage() {
  const { verifyEmail, resendVerification, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [status, setStatus] = useState<Status>(token ? "verifying" : "pending");
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    if (!token || ran.current) return;
    ran.current = true;
    verifyEmail(token)
      .then(() => setStatus("success"))
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Something went wrong.");
        setStatus("error");
      });
  }, [token, verifyEmail]);

  async function onResend() {
    setResending(true);
    try {
      await resendVerification();
      toast.success("Verification email sent — check your inbox.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't send that, try again.");
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthCard
      title="Verify your email"
      subtitle={status === "pending" ? "One more step before you're set up." : "Confirming this is really your inbox."}
      footer={
        <Link to={user ? "/dashboard" : "/login"} className="font-medium text-foreground hover:text-primary">
          {user ? "Go to dashboard" : "Back to login"}
        </Link>
      }
    >
      {status === "pending" && (
        <div className="flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-4">
          <Mail className="mt-0.5 size-5 text-primary" />
          <div className="space-y-3">
            <p className="text-sm">
              {user
                ? `We sent a verification link to ${user.email}. Click it to activate your account.`
                : "We sent a verification link to your email. Click it to activate your account."}
            </p>
            {user && (
              <Button size="sm" variant="outline" disabled={resending} onClick={onResend}>
                {resending ? "Sending..." : "Resend email"}
              </Button>
            )}
          </div>
        </div>
      )}
      {status === "verifying" && (
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="size-5 animate-spin" /> Verifying your email...
        </div>
      )}
      {status === "success" && (
        <div className="flex items-start gap-3 rounded-2xl border border-success/30 bg-success/10 p-4">
          <CheckCircle2 className="mt-0.5 size-5 text-success" />
          <div className="space-y-3">
            <p className="text-sm">Your email is verified.</p>
            <Button size="sm" className="gradient-brand text-primary-foreground" onClick={() => navigate("/dashboard")}>
              Continue to dashboard
            </Button>
          </div>
        </div>
      )}
      {status === "error" && (
        <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4">
          <XCircle className="mt-0.5 size-5 text-destructive" />
          <div className="space-y-3">
            <p className="text-sm">{error ?? "That verification link is invalid or has expired."}</p>
            {user && (
              <Button size="sm" variant="outline" disabled={resending} onClick={onResend}>
                {resending ? "Sending..." : "Send a new link"}
              </Button>
            )}
          </div>
        </div>
      )}
    </AuthCard>
  );
}

export default function Page() {
  return (
    <>
      <Seo title={"Verify your email — CareerMind AI"} description={"Confirm your email address for CareerMind AI."} />
      <VerifyEmailPage />
    </>
  );
}
