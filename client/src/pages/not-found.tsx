import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Seo title="Page not found — CareerMind AI" description="This page doesn't exist." />
      <div className="max-w-md text-center">
        <h1 className="gradient-text text-7xl font-bold">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="gradient-brand mt-6 inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-105"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
