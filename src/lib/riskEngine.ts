import { computeDynamics } from "@/lib/baselineEngine";
import { computeConfidence } from "@/lib/confidenceEngine";
import type { Metrics, RiskAssessment, RiskLevel, SensorHealth, SignalDynamics } from "@/types";

/**
 * Prototype Risk Engine — a transparent, rule-based temporal scoring engine.
 * It is deliberately NOT a trained ML model. The interface below
 * (metrics + baseline -> score) can later be swapped for XGBoost / LightGBM
 * or another temporal model trained on real veterinary datasets.
 */

export const BASE_WEIGHTS: Record<string, number> = {
  milkEc: 0.3,
  milkYield: 0.25,
  activity: 0.2,
  bodyTemperature: 0.15,
  thi: 0.1,
};

const SENSITIVITY: Record<string, number> = {
  milkEc: 4.2,
  milkYield: 4.0,
  activity: 3.0,
  bodyTemperature: 34,
  thi: 3.2,
};

function levelFor(score: number): RiskLevel {
  if (score <= 20) return "Low";
  if (score <= 40) return "Mild";
  if (score <= 60) return "Moderate";
  if (score <= 80) return "High";
  return "Very High";
}

function signalScore(s: SignalDynamics): number {
  const adverse =
    s.key === "milkYield" || s.key === "activity" ? -s.deviationPct : s.deviationPct;
  const raw = adverse * (SENSITIVITY[s.key] ?? 3);
  return Math.max(0, Math.min(100, raw));
}

export function assessRisk(
  baseline: Metrics,
  current: Metrics,
  sensors: SensorHealth[],
): RiskAssessment {
  const signals = computeDynamics(baseline, current);

  const contributions = signals.map((s) => {
    const weight = BASE_WEIGHTS[s.key] ?? 0;
    return {
      label: s.label,
      weight,
      contribution: signalScore(s) * weight,
    };
  });

  let score = contributions.reduce((sum, c) => sum + c.contribution, 0);

  // Temporal modifiers
  const velocityBoost = signals.reduce((sum, s) => {
    const adverse = s.key === "milkYield" || s.key === "activity" ? -s.velocity : s.velocity;
    return sum + Math.max(0, adverse) * 1.1;
  }, 0);
  const accelBoost = signals.reduce((sum, s) => {
    const adverse =
      s.key === "milkYield" || s.key === "activity" ? -s.acceleration : s.acceleration;
    return sum + Math.max(0, adverse) * 1.6;
  }, 0);

  const abnormalSignalCount = signals.filter((s) => s.abnormal).length;
  const fusionBoost = abnormalSignalCount >= 4 ? 10 : abnormalSignalCount === 3 ? 6 : abnormalSignalCount === 2 ? 3 : 0;

  score = score + velocityBoost + accelBoost + fusionBoost;
  score = Math.max(0, Math.min(100, Math.round(score)));

  const growth = (velocityBoost + accelBoost) / 4;
  const sevenDayRisk = Math.max(0, Math.min(100, Math.round(score + growth * 1.2)));
  const fourteenDayRisk = Math.max(0, Math.min(100, Math.round(score + growth * 2.1)));

  const trend =
    growth > 6
      ? "Rapidly Increasing"
      : growth > 2.5
        ? "Increasing"
        : growth > 0.6
          ? "Slowly Increasing"
          : "Stable";

  const { score: confidence, level: confidenceLevel } = computeConfidence(signals, sensors);

  /**
   * The 14-day trail must agree with the gauge and the risk pill:
   *  - it starts at the animal's calm baseline risk,
   *  - its shape follows the same trend label shown next to the gauge,
   *  - its peak is today's score, which is exactly what the gauge shows.
   */
  const startFactor =
    trend === "Rapidly Increasing"
      ? 0.22
      : trend === "Increasing"
        ? 0.45
        : trend === "Slowly Increasing"
          ? 0.7
          : 0.95;
  const curve =
    trend === "Rapidly Increasing" ? 2.8 : trend === "Increasing" ? 2.0 : trend === "Slowly Increasing" ? 1.4 : 1;
  const baselineRisk = Math.max(2, Math.round(score * startFactor));

  const days = [-14, -12, -10, -8, -6, -4, -2, 0];
  const history = days.map((day, i) => {
    const t = (day + 14) / 14; // 0..1
    // Deterministic day-to-day wobble so a flat trend still reads as real data.
    const wobble = day === 0 ? 0 : Math.sin(i * 1.7) * Math.max(1, score * 0.02);
    const value = baselineRisk + (score - baselineRisk) * Math.pow(t, curve) + wobble;
    return {
      day,
      label: day === 0 ? "Today" : `Day ${day}`,
      // Never exceed today's score, so the chart peak equals the gauge value.
      risk: Math.max(0, Math.min(score, Math.round(value))),
    };
  });

  const forecast = [
    { day: 0, label: "Today", risk: score },
    { day: 7, label: "Day +7", risk: sevenDayRisk },
    { day: 14, label: "Day +14", risk: fourteenDayRisk },
  ];

  return {
    currentRisk: score,
    sevenDayRisk,
    fourteenDayRisk,
    level: levelFor(score),
    trend,
    abnormalSignalCount,
    confidence,
    confidenceLevel,
    signals,
    contributions,
    history,
    baselineRisk,
    peakRisk: history.reduce((max, p) => Math.max(max, p.risk), score),
    forecast,
  };
}

export function riskLevelToken(level: RiskLevel) {
  switch (level) {
    case "Low":
      return { text: "text-risk-low", bg: "bg-risk-low-soft", dot: "bg-risk-low" };
    case "Mild":
      return { text: "text-risk-mild", bg: "bg-risk-mild-soft", dot: "bg-risk-mild" };
    case "Moderate":
      return { text: "text-risk-moderate", bg: "bg-risk-moderate-soft", dot: "bg-risk-moderate" };
    case "High":
      return { text: "text-risk-high", bg: "bg-risk-high-soft", dot: "bg-risk-high" };
    default:
      return { text: "text-risk-critical", bg: "bg-risk-critical-soft", dot: "bg-risk-critical" };
  }
}
