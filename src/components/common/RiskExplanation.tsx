import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Languages, Loader2, Sparkles, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { explainRisk, type RiskExplanation as Explanation } from "@/lib/explain.functions";
import { useStore } from "@/lib/store";
import type { Animal, RiskAssessment } from "@/types";

const TABS = [
  { code: "en", label: "English", reason: "en", action: "action_en" },
  { code: "hi", label: "हिन्दी", reason: "hi", action: "action_hi" },
  { code: "ta", label: "தமிழ்", reason: "ta", action: "action_ta" },
] as const;

const ACTION_LABEL: Record<string, string> = {
  en: "Do this first",
  hi: "पहले यह करें",
  ta: "முதலில் இதைச் செய்யுங்கள்",
};

export function RiskExplanation({
  animal,
  risk,
}: {
  animal: Animal;
  risk: RiskAssessment;
}) {
  const { language } = useStore();
  const generate = useServerFn(explainRisk);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [error, setError] = useState<string>("");

  async function run() {
    setState("loading");
    setError("");
    try {
      const result = await generate({
        data: {
          animalCode: animal.code,
          breed: animal.breed,
          level: risk.level,
          currentRisk: risk.currentRisk,
          sevenDayRisk: risk.sevenDayRisk,
          trend: risk.trend,
          confidence: risk.confidence,
          signals: risk.signals.map((s) => ({
            label: s.label,
            current: s.current,
            baseline: s.baseline,
            deviationPct: s.deviationPct,
            abnormal: s.abnormal,
          })),
        },
      });
      setExplanation(result);
      setState("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setState("error");
    }
  }

  return (
    <section className="card-surface mt-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Sparkles className="size-5 text-primary" aria-hidden /> Explain this score to the farmer
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Turns the sensor readings for {animal.code} into a plain-language reason and one clear
            next step, in English, Hindi and Tamil.
          </p>
        </div>
        <Button onClick={run} disabled={state === "loading"}>
          {state === "loading" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden /> Writing…
            </>
          ) : (
            <>
              <Languages className="size-4" aria-hidden />
              {explanation ? "Write again" : "Generate explanation"}
            </>
          )}
        </Button>
      </div>

      {state === "error" && (
        <p className="mt-5 flex items-start gap-2 rounded-xl bg-risk-high-soft p-4 text-sm text-risk-high">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}

      {state === "loading" && !explanation && (
        <div className="mt-5 space-y-3" aria-hidden>
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-11/12 animate-pulse rounded bg-muted" />
          <div className="h-4 w-8/12 animate-pulse rounded bg-muted" />
        </div>
      )}

      {explanation && (
        <Tabs defaultValue={language} className="mt-5">
          <TabsList>
            {TABS.map((tab) => (
              <TabsTrigger key={tab.code} value={tab.code}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {TABS.map((tab) => (
            <TabsContent key={tab.code} value={tab.code} className="mt-4">
              <p className="text-base leading-relaxed">{explanation[tab.reason]}</p>
              {explanation[tab.action] && (
                <div className="mt-4 rounded-xl border-l-4 border-l-primary bg-brand-soft p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-deep">
                    {ACTION_LABEL[tab.code]}
                  </p>
                  <p className="mt-1 text-sm font-medium text-brand-deep">
                    {explanation[tab.action]}
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}

      <p className="mt-5 text-xs text-muted-foreground">
        AI-written guidance based on prototype sensor data. It supports the farmer's judgement and
        does not replace veterinary diagnosis.
      </p>
    </section>
  );
}
