import { Link, useRouterState } from '@tanstack/react-router';
import { Bell, ChevronDown, Cloud, Cpu, LayoutDashboard, Map, Menu, Radio, Settings, ShieldAlert, Sparkles, Stethoscope, Wifi, WifiOff, X, Activity, BookOpen } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/herd', label: 'Herd Monitoring', icon: Stethoscope },
  { to: '/animal/C024', label: 'Animal Analysis', icon: Activity },
  { to: '/forecast', label: 'Risk Forecast', icon: Sparkles },
  { to: '/risk-map', label: 'Risk Map', icon: Map },
  { to: '/alerts', label: 'Alerts', icon: ShieldAlert },
  { to: '/sensors', label: 'Sensor Health', icon: Radio },
  { to: '/integration', label: 'Device Integration', icon: Cpu },
  { to: '/settings', label: 'Settings', icon: Settings },
] as const;

export function riskClass(risk: number) {
  if (risk <= 20) return 'risk-low';
  if (risk <= 40) return 'risk-mild';
  if (risk <= 60) return 'risk-moderate';
  return 'risk-high';
}

export function MastiPredictShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const [open, setOpen] = useState(false);
  const [offline, setOffline] = useState(() => typeof window !== 'undefined' && localStorage.getItem('mastipredict-offline') === 'true');
  const [language, setLanguage] = useState('English');
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => setTime(new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()));
    update();
    const timer = window.setInterval(update, 30000);
    return () => window.clearInterval(timer);
  }, []);

  const toggleOffline = () => {
    const next = !offline;
    setOffline(next);
    localStorage.setItem('mastipredict-offline', String(next));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className={cn('fixed inset-y-0 left-0 z-40 flex w-[258px] flex-col border-r border-border bg-sidebar transition-transform duration-200 lg:translate-x-0', open ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex h-[82px] items-center justify-between border-b border-sidebar-border px-6">
          <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-xl shadow-sm">🐄</span>
            <span><strong className="block text-lg tracking-tight text-sidebar-foreground">MastiPredict</strong><span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/55">Early warning system</span></span>
          </Link>
          <Button variant="ghost" size="icon" className="text-sidebar-foreground lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation"><X /></Button>
        </div>
        <div className="px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-sidebar-foreground/45">Operations</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = item.to === '/' ? path === '/' : path.startsWith(item.to);
              return <Link key={item.to} to={item.to} onClick={() => setOpen(false)} className={cn('group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-sidebar-foreground/65 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground', active && 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm')}><Icon className="size-[17px]" />{item.label}{item.label === 'Alerts' && <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">3</span>}</Link>;
            })}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/60 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-sidebar-foreground"><BookOpen className="size-4 text-sidebar-primary" /> System status</div>
            <div className="flex items-center justify-between text-xs text-sidebar-foreground/60"><span>Cloud sync</span><span className="flex items-center gap-1.5 text-emerald-600"><span className="size-1.5 rounded-full bg-emerald-500" />Ready</span></div>
            <div className="mt-2 flex items-center justify-between text-xs text-sidebar-foreground/60"><span>Prototype build</span><span className="rounded bg-sidebar-border px-1.5 py-0.5 text-[10px] font-semibold">v0.1</span></div>
          </div>
          <p className="mt-4 px-1 text-[10px] leading-relaxed text-sidebar-foreground/40">Synthetic data only. Not a clinical or veterinary diagnosis.</p>
        </div>
      </aside>
      {open && <button className="fixed inset-0 z-30 bg-foreground/20 lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation overlay" />}
      <div className="lg:pl-[258px]">
        <header className="sticky top-0 z-20 flex h-[82px] items-center justify-between border-b border-border bg-background/95 px-5 backdrop-blur md:px-8">
          <div className="flex items-center gap-3"><Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu /></Button><div><p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Kaveri Dairy Cooperative</p><p className="text-sm font-medium text-foreground">Mysuru, Karnataka <span className="mx-1 text-border">•</span> {time || '--:--'} IST</p></div></div>
          <div className="flex items-center gap-2 md:gap-4"><button onClick={toggleOffline} className="hidden items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent sm:flex" title="Toggle offline mode">{offline ? <WifiOff className="size-3.5 text-amber-500" /> : <Wifi className="size-3.5 text-emerald-500" />}{offline ? 'Offline mode' : 'Online'}</button><div className="hidden items-center gap-1 rounded-md border border-border px-1.5 py-1 md:flex"><span className="px-2 text-xs font-semibold text-foreground">{language}</span><select aria-label="Language" className="w-4 cursor-pointer appearance-none bg-transparent text-muted-foreground" value={language} onChange={(event) => setLanguage(event.target.value)}><option>English</option><option>हिन्दी</option><option>தமிழ்</option></select><ChevronDown className="pointer-events-none -ml-1 size-3 text-muted-foreground" /></div><Button variant="ghost" size="icon" className="relative" aria-label="Notifications"><Bell /><span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-destructive" /></Button><div className="hidden items-center gap-2 border-l border-border pl-4 sm:flex"><div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">KD</div><span className="text-xs font-medium text-foreground">Farm Admin</span></div></div>
        </header>
        <main className="mx-auto max-w-[1500px] p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p><h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p></div>{action}</div>;
}

export function RiskBadge({ risk, compact = false }: { risk: number; compact?: boolean }) {
  const label = risk <= 20 ? 'Low' : risk <= 40 ? 'Mild' : risk <= 60 ? 'Moderate' : risk <= 80 ? 'High' : 'Very High';
  return <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold', riskClass(risk), compact && 'px-2 py-0.5 text-[10px]')}><span className="size-1.5 rounded-full bg-current" />{label} · {risk}%</span>;
}
