import { createFileRoute } from "@tanstack/react-router";
import { ClientDate } from "@/components/common/ClientDate";
import { Pause, Play, RefreshCcw, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_app/history")({
  head: () => ({
    meta: [
      { title: "Data History — Mastrix B" },
      { name: "description", content: "Latest raw sensor readings and source stream." },
      { property: "og:title", content: "Data History — Mastrix B" },
      { property: "og:description", content: "Latest raw sensor readings and source stream." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: History,
});

function History() {
  const { readings, pendingSync, paused, setPaused, addReading, clearReadings, syncNow, t } = useStore();

  return (
    <div>
      <PageHeader
        title={t("dataHistory")}
        description="The latest readings received from sensors or the simulator."
        actions={
          <div className="flex flex-wrap gap-2">
            {pendingSync > 0 && (
              <Button size="sm" variant="outline" onClick={syncNow}>
                <RefreshCcw className="mr-1 size-4" aria-hidden /> Sync {pendingSync} pending
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => setPaused(!paused)}>
              {paused ? <Play className="mr-1 size-4" /> : <Pause className="mr-1 size-4" />}
              {paused ? "Resume" : "Pause"}
            </Button>
            <Button size="sm" variant="outline" onClick={clearReadings}>
              <Trash2 className="mr-1 size-4" aria-hidden /> Clear
            </Button>
          </div>
        }
      />

      <div className="card-surface hidden overflow-hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Animal</TableHead>
              <TableHead>RFID</TableHead>
              <TableHead className="text-right">Milk EC</TableHead>
              <TableHead className="text-right">Body temp</TableHead>
              <TableHead className="text-right">Yield</TableHead>
              <TableHead className="text-right">Activity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {readings.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="tabular-nums"><ClientDate date={r.time} options={{ timeStyle: "medium" }} /></TableCell>
                <TableCell>
                  <Badge variant={r.source === "offline" ? "secondary" : "outline"}>{r.source}</Badge>
                </TableCell>
                <TableCell className="font-semibold">{r.animalCode}</TableCell>
                <TableCell className="font-mono text-xs">{r.rfid}</TableCell>
                <TableCell className="text-right tabular-nums">{r.milkEc.toFixed(1)}</TableCell>
                <TableCell className="text-right tabular-nums">{r.bodyTemperature.toFixed(1)}°C</TableCell>
                <TableCell className="text-right tabular-nums">{r.milkYield.toFixed(1)} L</TableCell>
                <TableCell className="text-right tabular-nums">{r.activity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {readings.length === 0 && (
          <p className="p-6 text-center text-sm text-muted-foreground">
            No readings yet. Click the Simulate button in the header or wait for the live feed.
          </p>
        )}
      </div>

      <div className="grid gap-3 md:hidden">
        {readings.slice(0, 20).map((r) => (
          <div key={r.id} className="card-surface p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{r.animalCode}</span>
              <Badge variant={r.source === "offline" ? "secondary" : "outline"}>{r.source}</Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              <ClientDate date={r.time} options={{ timeStyle: "short" }} /> · <span className="font-mono">{r.rfid}</span>
            </p>
            <p className="mt-2 grid grid-cols-3 gap-2 text-xs tabular-nums">
              <span>EC {r.milkEc.toFixed(1)}</span>
              <span>{r.bodyTemperature.toFixed(1)}°C</span>
              <span>{r.milkYield.toFixed(1)} L</span>
            </p>
          </div>
        ))}
      </div>

      {readings.length === 0 && (
        <p className="mt-4 py-6 text-center text-sm text-muted-foreground md:hidden">
          No readings yet. Click Simulate in the header or wait for the live feed.
        </p>
      )}

      <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
        <Button size="sm" variant="secondary" onClick={() => addReading("simulator")}>
          Force one reading
        </Button>
        <span>{pendingSync} readings queued offline</span>
      </div>
    </div>
  );
}
