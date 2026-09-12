import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { buildHerd, HERO_ANIMAL_CODE } from "@/data/animals";
import { assessRisk } from "@/lib/riskEngine";
import { translate, type Language, type TranslationKey } from "@/lib/i18n";
import type {
  AlertItem,
  AlertStatus,
  Animal,
  DataMode,
  ReadingRow,
  RiskAssessment,
  Scenario,
  SensorHealth,
  SensorStatus,
} from "@/types";

const STORAGE_KEY = "mastrix-b:v1";
// Fixed reference time so server/client renders stay identical and avoid hydration mismatches.
const DEMO_EPOCH = new Date("2026-09-12T08:30:00.000Z").getTime();

export interface Settings {
  farmName: string;
  deviceId: string;
  refreshIntervalSec: number;
  highRiskThreshold: number;
  moderateRiskThreshold: number;
  notifications: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  farmName: "Green Valley Dairy Farm",
  deviceId: "ESP32-SHED-A-01",
  refreshIntervalSec: 5,
  highRiskThreshold: 61,
  moderateRiskThreshold: 41,
  notifications: true,
};

const DEFAULT_SENSORS: SensorHealth[] = [
  { id: "ec", name: "Milk EC", component: "Milk EC probe", status: "good", lastReadingSecondsAgo: 2, batteryLevel: 88, signalStrength: -58 },
  { id: "milk-temp", name: "Milk Temperature", component: "DS18B20", status: "good", lastReadingSecondsAgo: 2, batteryLevel: 88, signalStrength: -58 },
  { id: "body-temp", name: "Body Temperature", component: "DS18B20 (udder)", status: "good", lastReadingSecondsAgo: 3, batteryLevel: 84, signalStrength: -61 },
  { id: "yield", name: "Milk Yield", component: "Load cell + HX711", status: "warning", lastReadingSecondsAgo: 480, batteryLevel: 71, signalStrength: -67, note: "Drift detected — recalibration suggested" },
  { id: "activity", name: "Activity", component: "MPU6050", status: "good", lastReadingSecondsAgo: 1, batteryLevel: 90, signalStrength: -55 },
  { id: "env", name: "Environment", component: "BME280", status: "good", lastReadingSecondsAgo: 4, batteryLevel: 90, signalStrength: -55 },
];

const DEFAULT_ALERTS: AlertItem[] = [
  {
    id: "a1",
    animalCode: "C024",
    severity: "Very High",
    title: "High Risk — C024",
    message: "Multiple risk indicators detected. Milk EC, yield, activity and body temperature are all deviating from the personal baseline.",
    status: "new",
    createdAt: new Date(DEMO_EPOCH - 12 * 60_000).toISOString(),
  },
  {
    id: "a2",
    animalCode: "C045",
    severity: "High",
    title: "High Risk — C045",
    message: "Milk EC rising and milk yield falling for three consecutive days.",
    status: "new",
    createdAt: new Date(DEMO_EPOCH - 46 * 60_000).toISOString(),
  },
  {
    id: "a3",
    animalCode: "C018",
    severity: "Moderate",
    title: "Moderate Risk — C018",
    message: "Milk EC and activity are deviating from baseline.",
    status: "acknowledged",
    createdAt: new Date(DEMO_EPOCH - 3 * 3600_000).toISOString(),
  },
  {
    id: "a4",
    animalCode: "C011",
    severity: "Low",
    title: "Monitoring — C011",
    message: "Risk stable. All signals within the animal's personal baseline range.",
    status: "resolved",
    createdAt: new Date(DEMO_EPOCH - 26 * 3600_000).toISOString(),
  },
];

export const DEMO_STAGES = [
  { title: "Baseline established", detail: "C024 is sitting on its personal baseline — all signals normal." },
  { title: "Sensor values drift", detail: "Milk EC rises and milk yield begins to fall." },
  { title: "Baseline deviations grow", detail: "Deviation from personal baseline crosses the alert band." },
  { title: "Velocity & acceleration", detail: "Deviation is not only large, it is speeding up." },
  { title: "Risk score increases", detail: "The Prototype Risk Engine fuses the weighted signals." },
  { title: "Multi-signal confirmation", detail: "4 / 4 independent signals now abnormal." },
  { title: "Explainable alert raised", detail: "A Very High risk early warning is created for C024." },
  { title: "Farmer recommendation", detail: "Immediate, preventive and veterinary actions are suggested." },
  { title: "Herd cluster detected", detail: "Shed A shows several elevated-risk animals." },
];

interface StoreValue {
  animals: Animal[];
  assessments: Record<string, RiskAssessment>;
  heroAnimal: Animal;
  scenario: Scenario;
  setScenario: (s: Scenario) => void;
  dataMode: DataMode;
  setDataMode: (m: DataMode) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  t: (key: TranslationKey) => string;
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  sensors: SensorHealth[];
  setSensorStatus: (id: string, status: SensorStatus) => void;
  sensorHealthScore: number;
  alerts: AlertItem[];
  setAlertStatus: (id: string, status: AlertStatus) => void;
  readings: ReadingRow[];
  paused: boolean;
  setPaused: (p: boolean) => void;
  addReading: (source?: ReadingRow["source"]) => void;
  clearReadings: () => void;
  lastUpdateSeconds: number;
  pendingSync: number;
  syncNow: () => void;
  scannedRfid: string | null;
  scanRfid: (uid: string) => void;
  demoStage: number | null;
  startDemo: () => void;
  stopDemo: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

function loadPersisted(): Partial<{
  settings: Settings;
  language: Language;
  dataMode: DataMode;
  alertStatuses: Record<string, AlertStatus>;
}> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [scenario, setScenario] = useState<Scenario>("high");
  const [dataMode, setDataMode] = useState<DataMode>("simulation");
  const [language, setLanguage] = useState<Language>("en");
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [sensors, setSensors] = useState<SensorHealth[]>(DEFAULT_SENSORS);
  const [alerts, setAlerts] = useState<AlertItem[]>(DEFAULT_ALERTS);
  const [readings, setReadings] = useState<ReadingRow[]>([]);
  const [paused, setPaused] = useState(false);
  const [lastUpdateSeconds, setLastUpdateSeconds] = useState(0);
  const [pendingSync, setPendingSync] = useState(0);
  const [scannedRfid, setScannedRfid] = useState<string | null>(null);
  const [demoStage, setDemoStage] = useState<number | null>(null);
  const demoTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Hydration-safe restore of persisted preferences.
  useEffect(() => {
    const p = loadPersisted();
    if (p.settings) setSettings({ ...DEFAULT_SETTINGS, ...p.settings });
    if (p.language) setLanguage(p.language);
    if (p.dataMode) setDataMode(p.dataMode);
    if (p.alertStatuses) {
      const statuses = p.alertStatuses;
      setAlerts((prev) =>
        prev.map((a) => {
          const next = statuses[a.id];
          return next ? { ...a, status: next } : a;
        }),
      );
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const alertStatuses = Object.fromEntries(alerts.map((a) => [a.id, a.status]));
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ settings, language, dataMode, alertStatuses }),
    );
  }, [hydrated, settings, language, dataMode, alerts]);

  const animals = useMemo(() => buildHerd(scenario, DEMO_EPOCH), [scenario]);

  const assessments = useMemo(() => {
    const out: Record<string, RiskAssessment> = {};
    for (const a of animals) out[a.code] = assessRisk(a.baseline, a.current, sensors);
    return out;
  }, [animals, sensors]);

  const heroAnimal = useMemo(
    () => animals.find((a) => a.code === HERO_ANIMAL_CODE) ?? animals[0]!,
    [animals],
  );

  const addReading = useCallback(
    (source: ReadingRow["source"] = "simulator") => {
      const herd = buildHerd(scenario, DEMO_EPOCH);
      const animal = herd[Math.floor(Math.random() * herd.length)] ?? herd[0]!;
      const jitter = (v: number, pct: number) => +(v * (1 + (Math.random() - 0.5) * pct)).toFixed(2);
      setReadings((prev) =>
        [
          {
            id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
            time: new Date().toISOString(),
            rfid: animal.rfidUid,
            animalCode: animal.code,
            milkEc: jitter(animal.current.milkEc, 0.04),
            bodyTemperature: jitter(animal.current.bodyTemperature, 0.01),
            milkYield: jitter(animal.current.milkYield, 0.06),
            activity: Math.round(jitter(animal.current.activity, 0.05)),
            source,
          },
          ...prev,
        ].slice(0, 40),
      );
      setLastUpdateSeconds(0);
      if (source === "offline") setPendingSync((n) => n + 1);
    },
    [scenario],
  );

  // Live feed ticker.
  useEffect(() => {
    if (!hydrated) return;
    const tick = setInterval(() => setLastUpdateSeconds((s) => s + 1), 1000);
    return () => clearInterval(tick);
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated || paused) return;
    const ms = Math.max(2, settings.refreshIntervalSec) * 1000;
    const id = setInterval(() => addReading(dataMode === "offline" ? "offline" : dataMode === "live" ? "esp32" : "simulator"), ms);
    return () => clearInterval(id);
  }, [hydrated, paused, settings.refreshIntervalSec, dataMode, addReading]);

  useEffect(() => {
    if (dataMode === "offline") setPendingSync((n) => (n === 0 ? 12 : n));
  }, [dataMode]);

  const startDemo = useCallback(() => {
    if (demoTimer.current) clearInterval(demoTimer.current);
    setDemoStage(0);
    setScenario("normal");
    let stage = 0;
    demoTimer.current = setInterval(() => {
      stage += 1;
      if (stage >= DEMO_STAGES.length) {
        if (demoTimer.current) clearInterval(demoTimer.current);
        demoTimer.current = null;
        setDemoStage(DEMO_STAGES.length - 1);
        return;
      }
      setDemoStage(stage);
      if (stage === 1) setScenario("early");
      if (stage === 4) setScenario("high");
    }, 3000);
  }, []);

  const stopDemo = useCallback(() => {
    if (demoTimer.current) clearInterval(demoTimer.current);
    demoTimer.current = null;
    setDemoStage(null);
    setScenario("high");
  }, []);

  useEffect(() => () => { if (demoTimer.current) clearInterval(demoTimer.current); }, []);

  const sensorHealthScore = useMemo(() => {
    const value = sensors.reduce(
      (sum, s) => sum + (s.status === "good" ? 100 : s.status === "warning" ? 62 : 0),
      0,
    );
    return Math.round(value / Math.max(1, sensors.length));
  }, [sensors]);

  const value: StoreValue = {
    animals,
    assessments,
    heroAnimal,
    scenario,
    setScenario,
    dataMode,
    setDataMode,
    language,
    setLanguage,
    t: (key) => translate(key, language),
    settings,
    updateSettings: (patch) => setSettings((s) => ({ ...s, ...patch })),
    sensors,
    setSensorStatus: (id, status) =>
      setSensors((prev) =>
        prev.map((s) => {
          if (s.id !== id) return s;
          const note =
            status === "faulty"
              ? "Simulated fault — no valid readings"
              : status === "warning"
                ? "Degraded readings"
                : undefined;
          return {
            ...s,
            status,
            note,
            lastReadingSecondsAgo: status === "faulty" ? 900 : 2,
          } satisfies SensorHealth;
        }),
      ),
    sensorHealthScore,
    alerts,
    setAlertStatus: (id, status) =>
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a))),
    readings,
    paused,
    setPaused,
    addReading,
    clearReadings: () => setReadings([]),
    lastUpdateSeconds,
    pendingSync,
    syncNow: () => setPendingSync(0),
    scannedRfid,
    scanRfid: setScannedRfid,
    demoStage,
    startDemo,
    stopDemo,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
