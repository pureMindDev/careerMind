import { Link } from "react-router-dom";
import { BrainCircuit, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const links = [
  { href: "#features", label: "Features" },
  { href: "#testimonials", label: "Stories" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="gradient-brand grid size-9 place-items-center rounded-xl glow-soft">
            <BrainCircuit className="size-5 text-primary-foreground" />
          </span>
          <span className="font-display text-lg font-semibold">CareerMind AI</span>
        </Link>

        <nav className="ml-8 hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative text-sm text-muted-foreground transition-colors hover:text-foreground after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          {user ? (
            <Button asChild className="gradient-brand text-primary-foreground">
              <Link to="/dashboard">Open dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link to="/login">Log in</Link>
              </Button>
              <Button
                asChild
                className="gradient-brand text-primary-foreground transition-transform hover:scale-[1.03]"
              >
                <Link to="/signup">Get started free</Link>
              </Button>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="ml-auto md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {open && (
        <div className="border-t border-border bg-background/95 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm text-muted-foreground"
              >
                {l.label}
              </a>
            ))}
            <Button asChild variant="outline">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild className="gradient-brand text-primary-foreground">
              <Link to="/signup">Get started free</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <span className="gradient-brand grid size-7 place-items-center rounded-lg">
            <BrainCircuit className="size-4 text-primary-foreground" />
          </span>
          <span className="font-medium text-foreground">CareerMind AI</span>
        </div>
        <p>© {new Date().getFullYear()} CareerMind AI. Turn rejection into opportunity.</p>
      </div>
    </footer>
  );
}
