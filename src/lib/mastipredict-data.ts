export type RiskLevel = 'Low' | 'Mild' | 'Moderate' | 'High' | 'Very High';

export type Animal = {
  id: string;
  species: 'Cow' | 'Buffalo';
  breed: string;
  age: number;
  milkYield: number;
  milkEc: number;
  bodyTemperature: number;
  activity: number;
  envTemperature: number;
  humidity: number;
  thi: number;
  baseline: { milkYield: number; milkEc: number; bodyTemperature: number; activity: number };
  velocity: { milkEc: number; activity: number; bodyTemperature: number };
  acceleration: { milkEc: number; activity: number };
  risk: number;
  confidence: number;
  shed: 'Shed A' | 'Shed B' | 'Shed C';
  rfid: string;
  lastSeen: string;
};

export const animals: Animal[] = [
  { id: 'C024', species: 'Cow', breed: 'Holstein Friesian', age: 5, milkYield: 10.7, milkEc: 4.9, bodyTemperature: 39.3, activity: 6640, envTemperature: 31.2, humidity: 71, thi: 80.7, baseline: { milkYield: 12.4, milkEc: 4.2, bodyTemperature: 38.5, activity: 8200 }, velocity: { milkEc: 2.8, activity: -3.2, bodyTemperature: 0.18 }, acceleration: { milkEc: 0.7, activity: -0.9 }, risk: 84, confidence: 92, shed: 'Shed A', rfid: 'RFID-024-AX', lastSeen: '2 min ago' },
  { id: 'C018', species: 'Cow', breed: 'Gir', age: 6, milkYield: 11.8, milkEc: 4.5, bodyTemperature: 38.9, activity: 7200, envTemperature: 30.4, humidity: 68, thi: 78.1, baseline: { milkYield: 12.6, milkEc: 4.1, bodyTemperature: 38.5, activity: 8100 }, velocity: { milkEc: 1.5, activity: -1.8, bodyTemperature: 0.09 }, acceleration: { milkEc: 0.3, activity: -0.4 }, risk: 62, confidence: 86, shed: 'Shed A', rfid: 'RFID-018-GR', lastSeen: '3 min ago' },
  { id: 'C011', species: 'Cow', breed: 'Sahiwal', age: 4, milkYield: 13.2, milkEc: 4.1, bodyTemperature: 38.5, activity: 8300, envTemperature: 29.7, humidity: 64, thi: 76.2, baseline: { milkYield: 13.1, milkEc: 4.0, bodyTemperature: 38.4, activity: 8000 }, velocity: { milkEc: 0.1, activity: 0.4, bodyTemperature: 0.01 }, acceleration: { milkEc: 0.0, activity: 0.1 }, risk: 18, confidence: 94, shed: 'Shed A', rfid: 'RFID-011-SH', lastSeen: '1 min ago' },
  { id: 'C031', species: 'Buffalo', breed: 'Murrah', age: 7, milkYield: 8.9, milkEc: 4.0, bodyTemperature: 38.4, activity: 7900, envTemperature: 30.1, humidity: 66, thi: 77.0, baseline: { milkYield: 9.2, milkEc: 3.9, bodyTemperature: 38.3, activity: 7800 }, velocity: { milkEc: 0.2, activity: -0.3, bodyTemperature: 0.02 }, acceleration: { milkEc: 0.0, activity: -0.1 }, risk: 34, confidence: 89, shed: 'Shed A', rfid: 'RFID-031-MR', lastSeen: '4 min ago' },
  { id: 'C017', species: 'Cow', breed: 'Jersey', age: 3, milkYield: 10.1, milkEc: 4.2, bodyTemperature: 38.6, activity: 7700, envTemperature: 29.3, humidity: 61, thi: 74.8, baseline: { milkYield: 10.3, milkEc: 4.0, bodyTemperature: 38.4, activity: 7600 }, velocity: { milkEc: 0.4, activity: -0.2, bodyTemperature: 0.03 }, acceleration: { milkEc: 0.1, activity: 0.0 }, risk: 28, confidence: 91, shed: 'Shed B', rfid: 'RFID-017-JR', lastSeen: '5 min ago' },
  { id: 'C022', species: 'Cow', breed: 'Crossbred', age: 5, milkYield: 12.5, milkEc: 4.0, bodyTemperature: 38.4, activity: 8450, envTemperature: 30.0, humidity: 65, thi: 76.8, baseline: { milkYield: 12.0, milkEc: 4.0, bodyTemperature: 38.4, activity: 8200 }, velocity: { milkEc: 0.0, activity: 0.5, bodyTemperature: 0.0 }, acceleration: { milkEc: 0.0, activity: 0.1 }, risk: 12, confidence: 96, shed: 'Shed B', rfid: 'RFID-022-CB', lastSeen: '2 min ago' },
  { id: 'C028', species: 'Buffalo', breed: 'Murrah', age: 8, milkYield: 9.4, milkEc: 4.2, bodyTemperature: 38.7, activity: 7500, envTemperature: 30.7, humidity: 69, thi: 79.0, baseline: { milkYield: 9.5, milkEc: 4.0, bodyTemperature: 38.4, activity: 7700 }, velocity: { milkEc: 0.5, activity: -0.7, bodyTemperature: 0.04 }, acceleration: { milkEc: 0.2, activity: -0.2 }, risk: 39, confidence: 84, shed: 'Shed B', rfid: 'RFID-028-MR', lastSeen: '6 min ago' },
  { id: 'C009', species: 'Cow', breed: 'Holstein Friesian', age: 4, milkYield: 11.3, milkEc: 4.1, bodyTemperature: 38.5, activity: 8050, envTemperature: 29.5, humidity: 63, thi: 75.9, baseline: { milkYield: 11.4, milkEc: 4.0, bodyTemperature: 38.4, activity: 8000 }, velocity: { milkEc: 0.1, activity: 0.1, bodyTemperature: 0.01 }, acceleration: { milkEc: 0.0, activity: 0.0 }, risk: 16, confidence: 95, shed: 'Shed C', rfid: 'RFID-009-HF', lastSeen: '3 min ago' },
  { id: 'C014', species: 'Cow', breed: 'Sahiwal', age: 6, milkYield: 12.0, milkEc: 4.3, bodyTemperature: 38.6, activity: 7800, envTemperature: 30.3, humidity: 67, thi: 77.8, baseline: { milkYield: 12.2, milkEc: 4.1, bodyTemperature: 38.4, activity: 7900 }, velocity: { milkEc: 0.4, activity: -0.3, bodyTemperature: 0.02 }, acceleration: { milkEc: 0.1, activity: -0.1 }, risk: 31, confidence: 89, shed: 'Shed C', rfid: 'RFID-014-SH', lastSeen: '7 min ago' },
  { id: 'C020', species: 'Buffalo', breed: 'Murrah', age: 5, milkYield: 9.8, milkEc: 4.1, bodyTemperature: 38.5, activity: 8000, envTemperature: 29.9, humidity: 65, thi: 76.6, baseline: { milkYield: 9.6, milkEc: 4.0, bodyTemperature: 38.4, activity: 7900 }, velocity: { milkEc: 0.2, activity: 0.2, bodyTemperature: 0.01 }, acceleration: { milkEc: 0.0, activity: 0.0 }, risk: 20, confidence: 93, shed: 'Shed C', rfid: 'RFID-020-MR', lastSeen: '4 min ago' },
  { id: 'C026', species: 'Cow', breed: 'Jersey', age: 3, milkYield: 10.8, milkEc: 4.0, bodyTemperature: 38.3, activity: 8250, envTemperature: 29.4, humidity: 62, thi: 75.2, baseline: { milkYield: 10.6, milkEc: 4.0, bodyTemperature: 38.4, activity: 8100 }, velocity: { milkEc: 0.0, activity: 0.3, bodyTemperature: -0.01 }, acceleration: { milkEc: 0.0, activity: 0.1 }, risk: 9, confidence: 97, shed: 'Shed C', rfid: 'RFID-026-JR', lastSeen: '2 min ago' },
  { id: 'C033', species: 'Cow', breed: 'Crossbred', age: 7, milkYield: 11.5, milkEc: 4.4, bodyTemperature: 38.8, activity: 7350, envTemperature: 31.0, humidity: 70, thi: 80.2, baseline: { milkYield: 11.9, milkEc: 4.1, bodyTemperature: 38.5, activity: 7900 }, velocity: { milkEc: 0.8, activity: -1.1, bodyTemperature: 0.08 }, acceleration: { milkEc: 0.3, activity: -0.3 }, risk: 48, confidence: 83, shed: 'Shed B', rfid: 'RFID-033-CB', lastSeen: '8 min ago' },
  { id: 'C005', species: 'Cow', breed: 'Gir', age: 4, milkYield: 12.8, milkEc: 4.0, bodyTemperature: 38.4, activity: 8600, envTemperature: 28.9, humidity: 59, thi: 73.5, baseline: { milkYield: 12.5, milkEc: 4.0, bodyTemperature: 38.4, activity: 8400 }, velocity: { milkEc: 0.0, activity: 0.2, bodyTemperature: 0.0 }, acceleration: { milkEc: 0.0, activity: 0.0 }, risk: 7, confidence: 98, shed: 'Shed A', rfid: 'RFID-005-GR', lastSeen: '1 min ago' },
  { id: 'C007', species: 'Buffalo', breed: 'Murrah', age: 9, milkYield: 8.8, milkEc: 4.3, bodyTemperature: 38.6, activity: 7650, envTemperature: 30.5, humidity: 68, thi: 78.7, baseline: { milkYield: 9.0, milkEc: 4.0, bodyTemperature: 38.4, activity: 7600 }, velocity: { milkEc: 0.5, activity: -0.2, bodyTemperature: 0.04 }, acceleration: { milkEc: 0.1, activity: -0.1 }, risk: 35, confidence: 87, shed: 'Shed A', rfid: 'RFID-007-MR', lastSeen: '10 min ago' },
  { id: 'C013', species: 'Cow', breed: 'Holstein Friesian', age: 6, milkYield: 13.0, milkEc: 4.2, bodyTemperature: 38.5, activity: 8400, envTemperature: 29.8, humidity: 64, thi: 76.4, baseline: { milkYield: 12.8, milkEc: 4.1, bodyTemperature: 38.4, activity: 8300 }, velocity: { milkEc: 0.2, activity: 0.2, bodyTemperature: 0.02 }, acceleration: { milkEc: 0.0, activity: 0.1 }, risk: 22, confidence: 93, shed: 'Shed B', rfid: 'RFID-013-HF', lastSeen: '5 min ago' },
  { id: 'C016', species: 'Cow', breed: 'Sahiwal', age: 5, milkYield: 11.9, milkEc: 4.1, bodyTemperature: 38.4, activity: 8150, envTemperature: 30.0, humidity: 66, thi: 76.8, baseline: { milkYield: 12.0, milkEc: 4.0, bodyTemperature: 38.4, activity: 8100 }, velocity: { milkEc: 0.1, activity: 0.1, bodyTemperature: 0.0 }, acceleration: { milkEc: 0.0, activity: 0.0 }, risk: 14, confidence: 95, shed: 'Shed C', rfid: 'RFID-016-SH', lastSeen: '3 min ago' },
  { id: 'C029', species: 'Buffalo', breed: 'Murrah', age: 7, milkYield: 9.1, milkEc: 4.1, bodyTemperature: 38.4, activity: 7850, envTemperature: 29.7, humidity: 63, thi: 75.9, baseline: { milkYield: 9.0, milkEc: 4.0, bodyTemperature: 38.4, activity: 7800 }, velocity: { milkEc: 0.1, activity: 0.1, bodyTemperature: 0.0 }, acceleration: { milkEc: 0.0, activity: 0.0 }, risk: 11, confidence: 96, shed: 'Shed C', rfid: 'RFID-029-MR', lastSeen: '6 min ago' },
  { id: 'C035', species: 'Cow', breed: 'Crossbred', age: 4, milkYield: 10.6, milkEc: 4.2, bodyTemperature: 38.5, activity: 7750, envTemperature: 30.2, humidity: 67, thi: 77.5, baseline: { milkYield: 10.9, milkEc: 4.0, bodyTemperature: 38.4, activity: 7900 }, velocity: { milkEc: 0.3, activity: -0.5, bodyTemperature: 0.03 }, acceleration: { milkEc: 0.1, activity: -0.1 }, risk: 27, confidence: 90, shed: 'Shed B', rfid: 'RFID-035-CB', lastSeen: '9 min ago' },
];

export const riskLevel = (risk: number): RiskLevel => risk <= 20 ? 'Low' : risk <= 40 ? 'Mild' : risk <= 60 ? 'Moderate' : risk <= 80 ? 'High' : 'Very High';
export const riskTone = (risk: number) => risk <= 20 ? 'low' : risk <= 40 ? 'mild' : risk <= 60 ? 'moderate' : 'high';
export const selectedAnimal = animals[0];
export const trajectory = [
  { day: '−14d', actual: 12, forecast: null }, { day: '−12d', actual: 15, forecast: null }, { day: '−10d', actual: 19, forecast: null },
  { day: '−8d', actual: 25, forecast: null }, { day: '−6d', actual: 33, forecast: null }, { day: '−4d', actual: 48, forecast: null },
  { day: '−2d', actual: 67, forecast: null }, { day: 'Today', actual: 84, forecast: 84 }, { day: '+7d', actual: null, forecast: 84 }, { day: '+14d', actual: null, forecast: 91 },
];
export const history = Array.from({ length: 14 }, (_, index) => ({ day: `D-${13 - index}`, milk: Number((12.7 - index * 0.15).toFixed(1)), ec: Number((4.0 + index * 0.07).toFixed(2)), activity: Math.round(8350 - index * 130), temperature: Number((38.5 + index * 0.06).toFixed(1)), risk: Math.round(14 + index * 5.4) }));

export function prototypeRisk(values: { milkEc: number; milkYield: number; activity: number; bodyTemperature: number; thi?: number }, baseline = selectedAnimal.baseline) {
  const ec = Math.max(0, (values.milkEc - baseline.milkEc) / 1.0);
  const yieldDrop = Math.max(0, (baseline.milkYield - values.milkYield) / baseline.milkYield);
  const activityDrop = Math.max(0, (baseline.activity - values.activity) / baseline.activity);
  const temperature = Math.max(0, (values.bodyTemperature - baseline.bodyTemperature) / 1.2);
  const thi = Math.max(0, ((values.thi ?? 76) - 76) / 12);
  const base = ec * 30 + yieldDrop * 25 + activityDrop * 20 + temperature * 15 + thi * 10;
  const abnormal = [ec > 0.25, yieldDrop > 0.06, activityDrop > 0.08, temperature > 0.2].filter(Boolean).length;
  return Math.round(Math.min(100, Math.max(0, base + abnormal * 4 + (abnormal >= 3 ? 7 : 0))));
}
