import { createFileRoute } from "@tanstack/react-router";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/common/PageHeader";
import { RiskPill } from "@/components/common/RiskPill";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_app/forecast")({
  head: () => ({
    meta: [
      { title: "Risk Forecast — Mastrix B" },
      {
        name: "description",
        content:
          "7- and 14-day mastitis risk outlook for each monitored animal and the herd overall.",
      },
      { property: "og:title", content: "Risk Forecast — Mastrix B" },
      {
        property: "og:description",
        content: "7- and 14-day mastitis risk outlook for every animal in the herd.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Forecast,
});

function Forecast() {
  const { animals, assessments, t } = useStore();
  const rows = animals
    .map((a) => ({ animal: a, risk: assessments[a.code]! }))
    .sort((x, y) => y.risk.fourteenDayRisk - x.risk.fourteenDayRisk);

  const herdData = [
    { label: "Today", value: Math.round(rows.reduce((s, r) => s + r.risk.currentRisk, 0) / rows.length) },
    { label: "Day +7", value: Math.round(rows.reduce((s, r) => s + r.risk.sevenDayRisk, 0) / rows.length) },
    { label: "Day +14", value: Math.round(rows.reduce((s, r) => s + r.risk.fourteenDayRisk, 0) / rows.length) },
  ];

  return (
    <div>
      <PageHeader
        title={t("riskForecast")}
        description="7- and 14-day risk outlook for the herd and individual animals, based on current trajectory."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Herd average risk outlook</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={herdData}>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-primary)"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "var(--color-primary)", strokeWidth: 0 }}
                    name="Herd risk"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key numbers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-card p-3">
              <span className="text-sm text-muted-foreground">Animals likely to become high risk</span>
              <span className="text-2xl font-bold tabular-nums text-risk-high">
                {rows.filter((r) => r.risk.sevenDayRisk > 60).length}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-card p-3">
              <span className="text-sm text-muted-foreground">Average 14-day risk</span>
              <span className="text-2xl font-bold tabular-nums">
                {herdData[2]?.value}%
              </span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Forecasts assume no intervention. Early action can shift these trajectories downward.
            </p>
          </CardContent>
        </Card>
      </div>

      <h2 className="mb-4 mt-8 text-lg font-semibold">Individual animal forecast</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {rows.slice(0, 12).map(({ animal, risk }) => (
          <div key={animal.code} className="card-surface p-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{animal.code}</span>
              <RiskPill level={risk.level} score={risk.currentRisk} size="sm" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {animal.breed} · {animal.shed}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-1 text-center text-xs">
              <div className="rounded bg-muted p-1.5">
                <span className="block font-bold">{risk.currentRisk}%</span>
                <span className="block text-muted-foreground">Now</span>
              </div>
              <div className="rounded bg-muted p-1.5">
                <span className="block font-bold">{risk.sevenDayRisk}%</span>
                <span className="block text-muted-foreground">+7</span>
              </div>
              <div className="rounded bg-muted p-1.5">
                <span className="block font-bold">{risk.fourteenDayRisk}%</span>
                <span className="block text-muted-foreground">+14</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
