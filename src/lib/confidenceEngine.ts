import type { SensorHealth, SignalDynamics } from "@/types";

/**
 * Prototype Confidence Score.
 * Built from signal availability, sensor health, persistence and
 * multi-signal agreement. This is NOT a statistical model confidence.
 */
export function computeConfidence(
  signals: SignalDynamics[],
  sensors: SensorHealth[],
): { score: number; level: "Low" | "Medium" | "High"; reasons: string[] } {
  const reasons: string[] = [];
  let score = 62;

  const healthy = sensors.filter((s) => s.status === "good").length;
  const warning = sensors.filter((s) => s.status === "warning").length;
  const faulty = sensors.filter((s) => s.status === "faulty").length;
  const availability = sensors.length ? healthy / sensors.length : 1;

  score += availability * 22;
  reasons.push(`${healthy}/${sensors.length} sensors reporting healthy data`);
  if (warning) {
    score -= warning * 5;
    reasons.push(`${warning} sensor(s) reporting degraded data`);
  }
  if (faulty) {
    score -= faulty * 14;
    reasons.push(`${faulty} sensor(s) faulty — signal availability reduced`);
  }

  const abnormal = signals.filter((s) => s.abnormal).length;
  if (abnormal >= 3) {
    score += 14;
    reasons.push(`${abnormal} independent signals agree on the same direction`);
  } else if (abnormal === 2) {
    score += 6;
    reasons.push("Two signals agree — partial multi-signal agreement");
  } else if (abnormal === 1) {
    score -= 6;
    reasons.push("Only one signal is deviating — limited agreement");
  } else {
    reasons.push("All signals near personal baseline");
  }

  const persistence = signals.filter((s) => Math.abs(s.velocity) > 1).length;
  if (persistence >= 2) {
    score += 6;
    reasons.push("Deviation is persistent across consecutive days");
  }

  score = Math.max(28, Math.min(96, Math.round(score)));
  const level = score >= 80 ? "High" : score >= 60 ? "Medium" : "Low";
  return { score, level, reasons };
}
