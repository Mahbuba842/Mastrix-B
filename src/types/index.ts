export type DataMode = "live" | "simulation" | "offline";

export type Scenario = "normal" | "early" | "high";

export type RiskLevel = "Low" | "Mild" | "Moderate" | "High" | "Very High";

export type SignalKey =
  | "milkEc"
  | "milkYield"
  | "activity"
  | "bodyTemperature"
  | "thi";

export interface Metrics {
  milkEc: number;
  milkYield: number;
  activity: number;
  bodyTemperature: number;
  milkTemperature: number;
  environmentalTemperature: number;
  humidity: number;
  thi: number;
}

export interface SignalDynamics {
  key: SignalKey;
  label: string;
  unit: string;
  baseline: number;
  current: number;
  deviationPct: number;
  velocity: number;
  acceleration: number;
  abnormal: boolean;
  direction: "up" | "down";
}

export interface Animal {
  id: string;
  code: string;
  species: string;
  breed: string;
  age: number;
  shed: string;
  rfidUid: string;
  deviceId: string;
  baseline: Metrics;
  current: Metrics;
  lastUpdated: string;
}

export interface RiskAssessment {
  currentRisk: number;
  sevenDayRisk: number;
  fourteenDayRisk: number;
  level: RiskLevel;
  trend: string;
  abnormalSignalCount: number;
  confidence: number;
  confidenceLevel: "Low" | "Medium" | "High";
  signals: SignalDynamics[];
  contributions: { label: string; weight: number; contribution: number }[];
  history: { day: number; label: string; risk: number }[];
  /** Calm starting point of the 14-day trail (the animal's own baseline risk). */
  baselineRisk: number;
  /** Highest point on the trail — equals currentRisk. */
  peakRisk: number;
  forecast: { day: number; label: string; risk: number }[];
}

export type SensorStatus = "good" | "warning" | "faulty";

export interface SensorHealth {
  id: string;
  name: string;
  component: string;
  status: SensorStatus;
  lastReadingSecondsAgo: number;
  batteryLevel: number;
  signalStrength: number;
  note?: string | undefined;
}

export type AlertStatus = "new" | "acknowledged" | "resolved";

export interface AlertItem {
  id: string;
  animalCode: string;
  severity: RiskLevel;
  title: string;
  message: string;
  status: AlertStatus;
  createdAt: string;
}

export interface ReadingRow {
  id: string;
  time: string;
  rfid: string;
  animalCode: string;
  milkEc: number;
  bodyTemperature: number;
  milkYield: number;
  activity: number;
  source: "esp32" | "simulator" | "offline";
}
