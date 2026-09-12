import type { Animal, Metrics, Scenario } from "@/types";

const BREEDS = [
  "Holstein Friesian",
  "Jersey",
  "Gir",
  "Sahiwal",
  "Murrah",
  "Crossbred",
] as const;

interface Seed {
  code: string;
  breed: (typeof BREEDS)[number];
  species: string;
  age: number;
  shed: "Shed A" | "Shed B" | "Shed C";
  /** 0 = at personal baseline, 1 = strongly deviating */
  stress: number;
  baseline: Partial<Metrics>;
}

const SEEDS: Seed[] = [
  { code: "C011", breed: "Holstein Friesian", species: "Cow", age: 4, shed: "Shed A", stress: 0.12, baseline: { milkEc: 4.1, milkYield: 13.1, activity: 8600, bodyTemperature: 38.4 } },
  { code: "C014", breed: "Jersey", species: "Cow", age: 5, shed: "Shed A", stress: 0.08, baseline: { milkEc: 4.3, milkYield: 10.8, activity: 8100, bodyTemperature: 38.5 } },
  { code: "C018", breed: "Gir", species: "Cow", age: 6, shed: "Shed A", stress: 0.52, baseline: { milkEc: 4.0, milkYield: 9.6, activity: 7900, bodyTemperature: 38.6 } },
  { code: "C021", breed: "Sahiwal", species: "Cow", age: 3, shed: "Shed A", stress: 0.18, baseline: { milkEc: 4.2, milkYield: 8.9, activity: 8300, bodyTemperature: 38.5 } },
  { code: "C024", breed: "Holstein Friesian", species: "Cow", age: 5, shed: "Shed A", stress: 0.85, baseline: { milkEc: 4.2, milkYield: 12.4, activity: 8200, bodyTemperature: 38.5 } },
  { code: "C027", breed: "Crossbred", species: "Cow", age: 7, shed: "Shed A", stress: 0.5, baseline: { milkEc: 4.4, milkYield: 9.2, activity: 7600, bodyTemperature: 38.7 } },
  { code: "C031", breed: "Jersey", species: "Cow", age: 4, shed: "Shed A", stress: 0.47, baseline: { milkEc: 4.1, milkYield: 11.2, activity: 8000, bodyTemperature: 38.4 } },
  { code: "C033", breed: "Gir", species: "Cow", age: 8, shed: "Shed B", stress: 0.15, baseline: { milkEc: 3.9, milkYield: 8.4, activity: 7400, bodyTemperature: 38.6 } },
  { code: "C036", breed: "Murrah", species: "Buffalo", age: 6, shed: "Shed B", stress: 0.1, baseline: { milkEc: 4.6, milkYield: 9.8, activity: 6900, bodyTemperature: 38.3 } },
  { code: "C039", breed: "Murrah", species: "Buffalo", age: 5, shed: "Shed B", stress: 0.22, baseline: { milkEc: 4.5, milkYield: 10.4, activity: 7100, bodyTemperature: 38.4 } },
  { code: "C042", breed: "Holstein Friesian", species: "Cow", age: 3, shed: "Shed B", stress: 0.05, baseline: { milkEc: 4.2, milkYield: 13.8, activity: 8800, bodyTemperature: 38.5 } },
  { code: "C045", breed: "Sahiwal", species: "Cow", age: 9, shed: "Shed B", stress: 0.78, baseline: { milkEc: 4.3, milkYield: 8.6, activity: 7300, bodyTemperature: 38.6 } },
  { code: "C048", breed: "Crossbred", species: "Cow", age: 4, shed: "Shed B", stress: 0.2, baseline: { milkEc: 4.1, milkYield: 10.1, activity: 8200, bodyTemperature: 38.5 } },
  { code: "C051", breed: "Jersey", species: "Cow", age: 6, shed: "Shed B", stress: 0.14, baseline: { milkEc: 4.2, milkYield: 10.9, activity: 8050, bodyTemperature: 38.4 } },
  { code: "C054", breed: "Gir", species: "Cow", age: 7, shed: "Shed C", stress: 0.28, baseline: { milkEc: 4.0, milkYield: 8.8, activity: 7700, bodyTemperature: 38.6 } },
  { code: "C057", breed: "Holstein Friesian", species: "Cow", age: 5, shed: "Shed C", stress: 0.49, baseline: { milkEc: 4.3, milkYield: 12.9, activity: 8400, bodyTemperature: 38.5 } },
  { code: "C060", breed: "Crossbred", species: "Cow", age: 6, shed: "Shed C", stress: 0.16, baseline: { milkEc: 4.2, milkYield: 9.7, activity: 7950, bodyTemperature: 38.5 } },
  { code: "C063", breed: "Sahiwal", species: "Cow", age: 4, shed: "Shed C", stress: 0.11, baseline: { milkEc: 4.1, milkYield: 9.1, activity: 8150, bodyTemperature: 38.4 } },
  { code: "C066", breed: "Murrah", species: "Buffalo", age: 8, shed: "Shed C", stress: 0.24, baseline: { milkEc: 4.7, milkYield: 9.4, activity: 6800, bodyTemperature: 38.3 } },
  { code: "C069", breed: "Jersey", species: "Cow", age: 3, shed: "Shed C", stress: 0.07, baseline: { milkEc: 4.2, milkYield: 11.6, activity: 8500, bodyTemperature: 38.6 } },
];

export const HERO_ANIMAL_CODE = "C024";

/** Scenario stress levels used by the Live Sensor Simulator + Demo Mode. */
export const SCENARIO_STRESS: Record<Scenario, number> = {
  normal: 0.18,
  early: 0.45,
  high: 0.85,
};

function baselineFor(seed: Seed): Metrics {
  return {
    milkEc: seed.baseline.milkEc ?? 4.2,
    milkYield: seed.baseline.milkYield ?? 10.5,
    activity: seed.baseline.activity ?? 8000,
    bodyTemperature: seed.baseline.bodyTemperature ?? 38.5,
    milkTemperature: 38.2,
    environmentalTemperature: 29.4,
    humidity: 64,
    thi: 74,
  };
}

function applyStress(baseline: Metrics, stress: number): Metrics {
  return {
    milkEc: +(baseline.milkEc * (1 + 0.2 * stress)).toFixed(2),
    milkYield: +(baseline.milkYield * (1 - 0.16 * stress)).toFixed(2),
    activity: Math.round(baseline.activity * (1 - 0.24 * stress)),
    bodyTemperature: +(baseline.bodyTemperature + 1.0 * stress).toFixed(2),
    milkTemperature: +(baseline.milkTemperature + 0.6 * stress).toFixed(2),
    environmentalTemperature: +(baseline.environmentalTemperature + 1.8 * stress).toFixed(1),
    humidity: +(baseline.humidity + 6 * stress).toFixed(1),
    thi: +(baseline.thi * (1 + 0.05 * stress)).toFixed(1),
  };
}

function rfidFor(code: string): string {
  const n = parseInt(code.slice(1), 10);
  const hex = (v: number) => v.toString(16).toUpperCase().padStart(2, "0");
  return `${hex(161 + n)}:${hex(178 + n)}:${hex(195 + n)}:${hex(212 + n)}`;
}

/**
 * Builds the synthetic herd. The hero animal (C024) follows the active
 * scenario so the simulator and demo mode drive the full pipeline.
 */
export function buildHerd(scenario: Scenario, now = Date.now()): Animal[] {
  return SEEDS.map((seed, i) => {
    const baseline = baselineFor(seed);
    const stress = seed.code === HERO_ANIMAL_CODE ? SCENARIO_STRESS[scenario] : seed.stress;
    return {
      id: seed.code.toLowerCase(),
      code: seed.code,
      species: seed.species,
      breed: seed.breed,
      age: seed.age,
      shed: seed.shed,
      rfidUid: rfidFor(seed.code),
      deviceId: `ESP32-${seed.shed.replace("Shed ", "SHED-")}-01`,
      baseline,
      current: applyStress(baseline, stress),
      lastUpdated: new Date(now - (i % 7) * 60_000 - 45_000).toISOString(),
    } satisfies Animal;
  });
}

export const SHEDS = ["Shed A", "Shed B", "Shed C"] as const;
export const ALL_BREEDS = BREEDS;
