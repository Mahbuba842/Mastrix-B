import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SignalInput = z.object({
  label: z.string(),
  current: z.number(),
  baseline: z.number(),
  deviationPct: z.number(),
  abnormal: z.boolean(),
});

const ExplainInput = z.object({
  animalCode: z.string().min(1),
  breed: z.string().default(""),
  level: z.string(),
  currentRisk: z.number(),
  sevenDayRisk: z.number(),
  trend: z.string(),
  confidence: z.number(),
  signals: z.array(SignalInput).max(12),
});

export interface RiskExplanation {
  en: string;
  hi: string;
  ta: string;
  action_en: string;
  action_hi: string;
  action_ta: string;
}

const SYSTEM = `You explain dairy-cattle mastitis risk scores to small Indian dairy farmers.
Write simply, warmly and concretely, as if speaking to someone with no technical training.
Never use words like algorithm, model, deviation, velocity or baseline-percentile.
Say things like "her milk is carrying more salt than usual" instead of "conductivity deviation".
Each explanation is 2-3 short sentences. The action line is one short sentence.
Hindi must be natural Devanagari Hindi; Tamil must be natural Tamil script. Do not transliterate English.
Reply with ONLY a JSON object, no markdown fences.`;

export const explainRisk = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ExplainInput.parse(input))
  .handler(async ({ data }): Promise<RiskExplanation> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured for this project yet.");

    const signalLines = data.signals
      .map(
        (s) =>
          `- ${s.label}: now ${s.current.toFixed(1)}, her usual ${s.baseline.toFixed(1)} (${
            s.deviationPct > 0 ? "+" : ""
          }${s.deviationPct.toFixed(1)}%)${s.abnormal ? " — outside her normal range" : " — normal"}`,
      )
      .join("\n");

    const prompt = `Animal ${data.animalCode}${data.breed ? ` (${data.breed})` : ""}
Risk score: ${data.currentRisk}/100 (${data.level}), 7-day outlook ${data.sevenDayRisk}/100
Trend: ${data.trend}. Confidence in the sensor data: ${data.confidence}%.

Signals compared with this animal's own usual values:
${signalLines}

Explain to the farmer why this animal has this risk score, and what to do next.
Return JSON with exactly these keys:
{"en":"...","hi":"...","ta":"...","action_en":"...","action_hi":"...","action_ta":"..."}
where en/hi/ta are the reason and action_* is the single most important next step.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "google/gemini-3.8-flash",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      if (res.status === 402)
        throw new Error(
          "The AI credits for this workspace are used up. Add credits to generate explanations.",
        );
      if (res.status === 429)
        throw new Error("Too many requests right now. Please try again in a few seconds.");
      if (res.status === 403)
        throw new Error("AI is currently blocked for this workspace by its settings.");
      throw new Error(`AI request failed (${res.status}). ${detail.slice(0, 200)}`);
    }

    const payload = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = payload.choices?.[0]?.message?.content ?? "";
    const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(cleaned) as Record<string, unknown>;
    } catch {
      throw new Error("The AI reply could not be read. Please try again.");
    }

    const str = (key: string) => (typeof parsed[key] === "string" ? (parsed[key] as string) : "");
    const out: RiskExplanation = {
      en: str("en"),
      hi: str("hi"),
      ta: str("ta"),
      action_en: str("action_en"),
      action_hi: str("action_hi"),
      action_ta: str("action_ta"),
    };
    if (!out.en && !out.hi && !out.ta)
      throw new Error("The AI reply was empty. Please try again.");
    return out;
  });
