import { Seo } from "@/components/Seo";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Compass,
  FileSearch,
  Mic,
  Quote,
  Sparkles,
  Star,
  Target,
  Wand2,
  Briefcase,
  Bell,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs, pricing, testimonials } from "@/lib/mock-data";
import heroImage from "@/assets/hero-dashboard.jpg";


const features = [
  {
    icon: FileSearch,
    title: "AI CV Analyzer",
    body: "Upload a PDF or DOCX and get a score out of 100, plus the exact lines recruiters and ATS filters skip.",
  },
  {
    icon: Target,
    title: "Job Matcher",
    body: "Real compatibility percentages with a plain-English explanation of why each role fits — and what's missing.",
  },
  {
    icon: Mic,
    title: "Interview Coach",
    body: "Generated questions for your target role. Answer by text or voice, get structure and confidence feedback.",
  },
  {
    icon: Compass,
    title: "Career Roadmap",
    body: "A 16-week personalised learning path with milestones, progress tracking and honest skill-gap analysis.",
  },
  {
    icon: Wand2,
    title: "AI Cover Letters",
    body: "Tailored letters generated from your CV and the job description in seconds, in your own voice.",
  },
  {
    icon: Briefcase,
    title: "Portfolio Builder",
    body: "Turn projects into a recruiter-ready portfolio page with impact metrics that actually get read.",
  },
];

const stats = [
  { value: "128k+", label: "CVs analysed" },
  { value: "3.4x", label: "More interview callbacks" },
  { value: "41%", label: "Faster time to offer" },
  { value: "4.9/5", label: "Average user rating" },
];

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-24 pt-32 sm:px-6 sm:pt-40">
        <div className="aurora left-[-10rem] top-[-6rem] size-[30rem] bg-primary/50 animate-float" />
        <div className="aurora right-[-8rem] top-10 size-[26rem] bg-accent/40 animate-float" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div className="animate-rise">
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5 text-accent" />
              AI career intelligence for students & professionals
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl">
              Turn rejection <br />
              into <span className="gradient-text">opportunity.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              Companies rarely tell you why they said no. CareerMind does — then fixes your CV,
              finds the jobs you actually match, drills your interviews and maps the skills that
              close the gap.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="gradient-brand h-12 px-7 text-primary-foreground glow transition-transform hover:scale-[1.03]"
              >
                <Link to="/signup">
                  Analyse my CV free <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-7">
                <Link to="/dashboard">See the dashboard</Link>
              </Button>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-2xl font-bold gradient-text">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-rise">
            <div className="glass overflow-hidden rounded-3xl p-2 glow">
              <img
                src={heroImage}
                alt="CareerMind AI dashboard showing CV score, job matches and skill charts"
                className="w-full rounded-2xl"
                loading="eager"
              />
            </div>
            <div className="glass absolute -bottom-6 -left-4 hidden rounded-2xl px-4 py-3 sm:block animate-float">
              <p className="text-xs text-muted-foreground">CV score</p>
              <p className="font-display text-2xl font-bold gradient-text">82 / 100</p>
            </div>
            <div className="glass absolute -right-3 top-8 hidden rounded-2xl px-4 py-3 sm:block animate-float">
              <p className="text-xs text-muted-foreground">Top match</p>
              <p className="text-sm font-semibold">Frontend Engineer · 94%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problems */}
      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "You don't know why your CV gets rejected.",
            "You don't know which jobs match your skills.",
            "You don't know which skills to learn next.",
            "Interviews and planning feel like guesswork.",
          ].map((p, i) => (
            <div
              key={p}
              className="glass rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="font-display text-sm text-accent">0{i + 1}</span>
              <p className="mt-2 text-sm font-medium">{p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative px-4 py-20 sm:px-6">
        <div className="aurora left-1/3 top-20 size-[24rem] bg-primary/30" />
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold sm:text-5xl">
              One platform, the whole <span className="gradient-text">career loop</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every feature feeds the next: your CV informs matching, matching informs your roadmap,
              your roadmap informs interview prep.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group glass rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1.5 hover:glow-soft"
              >
                <span className="gradient-brand grid size-11 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110">
                  <f.icon className="size-5 text-primary-foreground" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 glass flex flex-wrap items-center gap-x-8 gap-y-3 rounded-3xl px-7 py-5 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Bell className="size-4 text-accent" /> Real-time notifications
            </span>
            <span className="flex items-center gap-2">
              <Briefcase className="size-4 text-accent" /> Internship recommendations
            </span>
            <span className="flex items-center gap-2">
              <Star className="size-4 text-accent" /> Dark & light themes
            </span>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold sm:text-5xl">
            From rejected to <span className="gradient-text">hired</span>
          </h2>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="glass rounded-3xl p-7 transition-transform duration-300 hover:-translate-y-1"
              >
                <Quote className="size-6 text-accent" />
                <blockquote className="mt-4 text-sm leading-relaxed">{t.quote}</blockquote>
                <figcaption className="mt-6">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative px-4 py-20 sm:px-6">
        <div className="aurora right-1/4 top-10 size-[22rem] bg-accent/30" />
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold sm:text-5xl">
            Pricing that pays for <span className="gradient-text">itself</span>
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Start free. Upgrade when you want the full career operating system.
          </p>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {pricing.map((p) => (
              <div
                key={p.name}
                className={
                  p.featured
                    ? "relative rounded-3xl border border-primary/40 bg-card p-8 glow"
                    : "glass rounded-3xl p-8 transition-transform duration-300 hover:-translate-y-1"
                }
              >
                {p.featured && (
                  <span className="gradient-brand absolute -top-3 left-8 rounded-full px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.blurb}</p>
                <p className="mt-6 flex items-end gap-1">
                  <span className="font-display text-4xl font-bold">{p.price}</span>
                  <span className="pb-1 text-sm text-muted-foreground">{p.period}</span>
                </p>
                <ul className="mt-6 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-success" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className={
                    p.featured
                      ? "gradient-brand mt-8 w-full text-primary-foreground"
                      : "mt-8 w-full"
                  }
                  variant={p.featured ? "default" : "outline"}
                >
                  <Link to="/signup">{p.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold sm:text-5xl">Questions, answered</h2>
          <Accordion type="single" collapsible className="mt-10">
            {faqs.map((f) => (
              <AccordionItem key={f.q} value={f.q} className="border-border">
                <AccordionTrigger className="text-left text-base font-medium">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-24 sm:px-6">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] p-10 text-center glass glow sm:p-16">
          <div className="aurora left-1/2 top-0 size-[24rem] -translate-x-1/2 bg-primary/50" />
          <div className="relative">
            <h2 className="text-3xl font-bold sm:text-5xl">
              Your next rejection can be your <span className="gradient-text">last one</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Upload your CV, get your score in under 60 seconds, and see the roles you're already
              qualified for.
            </p>
            <Button
              asChild
              size="lg"
              className="gradient-brand mt-8 h-12 px-8 text-primary-foreground transition-transform hover:scale-105"
            >
              <Link to="/signup">
                Get started free <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

export default function Page() {
  return (
    <>
      <Seo title={"CareerMind AI — Turn rejection into opportunity"} description={"CareerMind AI scores your CV out of 100, matches you to jobs with reasons, coaches your interviews and builds a personalised skill roadmap."} />
      <Landing />
    </>
  );
}
