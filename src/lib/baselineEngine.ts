import type { Metrics, SignalDynamics, SignalKey } from "@/types";

const SIGNALS: {
  key: SignalKey;
  label: string;
  unit: string;
  metric: keyof Metrics;
  abnormalPct: number;
  /** direction that is considered adverse */
  adverse: "up" | "down";
}[] = [
  { key: "milkEc", label: "Milk EC", unit: "mS/cm", metric: "milkEc", abnormalPct: 6, adverse: "up" },
  { key: "milkYield", label: "Milk Yield", unit: "L", metric: "milkYield", abnormalPct: 6, adverse: "down" },
  { key: "activity", label: "Activity", unit: "steps", metric: "activity", abnormalPct: 8, adverse: "down" },
  {
    key: "bodyTemperature",
    label: "Body Temperature",
    unit: "°C",
    metric: "bodyTemperature",
    abnormalPct: 1,
    adverse: "up",
  },
  { key: "thi", label: "Environment / THI", unit: "", metric: "thi", abnormalPct: 5, adverse: "up" },
];

/**
 * Personal baseline comparison: each animal is compared with its own
 * historical pattern rather than a fixed herd-wide threshold.
 */
export function computeDynamics(baseline: Metrics, current: Metrics): SignalDynamics[] {
  return SIGNALS.map((s) => {
    const base = baseline[s.metric];
    const cur = current[s.metric];
    const deviationPct = base === 0 ? 0 : ((cur - base) / base) * 100;
    // Velocity: how fast the signal is moving away from baseline (per day).
    const velocity = deviationPct / 6;
    // Acceleration: whether that movement is itself increasing (per day squared).
    const acceleration = velocity / 4;
    const adverseMove = s.adverse === "up" ? deviationPct : -deviationPct;
    return {
      key: s.key,
      label: s.label,
      unit: s.unit,
      baseline: base,
      current: cur,
      deviationPct,
      velocity,
      acceleration,
      abnormal: adverseMove >= s.abnormalPct,
      direction: deviationPct >= 0 ? "up" : "down",
    } satisfies SignalDynamics;
  });
}

export function formatMetric(key: SignalKey, value: number): string {
  switch (key) {
    case "milkEc":
      return `${value.toFixed(1)} mS/cm`;
    case "milkYield":
      return `${value.toFixed(1)} L`;
    case "activity":
      return `${Math.round(value)}`;
    case "bodyTemperature":
      return `${value.toFixed(1)}°C`;
    default:
      return value.toFixed(1);
  }
}
