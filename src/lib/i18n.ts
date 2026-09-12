export type Language = "en" | "hi" | "ta";

export const LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "hi", label: "हिन्दी" },
  { code: "ta", label: "தமிழ்" },
];

const DICT = {
  dashboard: { en: "Dashboard", hi: "डैशबोर्ड", ta: "டாஷ்போர்டு" },
  herdMonitoring: { en: "Herd Monitoring", hi: "झुंड निगरानी", ta: "மந்தை கண்காணிப்பு" },
  animalAnalysis: { en: "Animal Analysis", hi: "पशु विश्लेषण", ta: "விலங்கு பகுப்பாய்வு" },
  animal: { en: "Animal", hi: "पशु", ta: "விலங்கு" },
  risk: { en: "Risk", hi: "जोखिम", ta: "அபாயம்" },
  riskForecast: { en: "Risk Forecast", hi: "जोखिम पूर्वानुमान", ta: "அபாய முன்னறிவிப்பு" },
  riskMap: { en: "Risk Map", hi: "जोखिम मानचित्र", ta: "அபாய வரைபடம்" },
  highRisk: { en: "High Risk", hi: "उच्च जोखिम", ta: "அதிக அபாயம்" },
  moderateRisk: { en: "Moderate Risk", hi: "मध्यम जोखिम", ta: "மிதமான அபாயம்" },
  lowRisk: { en: "Low Risk", hi: "कम जोखिम", ta: "குறைந்த அபாயம்" },
  recommendedAction: { en: "Recommended Action", hi: "अनुशंसित कार्रवाई", ta: "பரிந்துரைக்கப்பட்ட நடவடிக்கை" },
  alerts: { en: "Alerts", hi: "अलर्ट", ta: "எச்சரிக்கைகள்" },
  sensorHealth: { en: "Sensor Health", hi: "सेंसर स्थिति", ta: "சென்சார் நிலை" },
  hardware: { en: "Hardware", hi: "हार्डवेयर", ta: "வன்பொருள்" },
  firmware: { en: "ESP32 Firmware", hi: "ESP32 फर्मवेयर", ta: "ESP32 ஃபார்ம்வேர்" },
  dataHistory: { en: "Data History", hi: "डेटा इतिहास", ta: "தரவு வரலாறு" },
  settings: { en: "Settings", hi: "सेटिंग्स", ta: "அமைப்புகள்" },
  liveSensor: { en: "Live Sensor", hi: "लाइव सेंसर", ta: "நேரடி சென்சார்" },
  simulation: { en: "Simulation", hi: "सिमुलेशन", ta: "உருவகப்படுத்தல்" },
  offlineMode: { en: "Offline Mode", hi: "ऑफ़लाइन मोड", ta: "ஆஃப்லைன் முறை" },
  totalAnimals: { en: "Animals Monitored", hi: "निगरानी में पशु", ta: "கண்காணிக்கப்படும் விலங்குகள்" },
  herdRisk: { en: "Herd Risk", hi: "झुंड जोखिम", ta: "மந்தை அபாயம்" },
  startDemo: { en: "Start Demo", hi: "डेमो शुरू करें", ta: "டெமோ தொடங்கு" },
  stopDemo: { en: "Stop Demo", hi: "डेमो रोकें", ta: "டெமோவை நிறுத்து" },
} as const;

export type TranslationKey = keyof typeof DICT;

export function translate(key: TranslationKey, lang: Language): string {
  return DICT[key][lang] ?? DICT[key].en;
}
