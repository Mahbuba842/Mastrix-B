import { riskLevelToken } from "@/lib/riskEngine";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types";

export function RiskGauge({
  score,
  level,
  size = 168,
  label = "Current risk",
}: {
  score: number;
  level: RiskLevel;
  size?: number;
  label?: string;
}) {
  const token = riskLevelToken(level);
  const radius = size / 2 - 12;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" role="img" aria-label={`${label} ${score} percent`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-muted"
            strokeWidth={12}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={cn("transition-all duration-700", token.text)}
            stroke="currentColor"
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            fill="none"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-4xl font-bold tabular-nums", token.text)}>{score}</span>
          <span className="text-xs font-medium text-muted-foreground">out of 100</span>
        </div>
      </div>
      <span className={cn("rounded-full px-3 py-1 text-sm font-semibold", token.bg, token.text)}>
        {level} Risk
      </span>
    </div>
  );
}
