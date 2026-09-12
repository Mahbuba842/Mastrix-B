import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Droplets,
  Gauge,
  Thermometer,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MetricCard } from "@/components/common/MetricCard";
import { PageHeader } from "@/components/common/PageHeader";
import { RiskGauge } from "@/components/common/RiskGauge";
import { RiskPill } from "@/components/common/RiskPill";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Herd Dashboard — Mastrix B" },
      {
        name: "description",
        content:
          "Live herd overview: animals monitored, risk distribution, active alerts and the highest-risk animal today.",
      },
      { property: "og:title", content: "Herd Dashboard — Mastrix B" },
      {
        property: "og:description",
        content: "Live herd risk overview with alerts and the highest-risk animal today.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { animals, assessments, alerts, sensorHealthScore, t } = useStore();

  const scored = animals
    .map((a) => ({ animal: a, risk: assessments[a.code]! }))
    .sort((x, y) => y.risk.currentRisk - x.risk.currentRisk);
  const top = scored[0]!;
  const herdRisk = Math.round(
    scored.reduce((s, r) => s + r.risk.currentRisk, 0) / Math.max(1, scored.length),
  );
  const counts = {
    high: scored.filter((s) => s.risk.currentRisk > 60).length,
    moderate: scored.filter((s) => s.risk.currentRisk > 40 && s.risk.currentRisk <= 60).length,
    low: scored.filter((s) => s.risk.currentRisk <= 40).length,
  };
  const newAlerts = alerts.filter((a) => a.status === "new");

  const distribution = [
    { band: "0-20", count: scored.filter((s) => s.risk.currentRisk <= 20).length },
    { band: "21-40", count: scored.filter((s) => s.risk.currentRisk > 20 && s.risk.currentRisk <= 40).length },
    { band: "41-60", count: scored.filter((s) => s.risk.currentRisk > 40 && s.risk.currentRisk <= 60).length },
    { band: "61-80", count: scored.filter((s) => s.risk.currentRisk > 60 && s.risk.currentRisk <= 80).length },
    { band: "81-100", count: scored.filter((s) => s.risk.currentRisk > 80).length },
  ];

  return (
    <div>
      <PageHeader
        title={t("dashboard")}
        description="Everything that matters about the herd right now, in one screen."
        actions={
          <Link to="/herd">
            <Button variant="outline">
              {t("herdMonitoring")} <ArrowRight className="size-4" />
            </Button>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label={t("totalAnimals")} value={String(animals.length)} icon={Users} sub="across 3 sheds" />
        <MetricCard label={t("herdRisk")} value={`${herdRisk}%`} icon={Gauge} sub="average of all animals" />
        <MetricCard
          label="Animals needing attention"
          value={String(counts.high + counts.moderate)}
          icon={AlertTriangle}
          sub={`${counts.high} high · ${counts.moderate} moderate`}
          abnormal={counts.high > 0}
        />
        <MetricCard label="Sensor health" value={`${sensorHealthScore}%`} icon={Activity} sub="data quality score" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="card-surface p-5 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Highest risk animal today</h2>
              <p className="text-sm text-muted-foreground">
                {top.animal.code} · {top.animal.breed} · {top.animal.shed}
              </p>
            </div>
            <Link to="/animal/$animalId" params={{ animalId: top.animal.code }}>
              <Button size="sm">
                Open full analysis <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-5 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
            <RiskGauge score={top.risk.currentRisk} level={top.risk.level} />
            <div className="space-y-3">
              {top.risk.signals.map((s) => (
                <div key={s.key}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{s.label}</span>
                    <span
                      className={
                        s.abnormal ? "font-semibold text-risk-high tabular-nums" : "text-muted-foreground tabular-nums"
                      }
                    >
                      {s.deviationPct > 0 ? "+" : ""}
                      {s.deviationPct.toFixed(1)}% vs baseline
                    </span>
                  </div>
                  <Progress value={Math.min(100, Math.abs(s.deviationPct) * 4)} className="mt-1.5 h-2" />
                </div>
              ))}
              <p className="pt-1 text-sm text-muted-foreground">
                Trend: <span className="font-semibold text-foreground">{top.risk.trend}</span> ·
                Confidence: <span className="font-semibold text-foreground">{top.risk.confidence}% ({top.risk.confidenceLevel})</span>
              </p>
            </div>
          </div>

          <div className="mt-6 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={top.risk.history}>
                <defs>
                  <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-risk-high)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-risk-high)" stopOpacity={0.02} />
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
                <Area
                  type="monotone"
                  dataKey="risk"
                  stroke="var(--color-risk-high)"
                  strokeWidth={2.5}
                  fill="url(#riskFill)"
                  name="Risk score"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <div className="space-y-6">
          <section className="card-surface p-5">
            <h2 className="text-lg font-semibold">Risk distribution</h2>
            <div className="mt-3 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distribution}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="band" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="var(--color-primary)" radius={[6, 6, 0, 0]} name="Animals" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg bg-risk-critical-soft py-2">
                <dt className="text-risk-critical">High</dt>
                <dd className="text-lg font-bold text-risk-critical">{counts.high}</dd>
              </div>
              <div className="rounded-lg bg-risk-moderate-soft py-2">
                <dt className="text-risk-moderate">Moderate</dt>
                <dd className="text-lg font-bold text-risk-moderate">{counts.moderate}</dd>
              </div>
              <div className="rounded-lg bg-risk-low-soft py-2">
                <dt className="text-risk-low">Low</dt>
                <dd className="text-lg font-bold text-risk-low">{counts.low}</dd>
              </div>
            </dl>
          </section>

          <section className="card-surface p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t("alerts")}</h2>
              <Link to="/alerts" className="text-sm font-medium text-primary hover:underline">
                View all
              </Link>
            </div>
            <ul className="mt-3 space-y-3">
              {(newAlerts.length ? newAlerts : alerts).slice(0, 3).map((a) => (
                <li key={a.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold">{a.animalCode}</span>
                    <RiskPill level={a.severity} size="sm" />
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{a.message}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Milk EC (highest risk animal)"
          value={`${top.animal.current.milkEc.toFixed(1)} mS/cm`}
          icon={Droplets}
          deviation={top.risk.signals.find((s) => s.key === "milkEc")?.deviationPct}
          abnormal={top.risk.signals.find((s) => s.key === "milkEc")?.abnormal}
        />
        <MetricCard
          label="Milk yield"
          value={`${top.animal.current.milkYield.toFixed(1)} L`}
          icon={Gauge}
          deviation={top.risk.signals.find((s) => s.key === "milkYield")?.deviationPct}
          abnormal={top.risk.signals.find((s) => s.key === "milkYield")?.abnormal}
        />
        <MetricCard
          label="Activity"
          value={`${top.animal.current.activity} steps`}
          icon={Activity}
          deviation={top.risk.signals.find((s) => s.key === "activity")?.deviationPct}
          abnormal={top.risk.signals.find((s) => s.key === "activity")?.abnormal}
        />
        <MetricCard
          label="Body temperature"
          value={`${top.animal.current.bodyTemperature.toFixed(1)}°C`}
          icon={Thermometer}
          deviation={top.risk.signals.find((s) => s.key === "bodyTemperature")?.deviationPct}
          abnormal={top.risk.signals.find((s) => s.key === "bodyTemperature")?.abnormal}
        />
      </section>
    </div>
  );
}
