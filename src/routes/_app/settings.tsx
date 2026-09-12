import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, RefreshCcw, Save, Settings2, Tag, Tractor } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Mastrix B" },
      { name: "description", content: "Farm, device and alert settings for Mastrix B." },
      { property: "og:title", content: "Settings — Mastrix B" },
      { property: "og:description", content: "Farm, device and alert settings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Settings,
});

function Settings() {
  const { settings, updateSettings, clearReadings, readings, pendingSync, syncNow, t } = useStore();
  const [draft, setDraft] = useState(settings);
  const changed = JSON.stringify(draft) !== JSON.stringify(settings);

  return (
    <div>
      <PageHeader
        title={t("settings")}
        description="Configure farm identity, device IDs, refresh rate and thresholds."
        actions={
          <Button
            size="sm"
            disabled={!changed}
            onClick={() => {
              updateSettings(draft);
            }}
          >
            <Save className="mr-1 size-4" aria-hidden /> Save changes
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card-surface p-5">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Tractor className="size-5 text-primary" aria-hidden /> Farm identity
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="farmName">Farm name</Label>
              <Input
                id="farmName"
                value={draft.farmName}
                onChange={(e) => setDraft((d) => ({ ...d, farmName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deviceId">Default device ID</Label>
              <Input
                id="deviceId"
                value={draft.deviceId}
                onChange={(e) => setDraft((d) => ({ ...d, deviceId: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">Used on reading labels and hardware page.</p>
            </div>
          </div>
        </section>

        <section className="card-surface p-5">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <RefreshCcw className="size-5 text-primary" aria-hidden /> Data & thresholds
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="refreshIntervalSec">Refresh interval (seconds)</Label>
              <Input
                id="refreshIntervalSec"
                type="number"
                min={2}
                max={300}
                value={draft.refreshIntervalSec}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, refreshIntervalSec: Number(e.target.value) || 5 }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="moderateRiskThreshold">Moderate threshold</Label>
                <Input
                  id="moderateRiskThreshold"
                  type="number"
                  min={0}
                  max={100}
                  value={draft.moderateRiskThreshold}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, moderateRiskThreshold: Number(e.target.value) || 41 }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="highRiskThreshold">High threshold</Label>
                <Input
                  id="highRiskThreshold"
                  type="number"
                  min={0}
                  max={100}
                  value={draft.highRiskThreshold}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, highRiskThreshold: Number(e.target.value) || 61 }))
                  }
                />
              </div>
            </div>
          </div>
        </section>

        <section className="card-surface p-5">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Bell className="size-5 text-primary" aria-hidden /> Notifications
          </h2>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Enable alerts</Label>
              <p className="text-xs text-muted-foreground">Show new alert badges and toast summaries.</p>
            </div>
            <Switch
              id="notifications"
              checked={draft.notifications}
              onCheckedChange={(v) => setDraft((d) => ({ ...d, notifications: v }))}
            />
          </div>
        </section>

        <section className="card-surface p-5">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Tag className="size-5 text-primary" aria-hidden /> Data management
          </h2>
          <p className="text-sm text-muted-foreground">
            {readings.length} readings stored in this session. {pendingSync} pending offline readings
            waiting to sync.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={clearReadings}>
              Clear local readings
            </Button>
            {pendingSync > 0 && (
              <Button size="sm" variant="outline" onClick={syncNow}>
                Sync {pendingSync} offline readings
              </Button>
            )}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-border bg-muted p-4 text-xs leading-relaxed text-muted-foreground">
        <strong className="text-foreground">Prototype notice:</strong> Settings are saved in this
        browser's localStorage only. A production deployment would persist these to a secure cloud
        backend per farm account.
      </section>
    </div>
  );
}
