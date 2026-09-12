import { createFileRoute } from "@tanstack/react-router";
import { Activity, AlertTriangle, Battery, CheckCircle2, Wifi } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/lib/store";
import type { SensorHealth, SensorStatus } from "@/types";

export const Route = createFileRoute("/_app/sensors")({
  head: () => ({
    meta: [
      { title: "Sensor Health — Mastrix B" },
      { name: "description", content: "Status of the sensor units collecting mastitis risk signals." },
      { property: "og:title", content: "Sensor Health — Mastrix B" },
      { property: "og:description", content: "Live sensor health and data quality status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Sensors,
});

function Sensors() {
  const { sensors, sensorHealthScore, setSensorStatus, t } = useStore();

  return (
    <div>
      <PageHeader
        title={t("sensorHealth")}
        description="Sensor quality directly affects the confidence of every risk score."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="card-surface p-5 text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Overall health</p>
          <p className="mt-1 text-3xl font-bold tabular-nums">{sensorHealthScore}%</p>
          <Progress value={sensorHealthScore} className="mt-3 h-2" />
        </div>
        <div className="card-surface p-5 text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Healthy sensors</p>
          <p className="mt-1 text-3xl font-bold tabular-nums">
            {sensors.filter((s) => s.status === "good").length}/{sensors.length}
          </p>
        </div>
        <div className="card-surface p-5 text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Faulty sensors</p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-risk-critical">
            {sensors.filter((s) => s.status === "faulty").length}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sensors.map((sensor) => (
          <SensorCard key={sensor.id} sensor={sensor} onChange={setSensorStatus} />
        ))}
      </div>
    </div>
  );
}

function SensorCard({
  sensor,
  onChange,
}: {
  sensor: SensorHealth;
  onChange: (id: string, status: SensorStatus) => void;
}) {
  return (
    <div className="card-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{sensor.name}</h3>
          <p className="text-xs text-muted-foreground">{sensor.component}</p>
        </div>
        <StatusBadge status={sensor.status} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
        <div className="rounded-lg border border-border p-2">
          <Battery className="mx-auto size-4" aria-hidden />
          <span className="mt-1 block font-semibold">{sensor.batteryLevel}%</span>
          <span className="block text-muted-foreground">Battery</span>
        </div>
        <div className="rounded-lg border border-border p-2">
          <Wifi className="mx-auto size-4" aria-hidden />
          <span className="mt-1 block font-semibold">{sensor.signalStrength} dBm</span>
          <span className="block text-muted-foreground">Signal</span>
        </div>
        <div className="rounded-lg border border-border p-2">
          <Activity className="mx-auto size-4" aria-hidden />
          <span className="mt-1 block font-semibold">{sensor.lastReadingSecondsAgo}s</span>
          <span className="block text-muted-foreground">Last seen</span>
        </div>
      </div>

      {sensor.note && (
        <p className="mt-3 flex items-start gap-2 text-xs text-risk-moderate">
          <AlertTriangle className="size-3.5 shrink-0" aria-hidden /> {sensor.note}
        </p>
      )}

      <div className="mt-4">
        <Select value={sensor.status} onValueChange={(v) => onChange(sensor.id, v as SensorStatus)}>
          <SelectTrigger className="h-9" aria-label={`Change status for ${sensor.name}`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="good">Healthy</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="faulty">Faulty</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: SensorStatus }) {
  if (status === "good") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-risk-low-soft px-2.5 py-1 text-xs font-semibold text-risk-low">
        <CheckCircle2 className="size-3.5" aria-hidden /> Good
      </span>
    );
  }
  if (status === "warning") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-risk-moderate-soft px-2.5 py-1 text-xs font-semibold text-risk-moderate">
        <AlertTriangle className="size-3.5" aria-hidden /> Warning
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-risk-critical-soft px-2.5 py-1 text-xs font-semibold text-risk-critical">
      <AlertTriangle className="size-3.5" aria-hidden /> Faulty
    </span>
  );
}
