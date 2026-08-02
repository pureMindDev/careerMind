import { Seo } from "@/components/Seo";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AuthCard } from "@/components/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";


function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      toast.success("Welcome back");
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }


  return (
    <AuthCard
      title="Welcome back"
      subtitle="Pick up where your career left off."
      footer={
        <>
          New here?{" "}
          <Link to="/signup" className="font-medium text-foreground hover:text-primary">
            Create an account
          </Link>
        </>
      }
    >
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
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-primary">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button
          type="submit"
          disabled={loading}
          className="gradient-brand h-11 w-full text-primary-foreground"
        >
          {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
          Log in
        </Button>
      </form>
    </AuthCard>
  );
}

export default function Page() {
  return (
    <>
      <Seo title={"Log in — CareerMind AI"} description={"Log in to your CareerMind AI career dashboard."} />
      <LoginPage />
    </>
  );
}
