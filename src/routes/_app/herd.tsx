import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Search } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { RiskPill } from "@/components/common/RiskPill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SHEDS } from "@/data/animals";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_app/herd")({
  head: () => ({
    meta: [
      { title: "Herd Monitoring — Mastrix B" },
      {
        name: "description",
        content:
          "Search, filter and sort every monitored animal by risk score, shed, breed and abnormal signal count.",
      },
      { property: "og:title", content: "Herd Monitoring — Mastrix B" },
      {
        property: "og:description",
        content: "Every monitored animal ranked by mastitis risk score.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Herd,
});

function Herd() {
  const { animals, assessments, t } = useStore();
  const [query, setQuery] = useState("");
  const [shed, setShed] = useState("all");
  const [band, setBand] = useState("all");
  const [sort, setSort] = useState("risk-desc");

  const rows = useMemo(() => {
    let list = animals.map((a) => ({ animal: a, risk: assessments[a.code]! }));
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.animal.code.toLowerCase().includes(q) ||
          r.animal.breed.toLowerCase().includes(q) ||
          r.animal.rfidUid.toLowerCase().includes(q),
      );
    }
    if (shed !== "all") list = list.filter((r) => r.animal.shed === shed);
    if (band !== "all") {
      list = list.filter((r) =>
        band === "high"
          ? r.risk.currentRisk > 60
          : band === "moderate"
            ? r.risk.currentRisk > 40 && r.risk.currentRisk <= 60
            : r.risk.currentRisk <= 40,
      );
    }
    list.sort((x, y) => {
      switch (sort) {
        case "risk-asc":
          return x.risk.currentRisk - y.risk.currentRisk;
        case "code":
          return x.animal.code.localeCompare(y.animal.code);
        case "yield":
          return y.animal.current.milkYield - x.animal.current.milkYield;
        default:
          return y.risk.currentRisk - x.risk.currentRisk;
      }
    });
    return list;
  }, [animals, assessments, query, shed, band, sort]);

  return (
    <div>
      <PageHeader
        title={t("herdMonitoring")}
        description="Every animal, ranked by how far it has drifted from its own normal."
      />

      <div className="card-surface mb-5 flex flex-wrap items-center gap-3 p-4">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by tag, breed or RFID"
            className="pl-9"
            aria-label="Search animals"
          />
        </div>
        <Select value={shed} onValueChange={setShed}>
          <SelectTrigger className="w-[140px]" aria-label="Filter by shed">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sheds</SelectItem>
            {SHEDS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={band} onValueChange={setBand}>
          <SelectTrigger className="w-[150px]" aria-label="Filter by risk">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All risk levels</SelectItem>
            <SelectItem value="high">{t("highRisk")}</SelectItem>
            <SelectItem value="moderate">{t("moderateRisk")}</SelectItem>
            <SelectItem value="low">{t("lowRisk")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[170px]" aria-label="Sort">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="risk-desc">Highest risk first</SelectItem>
            <SelectItem value="risk-asc">Lowest risk first</SelectItem>
            <SelectItem value="code">Animal tag</SelectItem>
            <SelectItem value="yield">Milk yield</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="card-surface hidden overflow-hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("animal")}</TableHead>
              <TableHead>Breed</TableHead>
              <TableHead>Shed</TableHead>
              <TableHead className="text-right">Milk EC</TableHead>
              <TableHead className="text-right">Yield</TableHead>
              <TableHead className="text-right">Body temp</TableHead>
              <TableHead className="text-right">Abnormal signals</TableHead>
              <TableHead>{t("risk")}</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ animal, risk }) => (
              <TableRow key={animal.code}>
                <TableCell className="font-semibold">{animal.code}</TableCell>
                <TableCell className="text-muted-foreground">{animal.breed}</TableCell>
                <TableCell className="text-muted-foreground">{animal.shed}</TableCell>
                <TableCell className="text-right tabular-nums">{animal.current.milkEc.toFixed(1)}</TableCell>
                <TableCell className="text-right tabular-nums">{animal.current.milkYield.toFixed(1)} L</TableCell>
                <TableCell className="text-right tabular-nums">{animal.current.bodyTemperature.toFixed(1)}°C</TableCell>
                <TableCell className="text-right tabular-nums">{risk.abnormalSignalCount} / 5</TableCell>
                <TableCell>
                  <RiskPill level={risk.level} score={risk.currentRisk} size="sm" />
                </TableCell>
                <TableCell>
                  <Link to="/animal/$animalId" params={{ animalId: animal.code }}>
                    <Button size="sm" variant="ghost" aria-label={`Open ${animal.code}`}>
                      <ArrowRight className="size-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {rows.length === 0 && (
          <p className="p-6 text-center text-sm text-muted-foreground">No animals match this filter.</p>
        )}
      </div>

      <div className="grid gap-3 md:hidden">
        {rows.map(({ animal, risk }) => (
          <Link
            key={animal.code}
            to="/animal/$animalId"
            params={{ animalId: animal.code }}
            className="card-surface block p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold">{animal.code}</span>
              <RiskPill level={risk.level} score={risk.currentRisk} size="sm" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {animal.breed} · {animal.shed} · {risk.abnormalSignalCount}/5 signals abnormal
            </p>
            <p className="mt-2 text-xs tabular-nums text-muted-foreground">
              EC {animal.current.milkEc.toFixed(1)} · Yield {animal.current.milkYield.toFixed(1)} L ·{" "}
              {animal.current.bodyTemperature.toFixed(1)}°C
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
