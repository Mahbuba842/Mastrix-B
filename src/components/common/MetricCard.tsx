import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  deviation,
  abnormal,
}: {
  label: string;
  value: string;
  sub?: string | undefined;
  icon?: LucideIcon | undefined;
  deviation?: number | undefined;
  abnormal?: boolean | undefined;
}) {
  const Arrow =
    deviation === undefined || Math.abs(deviation) < 0.5
      ? Minus
      : deviation > 0
        ? ArrowUpRight
        : ArrowDownRight;
  return (
    <div className="card-surface p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        {Icon && <Icon className={cn("size-4", abnormal ? "text-risk-high" : "text-primary")} aria-hidden />}
      </div>
      <p className="mt-2 text-2xl font-bold tabular-nums">{value}</p>
      <div className="mt-1 flex items-center gap-1.5">
        {deviation !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-semibold tabular-nums",
              abnormal ? "text-risk-high" : "text-muted-foreground",
            )}
          >
            <Arrow className="size-3.5" aria-hidden />
            {deviation > 0 ? "+" : ""}
            {deviation.toFixed(1)}%
          </span>
        )}
        {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
      </div>
    </div>
  );
}
