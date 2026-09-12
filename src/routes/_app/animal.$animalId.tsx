import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ClientTime } from "@/components/common/ClientDate";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Droplets,
  Gauge,
  Lightbulb,
  Stethoscope,
  Thermometer,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/common/PageHeader";
import { RiskGauge } from "@/components/common/RiskGauge";
import { RiskPill } from "@/components/common/RiskPill";
import { RiskExplanation } from "@/components/common/RiskExplanation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/lib/store";
import { recommendationsFor } from "@/lib/recommendations";

export const Route = createFileRoute("/_app/animal/$animalId")({
  head: ({ params }) => ({
    meta: [
      { title: `Animal ${params.animalId} — Mastrix B` },
      {
        name: "description",
        content: `Risk analysis and recommended actions for animal ${params.animalId}.`,
      },
      { property: "og:title", content: `Animal ${params.animalId} — Mastrix B` },
      {
        property: "og:description",
        content: `Mastitis risk assessment, signal breakdown and next steps for animal ${params.animalId}.`,
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnimalAnalysis,
  notFoundComponent: () => (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold">Animal not found</h1>
      <p className="mt-2 text-muted-foreground">Check the tag code and try again.</p>
    </div>
  ),
});

function AnimalAnalysis() {
  const { animalId } = Route.useParams();
  const { animals, assessments, t } = useStore();
  const animal = animals.find((a) => a.code === animalId);
  if (!animal) throw notFound();
  const risk = assessments[animal.code]!;
  const recs = recommendationsFor(risk.level, risk);

  const nextIndex = animals.findIndex((a) => a.code === animalId);
  const nextAnimal = animals[(nextIndex + 1) % animals.length]!;

  return (
    <div>
      <PageHeader
        title={`${animal.code} — ${animal.breed}`}
        description={`${animal.species} · ${animal.age} years · ${animal.shed} · RFID ${animal.rfidUid} · Device ${animal.deviceId}`}
        actions={
          <Link to="/herd">
            <Button variant="outline" size="sm">
              <ArrowLeft className="size-4" /> Back to herd
            </Button>
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card-surface p-6 lg:col-span-1">
          <div className="flex flex-col items-center">
            <RiskGauge score={risk.currentRisk} level={risk.level} size={180} />
            <div className="mt-5 grid w-full grid-cols-3 gap-2 text-center">
              <div className="rounded-xl border border-border p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">7-day</p>
                <p className="mt-1 text-xl font-bold tabular-nums">{risk.sevenDayRisk}%</p>
              </div>
              <div className="rounded-xl border border-border p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">14-day</p>
                <p className="mt-1 text-xl font-bold tabular-nums">{risk.fourteenDayRisk}%</p>
              </div>
              <div className="rounded-xl border border-border p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Confidence</p>
                <p className="mt-1 text-xl font-bold tabular-nums">{risk.confidence}%</p>
              </div>
            </div>
            <dl className="mt-5 w-full space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Trend</dt>
                <dd className="font-semibold">{risk.trend}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Abnormal signals</dt>
                <dd className="font-semibold">
                  {risk.abnormalSignalCount} / {risk.signals.length}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Last updated</dt>
                <dd className="font-semibold"><ClientTime date={animal.lastUpdated} /></dd>
              </div>
            </dl>
            <div className="mt-5 w-full">
              <Link to="/animal/$animalId" params={{ animalId: nextAnimal.code }}>
                <Button variant="outline" className="w-full">
                  Next animal <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="card-surface p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold">Why this risk score?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The score comes from this animal's own baseline. Each signal contributes independently.
          </p>
          <div className="mt-5 space-y-5">
            {risk.signals.map((s) => (
              <div key={s.key}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {s.key === "milkEc" && <Droplets className="size-4 text-primary" aria-hidden />}
                    {s.key === "milkYield" && <Gauge className="size-4 text-primary" aria-hidden />}
                    {s.key === "activity" && <Activity className="size-4 text-primary" aria-hidden />}
                    {s.key === "bodyTemperature" && <Thermometer className="size-4 text-primary" aria-hidden />}
                    {s.key === "thi" && <TrendingUp className="size-4 text-primary" aria-hidden />}
                    <span className="text-sm font-medium">{s.label}</span>
                  </div>
                  <div className="text-right text-sm">
                    <span className="tabular-nums font-semibold">{s.current.toFixed(1)}</span>
                    <span className="ml-2 text-xs text-muted-foreground">baseline {s.baseline.toFixed(1)}</span>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <Progress value={Math.min(100, Math.abs(s.deviationPct) * 4)} className="h-2 flex-1" />
                  <span
                    className={
                      s.abnormal
                        ? "w-20 text-right text-sm font-semibold text-risk-high tabular-nums"
                        : "w-20 text-right text-sm text-muted-foreground tabular-nums"
                    }
                  >
                    {s.deviationPct > 0 ? "+" : ""}
                    {s.deviationPct.toFixed(1)}%
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  velocity {s.velocity > 0 ? "+" : ""}
                  {s.velocity.toFixed(2)}% / day · acceleration {s.acceleration > 0 ? "+" : ""}
                  {s.acceleration.toFixed(2)}% / day²
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-sm font-semibold">14-day risk history</h3>
              <p className="text-xs text-muted-foreground">
                Baseline {risk.baselineRisk}% · {risk.trend} · Peak {risk.peakRisk}% (today)
              </p>
            </div>
            <div className="mt-3 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dbHistory ?? risk.history}>
                  <defs>
                    <linearGradient id="animalRiskFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={levelColor} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={levelColor} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <ReferenceLine
                    y={risk.baselineRisk}
                    stroke="var(--color-muted-foreground)"
                    strokeDasharray="4 4"
                    label={{ value: "Baseline", position: "insideTopLeft", fontSize: 10 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="risk"
                    stroke={levelColor}
                    strokeWidth={2.5}
                    fill="url(#animalRiskFill)"
                    name="Risk score"
                    dot={(props: { cx?: number; cy?: number; payload?: { day: number } }) =>
                      props.payload?.day === 0 ? (
                        <circle key="peak" cx={props.cx} cy={props.cy} r={5} fill={levelColor} stroke="var(--color-card)" strokeWidth={2} />
                      ) : (
                        <circle key="pt" cx={props.cx} cy={props.cy} r={0} fill="none" />
                      )
                    }
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg border border-border p-2">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Baseline</p>
                <p className="text-sm font-semibold tabular-nums">{risk.baselineRisk}%</p>
              </div>
              <div className="rounded-lg border border-border p-2">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Trend</p>
                <p className="text-sm font-semibold">{risk.trend}</p>
              </div>
              <div className="rounded-lg border border-border p-2">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Peak (today)</p>
                <p className="text-sm font-semibold tabular-nums">{risk.peakRisk}%</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <RiskExplanation animal={animal} risk={risk} />

      <section className="mt-6">
        <Tabs defaultValue="action">
          <TabsList className="grid w-full grid-cols-3 sm:w-auto">
            <TabsTrigger value="action">
              <Lightbulb className="mr-1.5 size-4" aria-hidden /> {t("recommendedAction")}
            </TabsTrigger>
            <TabsTrigger value="contributions">
              <TrendingUp className="mr-1.5 size-4" aria-hidden /> Score breakdown
            </TabsTrigger>
            <TabsTrigger value="forecast">
              <TrendingDown className="mr-1.5 size-4" aria-hidden /> Forecast
            </TabsTrigger>
          </TabsList>

          <TabsContent value="action" className="mt-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="card-surface border-l-4 border-l-risk-critical p-5">
                <h3 className="flex items-center gap-2 font-semibold text-risk-critical">
                  <Stethoscope className="size-4" aria-hidden /> Immediate actions
                </h3>
                <ul className="mt-3 space-y-2">
                  {recs.immediate.map((it, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-risk-critical" aria-hidden />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card-surface border-l-4 border-l-risk-moderate p-5">
                <h3 className="flex items-center gap-2 font-semibold text-risk-moderate">
                  <Lightbulb className="size-4" aria-hidden /> Preventive care
                </h3>
                <ul className="mt-3 space-y-2">
                  {recs.preventive.map((it, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-risk-moderate" aria-hidden />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card-surface border-l-4 border-l-primary p-5">
                <h3 className="flex items-center gap-2 font-semibold text-primary">
                  <Stethoscope className="size-4" aria-hidden /> Veterinary guidance
                </h3>
                <ul className="mt-3 space-y-2">
                  {recs.veterinary.map((it, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contributions" className="mt-4">
            <div className="card-surface p-5">
              <h3 className="font-semibold">Signal contributions</h3>
              <p className="text-sm text-muted-foreground">
                Weighted contribution to today's risk score. Higher bars mean more influence.
              </p>
              <div className="mt-4 space-y-4">
                {risk.contributions.map((c) => (
                  <div key={c.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span>{c.label}</span>
                      <span className="tabular-nums font-semibold">{c.contribution.toFixed(1)} pts</span>
                    </div>
                    <Progress value={Math.min(100, c.contribution * 2)} className="mt-2 h-2" />
                    <p className="mt-1 text-xs text-muted-foreground">weight {Math.round(c.weight * 100)}%</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="forecast" className="mt-4">
            <div className="card-surface p-5">
              <h3 className="font-semibold">Risk outlook</h3>
              <p className="text-sm text-muted-foreground">
                Projected risk if the current trajectory continues and no intervention is taken.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {risk.forecast.map((f) => (
                  <div key={f.day} className="rounded-xl border border-border p-4 text-center">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{f.label}</p>
                    <p className="mt-2 text-2xl font-bold tabular-nums">{f.risk}%</p>
                    <Badge variant="outline" className="mt-2">
                      <RiskPill level={riskLevelFromScore(f.risk)} size="sm" />
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}

function riskLevelFromScore(score: number) {
  if (score <= 20) return "Low" as const;
  if (score <= 40) return "Mild" as const;
  if (score <= 60) return "Moderate" as const;
  if (score <= 80) return "High" as const;
  return "Very High" as const;
}
