import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BrainCircuit,
  Compass,
  FileSearch,
  LayoutDashboard,
  LogOut,
  Menu,
  Mic,
  Moon,
  Settings,
  Sun,
  Target,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/cv-analyzer", label: "CV Analyzer", icon: FileSearch },
  { to: "/job-matcher", label: "Job Matcher", icon: Target },
  { to: "/interview-coach", label: "Interview Coach", icon: Mic },
  { to: "/roadmap", label: "Career Roadmap", icon: Compass },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const [open, setOpen] = useState(false);

  const sidebar = (
    <div className="flex h-full flex-col gap-2 p-4">
      <Link to="/" className="mb-6 flex items-center gap-2 px-2">
        <span className="gradient-brand grid size-9 place-items-center rounded-xl glow-soft">
          <BrainCircuit className="size-5 text-primary-foreground" />
        </span>
        <span className="font-display text-lg font-semibold">CareerMind</span>
      </Link>
      <nav className="flex flex-col gap-1">
        {nav.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-secondary hover:text-foreground",
                active && "gradient-brand text-primary-foreground glow-soft hover:text-primary-foreground",
              )}
            >
              <item.icon className="size-4 transition-transform duration-300 group-hover:scale-110" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto glass rounded-2xl p-4">
        <p className="text-xs text-muted-foreground">Signed in as</p>
        <p className="truncate text-sm font-semibold capitalize">{user?.name}</p>
        <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-3 w-full justify-start gap-2"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <LogOut className="size-4" /> Sign out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="aurora -left-40 top-[-10rem] size-[26rem] bg-primary/40" />
      <div className="aurora right-[-8rem] top-40 size-[22rem] bg-accent/35" />
      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar/60 backdrop-blur-xl lg:block">
          {sidebar}
        </aside>

        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <aside className="absolute left-0 top-0 h-full w-72 border-r border-border bg-sidebar animate-rise">
              {sidebar}
            </aside>
          </div>
        )}

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/70 px-4 py-4 backdrop-blur-xl sm:px-6">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold sm:text-xl">{title}</h1>
              {subtitle && <p className="truncate text-xs text-muted-foreground sm:text-sm">{subtitle}</p>}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={toggle}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
          </header>
          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
