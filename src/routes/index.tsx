import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  BellRing,
  Cpu,
  Droplets,
  Gauge,
  LineChart,
  ShieldCheck,
  Thermometer,
} from "lucide-react";
import heroCow from "@/assets/hero-cow.jpg";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mastrix B — AI Bovine Mastitis Early Warning" },
      {
        name: "description",
        content:
          "Mastrix B detects bovine mastitis risk days before visible symptoms using multi-sensor data, personal baselines and explainable risk scoring.",
      },
      { property: "og:title", content: "Mastrix B — AI Bovine Mastitis Early Warning" },
      {
        property: "og:description",
        content:
          "Detect mastitis risk days early with multi-sensor herd monitoring and explainable AI risk scoring.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const PROBLEMS = [
  { value: "₹6,000 cr", label: "Estimated annual loss to Indian dairy from mastitis" },
  { value: "70%", label: "Of cases are subclinical — no visible symptoms" },
  { value: "3-5 days", label: "Typical delay before a farmer notices a problem" },
  { value: "20-30%", label: "Milk yield drop in an affected animal" },
];

const SIGNALS = [
  { icon: Droplets, title: "Milk conductivity", detail: "Rising electrical conductivity is the earliest udder signal." },
  { icon: Gauge, title: "Milk yield", detail: "A quiet, gradual drop against the animal's own baseline." },
  { icon: Activity, title: "Activity", detail: "Discomfort shows up as reduced movement long before limping." },
  { icon: Thermometer, title: "Body temperature", detail: "Small persistent increases point to inflammation." },
  { icon: Cpu, title: "Environment", detail: "Heat and humidity load raise herd-wide susceptibility." },
  { icon: ShieldCheck, title: "Sensor health", detail: "Faulty sensors lower confidence instead of faking certainty." },
];

const STEPS = [
  { n: "01", title: "Sense", detail: "An ESP32 unit reads milk conductivity, temperature, yield, movement and shed climate, identifying each animal by RFID." },
  { n: "02", title: "Compare", detail: "Every reading is compared with that animal's own personal baseline — not a herd-wide threshold." },
  { n: "03", title: "Score", detail: "Deviation, speed of change and acceleration are fused into a 0-100 risk score with a 7 and 14 day outlook." },
  { n: "04", title: "Act", detail: "The farmer gets a plain-language alert, the reason behind it, and immediate, preventive and veterinary steps." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
          <span className="grid size-9 place-items-center rounded-lg bg-primary font-bold text-primary-foreground">
            M
          </span>
          <span className="leading-tight">
            <span className="block text-base font-bold">Mastrix B</span>
            <span className="block text-[11px] text-muted-foreground">
              Healthier Cows, Stronger Farms
            </span>
          </span>
          <Link to="/dashboard" className="ml-auto">
            <Button size="sm">
              Open Dashboard <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:px-6 lg:grid-cols-2 lg:py-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand-deep">
            <BellRing className="size-3.5" aria-hidden /> Early-warning prototype · SIH-ready
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight md:text-5xl lg:text-6xl">
            Catch mastitis days before you can see it
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Mastrix B watches each animal against its own normal. When milk conductivity, yield,
            movement and body temperature start drifting together, it raises an explainable early
            warning — with the reason and the next step, in the farmer's language.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/dashboard">
              <Button size="lg">
                See the live dashboard <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link to="/animal/$animalId" params={{ animalId: "C024" }}>
              <Button size="lg" variant="outline">
                Walk through animal C024
              </Button>
            </Link>
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            Prototype risk assessment. It supports the farmer's judgement and does not replace
            veterinary diagnosis.
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-border shadow-[var(--shadow-float)]">
            <img
              src={heroCow}
              alt="Healthy dairy cow being monitored on an Indian dairy farm"
              className="aspect-square w-full object-cover"
              loading="eager"
            />
          </div>
          <div className="card-surface absolute -bottom-6 left-4 right-4 flex items-center gap-4 p-4 md:left-8 md:right-8">
            <div className="grid size-11 shrink-0 place-items-center rounded-full bg-risk-high-soft text-risk-high">
              <LineChart className="size-5" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">C024 · risk rising for 3 days</p>
              <p className="truncate text-xs text-muted-foreground">
                4 of 4 signals deviating from personal baseline
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface px-4 py-14 md:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            The problem hides in plain sight
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROBLEMS.map((p) => (
              <div key={p.label} className="card-surface p-5">
                <p className="text-2xl font-extrabold text-primary md:text-3xl">{p.value}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6">
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Six signals, read together</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          A single reading proves nothing. Agreement between independent signals is what turns noise
          into an early warning.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SIGNALS.map((s) => (
            <div key={s.title} className="card-surface p-5">
              <div className="grid size-10 place-items-center rounded-lg bg-brand-soft text-brand-deep">
                <s.icon className="size-5" aria-hidden />
              </div>
              <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface px-4 py-14 md:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">How Mastrix B works</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n} className="card-surface p-5">
                <span className="font-mono text-xs font-semibold text-primary">{s.n}</span>
                <h3 className="mt-2 text-lg font-bold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link to="/dashboard">
              <Button size="lg">
                Open the dashboard <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link to="/hardware">
              <Button size="lg" variant="outline">
                View the sensor unit
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card px-4 py-8 text-sm text-muted-foreground md:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="font-semibold text-foreground">Mastrix B</p>
          <p className="mt-1">
            Hackathon prototype. Provides early-warning risk assessment only and does not replace
            veterinary diagnosis. Demo values are simulated.
          </p>
        </div>
      </footer>
    </div>
  );
}
