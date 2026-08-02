import { Link } from "react-router-dom";
import { BrainCircuit } from "lucide-react";
import type { ReactNode } from "react";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-16">
      <div className="aurora left-[-6rem] top-[-6rem] size-[26rem] bg-primary/45 animate-float" />
      <div className="aurora bottom-[-8rem] right-[-6rem] size-[24rem] bg-accent/40 animate-float" />
      <div className="relative w-full max-w-md animate-rise">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="gradient-brand grid size-10 place-items-center rounded-xl glow-soft">
            <BrainCircuit className="size-5 text-primary-foreground" />
          </span>
          <span className="font-display text-xl font-semibold">CareerMind AI</span>
        </Link>
        <div className="glass rounded-3xl p-8 glow">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-7">{children}</div>
        </div>
        <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
      </div>
    </div>
  );
}
