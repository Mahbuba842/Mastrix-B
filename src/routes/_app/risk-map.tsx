import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { RiskPill } from "@/components/common/RiskPill";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SHEDS } from "@/data/animals";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_app/risk-map")({
  head: () => ({
    meta: [
      { title: "Risk Map — Mastrix B" },
      {
        name: "description",
        content: "Visual shed-by-shed map of mastitis risk across the monitored herd.",
      },
      { property: "og:title", content: "Risk Map — Mastrix B" },
      { property: "og:description", content: "Shed-by-shed mastitis risk map across the herd." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RiskMap,
});

function RiskMap() {
  const { animals, assessments, t } = useStore();

  return (
    <div>
      <PageHeader
        title={t("riskMap")}
        description="A simple shed-level view of where attention is needed right now."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {SHEDS.map((shed) => {
          const shedAnimals = animals.filter((a) => a.shed === shed);
          const avg = Math.round(
            shedAnimals.reduce((s, a) => s + assessments[a.code]!.currentRisk, 0) /
              Math.max(1, shedAnimals.length),
          );
          const high = shedAnimals.filter((a) => assessments[a.code]!.currentRisk > 60).length;
          return (
            <Card key={shed}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="size-5 text-primary" aria-hidden /> {shed}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold tabular-nums">{avg}%</p>
                    <p className="text-sm text-muted-foreground">Average risk</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-risk-high tabular-nums">{high}</p>
                    <p className="text-sm text-muted-foreground">High-risk animals</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {shedAnimals.map((a) => {
                    const r = assessments[a.code]!;
                    return (
                      <Link
                        key={a.code}
                        to="/animal/$animalId"
                        params={{ animalId: a.code }}
                        className="group relative rounded-lg border border-border p-2 text-center transition-colors hover:bg-accent"
                      >
                        <p className="text-xs font-semibold">{a.code}</p>
                        <span
                          className="mx-auto mt-1 block h-1.5 w-8 rounded-full"
                          style={{
                            backgroundColor: `var(--color-${riskColorToken(r.currentRisk)})`,
                          }}
                          aria-hidden
                        />
                        <span className="absolute -bottom-6 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded bg-card px-2 py-1 text-xs shadow group-hover:block">
                          {r.level} · {r.currentRisk}%
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">All animals by location</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {animals
            .map((a) => ({ animal: a, risk: assessments[a.code]! }))
            .sort((x, y) => y.risk.currentRisk - x.risk.currentRisk)
            .map(({ animal, risk }) => (
              <Link
                key={animal.code}
                to="/animal/$animalId"
                params={{ animalId: animal.code }}
                className="card-surface block p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{animal.code}</span>
                  <RiskPill level={risk.level} score={risk.currentRisk} size="sm" />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {animal.shed} · {animal.breed} · {risk.abnormalSignalCount}/5 signals
                </p>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}

function riskColorToken(score: number) {
  if (score <= 20) return "risk-low";
  if (score <= 40) return "risk-mild";
  if (score <= 60) return "risk-moderate";
  if (score <= 80) return "risk-high";
  return "risk-critical";
}
