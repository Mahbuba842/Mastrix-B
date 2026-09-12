import { useState } from "react";
import { ClientDate } from "@/components/common/ClientDate";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Clock, Filter, XCircle } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { RiskPill } from "@/components/common/RiskPill";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/lib/store";
import type { AlertStatus } from "@/types";

export const Route = createFileRoute("/_app/alerts")({
  head: () => ({
    meta: [
      { title: "Alerts — Mastrix B" },
      {
        name: "description",
        content: "Mastitis early-warning alerts, their status and recommended next steps.",
      },
      { property: "og:title", content: "Alerts — Mastrix B" },
      { property: "og:description", content: "Mastitis early-warning alerts and next steps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Alerts,
});

const STATUS_ICON: Record<AlertStatus, typeof Check> = {
  new: XCircle,
  acknowledged: Clock,
  resolved: Check,
};

function Alerts() {
  const { alerts, setAlertStatus, t } = useStore();
  const [filter, setFilter] = useState<"all" | AlertStatus>("all");

  const filtered = alerts.filter((a) => (filter === "all" ? true : a.status === filter));

  return (
    <div>
      <PageHeader
        title={t("alerts")}
        description="Early-warning alerts generated from multi-signal risk scoring."
        actions={
          <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <SelectTrigger className="w-[160px]" aria-label="Filter alerts">
              <Filter className="mr-2 size-4" aria-hidden />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="acknowledged">Acknowledged</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <div className="space-y-3">
        {filtered.map((a) => {
          const StatusIcon = STATUS_ICON[a.status];
          return (
            <div
              key={a.id}
              className="card-surface flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{a.title}</span>
                  <RiskPill level={a.severity} size="sm" />
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold capitalize"
                    style={{
                      backgroundColor: statusBg(a.status),
                      color: statusText(a.status),
                    }}
                  >
                    <StatusIcon className="size-3" aria-hidden /> {a.status}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">{a.message}</p>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  <ClientDate date={a.createdAt} />
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                {a.status === "new" && (
                  <Button size="sm" variant="outline" onClick={() => setAlertStatus(a.id, "acknowledged")}>
                    Acknowledge
                  </Button>
                )}
                {a.status !== "resolved" && (
                  <Button size="sm" onClick={() => setAlertStatus(a.id, "resolved")}>
                    <Check className="mr-1 size-3.5" aria-hidden /> Resolve
                  </Button>
                )}
                {a.status === "resolved" && (
                  <Button size="sm" variant="outline" onClick={() => setAlertStatus(a.id, "new")}>
                    Reopen
                  </Button>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">No alerts match this filter.</p>
        )}
      </div>
    </div>
  );
}

function statusBg(status: AlertStatus) {
  if (status === "new") return "var(--color-risk-critical-soft)";
  if (status === "acknowledged") return "var(--color-risk-moderate-soft)";
  return "var(--color-risk-low-soft)";
}

function statusText(status: AlertStatus) {
  if (status === "new") return "var(--color-risk-critical)";
  if (status === "acknowledged") return "var(--color-risk-moderate)";
  return "var(--color-risk-low)";
}
