import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bell,
  CircuitBoard,
  Cpu,
  Database,
  Gauge,
  Languages,
  LayoutDashboard,
  LineChart,
  Map,
  Menu,
  Play,
  Settings as SettingsIcon,
  Square,
  Users,
  WifiOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useStore, DEMO_STAGES } from "@/lib/store";
import { LANGUAGES, type Language } from "@/lib/i18n";
import type { DataMode } from "@/types";

const NAV = [
  { to: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
  { to: "/herd", labelKey: "herdMonitoring", icon: Users },
  { to: "/forecast", labelKey: "riskForecast", icon: LineChart },
  { to: "/risk-map", labelKey: "riskMap", icon: Map },
  { to: "/alerts", labelKey: "alerts", icon: AlertTriangle },
  { to: "/sensors", labelKey: "sensorHealth", icon: Activity },
  { to: "/hardware", labelKey: "hardware", icon: Cpu },
  { to: "/firmware", labelKey: "firmware", icon: CircuitBoard },
  { to: "/history", labelKey: "dataHistory", icon: Database },
  { to: "/settings", labelKey: "settings", icon: SettingsIcon },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const { t, heroAnimal } = useStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1 p-3" aria-label="Main">
      {NAV.map((item) => {
        const active = pathname === item.to;
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {t(item.labelKey)}
          </Link>
        );
      })}
      <Link
        to="/animal/$animalId"
        params={{ animalId: heroAnimal.code }}
        onClick={onNavigate}
        className={cn(
          "mt-2 flex items-center gap-3 rounded-lg border border-sidebar-border px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        )}
      >
        <Gauge className="size-4 shrink-0" aria-hidden />
        {t("animalAnalysis")} · {heroAnimal.code}
      </Link>
    </nav>
  );
}

function SidebarBrand() {
  return (
    <Link to="/" className="flex items-center gap-3 border-b border-sidebar-border px-5 py-4">
      <span className="grid size-9 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold">
        M
      </span>
      <span className="leading-tight">
        <span className="block text-base font-bold text-sidebar-foreground">Mastrix B</span>
        <span className="block text-[11px] text-sidebar-foreground/60">
          Healthier Cows, Stronger Farms
        </span>
      </span>
    </Link>
  );
}

function ConnectionStatus() {
  const { dataMode, lastUpdateSeconds } = useStore();
  const delayed = lastUpdateSeconds > 20;
  const label =
    dataMode === "live"
      ? delayed
        ? "Reconnecting"
        : "Cloud Connected"
      : dataMode === "offline"
        ? "Offline — local data"
        : "Simulation Engine";
  const dot =
    dataMode === "offline" ? "bg-risk-critical" : delayed ? "bg-risk-moderate" : "bg-risk-low";
  return (
    <span className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium md:inline-flex">
      <span className={cn("size-2 rounded-full", dot)} aria-hidden />
      {label}
    </span>
  );
}

function LiveIndicator() {
  const { lastUpdateSeconds, dataMode } = useStore();
  const delayed = lastUpdateSeconds > 20;
  if (delayed) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-risk-moderate">
        <AlertTriangle className="size-3.5" aria-hidden /> SENSOR DATA DELAYED
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
      <span className="size-2 animate-pulse rounded-full bg-risk-low" aria-hidden />
      {dataMode === "offline" ? "LOCAL" : "LIVE"} · last update {lastUpdateSeconds}s ago
    </span>
  );
}

function Clock() {
  const [now, setNow] = useState<string>("");
  useEffect(() => {
    const update = () => setNow(new Date().toLocaleString());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="hidden text-xs text-muted-foreground lg:inline">{now}</span>;
}

function DemoBanner() {
  const { demoStage, stopDemo } = useStore();
  if (demoStage === null) return null;
  const stage = DEMO_STAGES[demoStage];
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-border bg-brand-soft px-4 py-3 md:px-6">
      <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
        DEMO {demoStage + 1}/{DEMO_STAGES.length}
      </span>
      <span className="text-sm font-semibold text-foreground">{stage?.title}</span>
      <span className="text-sm text-muted-foreground">{stage?.detail}</span>
      <Button size="sm" variant="outline" className="ml-auto" onClick={stopDemo}>
        <Square className="size-3.5" /> Stop Demo
      </Button>
    </div>
  );
}

export function AppShell() {
  const { settings, dataMode, setDataMode, language, setLanguage, alerts, demoStage, startDemo, t } =
    useStore();
  const [open, setOpen] = useState(false);
  const newAlerts = alerts.filter((a) => a.status === "new").length;

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sidebar lg:flex">
        <SidebarBrand />
        <div className="flex-1 overflow-y-auto">
          <NavLinks />
        </div>
        <div className="border-t border-sidebar-border p-4">
          <span className="block rounded-md bg-risk-critical-soft px-2 py-1 text-center text-[10px] font-bold tracking-wide text-risk-critical">
            HACKATHON PROTOTYPE
          </span>
          <p className="mt-2 text-[10px] leading-relaxed text-sidebar-foreground/60">
            Early-warning risk assessment only. Does not replace veterinary diagnosis.
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur md:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-sidebar p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarBrand />
              <NavLinks onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{settings.farmName}</p>
            <LiveIndicator />
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Clock />
            <ConnectionStatus />
            <Select value={dataMode} onValueChange={(v) => setDataMode(v as DataMode)}>
              <SelectTrigger className="h-9 w-[150px]" aria-label="Data mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="live">{t("liveSensor")}</SelectItem>
                <SelectItem value="simulation">{t("simulation")}</SelectItem>
                <SelectItem value="offline">{t("offlineMode")}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
              <SelectTrigger className="h-9 w-[92px]" aria-label="Language">
                <Languages className="size-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l.code} value={l.code}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Link to="/alerts" aria-label={`${newAlerts} new alerts`}>
              <Button variant="outline" size="icon" className="relative h-9 w-9">
                <Bell className="size-4" />
                {newAlerts > 0 && (
                  <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-risk-critical text-[10px] font-bold text-primary-foreground">
                    {newAlerts}
                  </span>
                )}
              </Button>
            </Link>
            {demoStage === null && (
              <Button size="sm" onClick={startDemo}>
                <Play className="size-4" /> {t("startDemo")}
              </Button>
            )}
          </div>
        </header>

        {dataMode === "offline" && (
          <div className="flex items-center gap-2 bg-risk-moderate-soft px-4 py-2 text-xs font-medium text-risk-moderate md:px-6">
            <WifiOff className="size-3.5" aria-hidden /> Offline mode active — data stored locally
            on this device.
          </div>
        )}

        <DemoBanner />

        <main className="min-w-0 flex-1 px-4 py-6 md:px-6 lg:px-8">
          <Outlet />
        </main>

        <footer className="border-t border-border bg-card px-4 py-4 text-xs text-muted-foreground md:px-6">
          Mastrix B provides an early-warning risk assessment and does not replace veterinary
          diagnosis. Sensor values shown in Demo Mode are simulated.
        </footer>
      </div>
    </div>
  );
}
