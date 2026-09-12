import type { RiskAssessment, RiskLevel } from "@/types";

export interface Recommendation {
  immediate: string[];
  preventive: string[];
  veterinary: string[];
  urgency: string;
}

export function recommendationsFor(level: RiskLevel, a: RiskAssessment): Recommendation {
  const ecUp = a.signals.find((s) => s.key === "milkEc")?.abnormal;
  const yieldDown = a.signals.find((s) => s.key === "milkYield")?.abnormal;
  const tempUp = a.signals.find((s) => s.key === "bodyTemperature")?.abnormal;
  const thiUp = a.signals.find((s) => s.key === "thi")?.abnormal;

  if (level === "Very High" || level === "High") {
    return {
      urgency: "Act today",
      immediate: [
        "Isolate the animal from the milking line to protect the bulk tank",
        "Perform a manual udder check and strip cup / California Mastitis Test",
        ecUp ? "Re-test milk conductivity quarter by quarter" : "Record milk appearance for each quarter",
        tempUp ? "Recheck body temperature after 4 hours" : "Log body temperature twice today",
      ],
      preventive: [
        "Disinfect milking cluster before and after this animal",
        "Improve bedding hygiene and dry the stall",
        "Review pre- and post-milking teat dipping routine",
      ],
      veterinary: [
        "Contact your veterinarian within 24 hours",
        "Request a milk culture / sensitivity test before any treatment",
        "Do not start antibiotics without veterinary advice",
      ],
    };
  }

  if (level === "Moderate") {
    return {
      urgency: "Monitor closely for 48 hours",
      immediate: [
        "Milk this animal last in the order",
        yieldDown ? "Record yield at every milking for 3 days" : "Watch for any yield drop",
        "Check udder for warmth, swelling or hardness",
      ],
      preventive: [
        "Tighten teat disinfection routine",
        "Check milking machine vacuum and liner condition",
        thiUp ? "Reduce heat stress — shade, fans and clean drinking water" : "Keep bedding dry and clean",
      ],
      veterinary: ["Inform your veterinarian if risk stays elevated for 3 days"],
    };
  }

  return {
    urgency: "Routine monitoring",
    immediate: ["Continue normal milking routine", "Keep daily observation notes"],
    preventive: [
      "Maintain teat dipping and clean bedding",
      "Service milking equipment on schedule",
      thiUp ? "Watch environmental heat load this week" : "Keep water and feed intake steady",
    ],
    veterinary: ["No veterinary action needed at this time"],
  };
}
