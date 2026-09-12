import { cn } from "@/lib/utils";
import { riskLevelToken } from "@/lib/riskEngine";
import type { RiskLevel } from "@/types";

export function RiskPill({
  level,
  score,
  className,
  size = "md",
}: {
  level: RiskLevel;
  score?: number;
  className?: string;
  size?: "sm" | "md";
}) {
  const token = riskLevelToken(level);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full font-semibold",
        token.bg,
        token.text,
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
        className,
      )}
    >
      <span className={cn("size-2 rounded-full", token.dot)} aria-hidden />
      {level}
      {typeof score === "number" && <span className="tabular-nums opacity-80">{score}%</span>}
    </span>
  );
}

export function TrendText({ trend }: { trend: string }) {
  return <span className="text-sm font-medium text-muted-foreground">{trend}</span>;
}
