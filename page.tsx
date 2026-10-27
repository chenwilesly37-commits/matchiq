"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, CalendarDays, Search, RefreshCw, BarChart3, ChevronDown, CircleDot, ShieldCheck, Target, Flag, CreditCard, Footprints, Crosshair, Clock3, AlertTriangle } from "lucide-react";

type Pick = { label: string; probability: number; side: string };
type MarketGroup = { id: string; title: string; note: string; picks: Pick[] };
type Fixture = {
  id: string; league: string; country: string; kickoff: string; status: "scheduled" | "live" | "finished";
  homeTeam: string; awayTeam: string; homeGoals: number | null; awayGoals: number | null;
  homeExpectedGoals: number; awayExpectedGoals: number;
  probabilities?: { over15: number; over25: number; over35: number; under25: number; under35: number; expectedTotalGoals: number };
  markets?: MarketGroup[]; dataSource?: string;
};
const categories = [
  { id: "all", label: "All markets", icon: BarChart3 }, { id: "goals", label: "Goals & results", icon: CircleDot },
  { id: "corners", label: "Corners", icon: Flag }, { id: "cards", label: "Cards", icon: CreditCard },
  { id: "fouls", label: "Fouls", icon: Footprints }, { id: "offsides", label: "Offsides", icon: AlertTriangle },
  { id: "shots", label: "Shots / SOT", icon: Crosshair }, { id: "halves", label: "Score by half", icon: Clock3 },
];
const todayISO = () => {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Douala", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  return parts;
};
const addDays = (date: string, amount: number) => { const d = new Date(`${date}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + amount); return d.toISOString().slice(0, 10); };
const pct = (p: number) => `${Math.round(p * 100)}%`;
const formatKickoff = (value: string) => new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Douala", hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" }).format(new Date(value));

export default function HomePage() {
  const [date, setDate] = useState(todayISO());
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [league, setLeague] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [source, setSource] = useState("demo");

  async function load() {
    setLoading(true); setError("");
    try {
      const response = await fetch(`/api/predictions?date=${date}`, { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Could not load fixtures");
      setFixtures(payload.predictions ?? []); setSource(payload.source ?? "demo");
    } catch (e) { setError(e instanceof Error ? e.message : "Could not load fixtures"); setFixtures([]); }
    finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, [date]);

  const leagues = useMemo(() => ["all", ...Array.from(new Set(fixtures.map(f => f.league))).sort()], [fixtures]);
  const visible = useMemo(() => fixtures.filter(f => (league === "all" || f.league === league) && `${f.homeTeam} ${f.awayTeam} ${f.league} ${f.country}`.toLowerCase().includes(query.toLowerCase())), [fixtures, league, query]);
  const groupFor = (f: Fixture) => (f.markets ?? []).filter(g => category === "all" || g.id === category);

  return <main className="min-h-screen bg-[#070d16] text-slate-100">
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0b1421]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-300 text-slate-950"><CircleDot size={23}/></span><span><b className="block text-lg font-black tracking-wide">MATCHIQ</b><span className="block text-[10px] tracking-[.2em] text-slate-400">FOOTBALL INTELLIGENCE</span></span></a>
        <nav className="flex items-center gap-4 text-sm"><a href="/performance" className="text-slate-300 hover:text-emerald-300">Performance</a><span className={`rounded-full border px-3 py-1 text-xs ${source === "api-football" ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-200" : "border-amber-300/30 bg-amber-300/10 text-amber-200"}`}>{source === "api-football" ? "Live fixtures" : "Demo mode"}</span></nav>
      </div>
    </header>

    <section className="mx-auto max-w-7xl px-4 pb-12 pt-7 sm:px-6 lg:px-8">
      <div className="grid gap-5 lg:grid-cols-[1.4fr_.6fr]">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#12332e] via-[#101f2c] to-[#101724] p-6 sm:p-8">
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold tracking-[.16em] text-emerald-300"><Activity size={16}/> FOOTBALL DATA & PREDICTIONS</div>
          <h1 className="max-w-2xl text-3xl font-black leading-tight sm:text-5xl">See beyond the score.<br/><span className="text-emerald-300">Analyze every market.</span></h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">Explore fixtures, goals, corners, cards, fouls, offsides, shots on target, and half-by-half score estimates from one match centre.</p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-300"><span className="flex items-center gap-2 rounded-lg bg-black/20 px-3 py-2"><CalendarDays size={15}/> Fixtures</span><span className="flex items-center gap-2 rounded-lg bg-black/20 px-3 py-2"><BarChart3 size={15}/> Multi-market model</span><span className="flex items-center gap-2 rounded-lg bg-black/20 px-3 py-2"><ShieldCheck size={15}/> Trackable estimates</span></div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-[#101a29] p-5 sm:p-6">
          <p className="text-sm text-slate-400">Match centre overview</p><div className="mt-4 grid grid-cols-2 gap-3"><Stat label="Fixtures" value={loading ? "…" : String(fixtures.length)}/><Stat label="Markets" value="30+"/><Stat label="Categories" value="8"/><Stat label="Timezone" value="WAT · UTC+1"/></div>
          <div className="mt-4 rounded-xl border border-white/5 bg-black/15 p-3 text-xs leading-5 text-slate-400">{source === "api-football" ? "Fixtures are provided by API-Football. Market availability depends on competition coverage." : "Demo mode is active. Sample fixtures and non-goal estimates are illustrative until API credentials and historical statistics are configured."}</div>
        </div>
      </div>

      <div className="mt-9 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-semibold tracking-[.18em] text-emerald-300">MATCH CENTRE</p><h2 className="mt-1 text-2xl font-bold">Fixtures & market analysis</h2></div><button onClick={() => void load()} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"><RefreshCw size={15}/> Refresh</button></div>
      <div className="mt-5 grid gap-3 md:grid-cols-[1fr_190px_190px]">
        <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#101a29] px-3"><Search size={17} className="text-slate-400"/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search team or league…" className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-slate-500"/></label>
        <select value={date} onChange={e => setDate(e.target.value)} className="rounded-xl border border-white/10 bg-[#101a29] px-3 py-3 text-sm outline-none"><option value={todayISO()}>Today</option><option value={addDays(todayISO(), 1)}>Tomorrow</option><option value={addDays(todayISO(), 2)}>{new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Douala", weekday: "short", day: "numeric", month: "short" }).format(new Date(`${addDays(todayISO(), 2)}T12:00:00Z`))}</option><option value={addDays(todayISO(), 3)}>{addDays(todayISO(), 3)}</option></select>
        <select value={league} onChange={e => setLeague(e.target.value)} className="rounded-xl border border-white/10 bg-[#101a29] px-3 py-3 text-sm outline-none"><option value="all">All competitions</option>{leagues.filter(l => l !== "all").map(l => <option key={l} value={l}>{l}</option>)}</select>
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">{categories.map(item => { const Icon = item.icon; return <button key={item.id} onClick={() => setCategory(item.id)} className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition ${category === item.id ? "border-emerald-300/40 bg-emerald-300 text-slate-950" : "border-white/10 bg-[#101a29] text-slate-300 hover:bg-white/10"}`}><Icon size={15}/>{item.label}</button>; })}</div>

      {error && <div className="mt-5 rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200">{error}. Check the API key and provider settings, or switch to demo mode.</div>}
      {loading ? <div className="mt-6 rounded-2xl border border-white/10 bg-[#101a29] p-12 text-center text-slate-400"><RefreshCw className="mx-auto mb-3 animate-spin"/>Loading fixtures and estimates…</div> : visible.length ? <div className="mt-5 grid gap-4 xl:grid-cols-2">{visible.map(fixture => {
        const groups = groupFor(fixture); const isExpanded = expanded === fixture.id;
        return <article key={fixture.id} className="overflow-hidden rounded-2xl border border-white/10 bg-[#101a29] shadow-lg shadow-black/10">
          <div className="p-4 sm:p-5"><div className="mb-4 flex items-center justify-between gap-3 text-xs text-slate-400"><span className="truncate">{fixture.country ? `${fixture.country} · ` : ""}{fixture.league}</span><span className={`shrink-0 ${fixture.status === "live" ? "font-bold text-rose-300" : ""}`}>{fixture.status === "live" ? "LIVE" : fixture.status === "finished" ? "FT" : formatKickoff(fixture.kickoff)}</span></div>
          <div className="grid grid-cols-[1fr_auto] items-center gap-3"><div className="space-y-3"><p className="font-semibold">{fixture.homeTeam}</p><p className="font-semibold">{fixture.awayTeam}</p></div><div className="text-right text-xl font-bold tabular-nums"><p>{fixture.homeGoals ?? "–"}</p><p>{fixture.awayGoals ?? "–"}</p></div></div>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-3"><Metric label="Over 1.5 goals" value={pct(fixture.probabilities?.over15 ?? 0)}/><Metric label="Over 2.5 goals" value={pct(fixture.probabilities?.over25 ?? 0)} highlight/><Metric label="Under 3.5 goals" value={pct(fixture.probabilities?.under35 ?? 0)}/></div>
          <div className="mt-4 flex items-center justify-between gap-3"><span className="text-xs text-slate-500">Expected goals: {(fixture.probabilities?.expectedTotalGoals ?? fixture.homeExpectedGoals + fixture.awayExpectedGoals).toFixed(2)}</span><button onClick={() => setExpanded(isExpanded ? null : fixture.id)} className="inline-flex items-center gap-2 rounded-lg border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-semibold text-emerald-200">{isExpanded ? "Hide markets" : "Explore all markets"}<ChevronDown size={14} className={isExpanded ? "rotate-180" : ""}/></button></div></div>
          {isExpanded && <div className="border-t border-white/10 bg-black/10 p-4 sm:p-5"><div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">Market predictions</h3><span className="text-[10px] uppercase tracking-wider text-slate-500">Estimated probabilities</span></div>{groups.map(group => <div key={group.id} className="mb-4 last:mb-0"><h4 className="mb-2 text-sm font-semibold text-emerald-200">{group.title}</h4><div className="grid gap-2 sm:grid-cols-2">{group.picks.map((pick, i) => <div key={`${pick.label}-${i}`} className="rounded-xl border border-white/5 bg-[#0b1421] p-3"><div className="flex items-center justify-between gap-3"><span className="text-xs text-slate-300">{pick.label}</span><b className="text-sm tabular-nums">{pct(pick.probability)}</b></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-emerald-300" style={{width: `${Math.max(0, Math.min(100, pick.probability * 100))}%`}}/></div></div>)}</div><p className="mt-2 text-[11px] leading-5 text-slate-500">{group.note}</p></div>)}<div className="mt-4 rounded-xl border border-amber-300/15 bg-amber-300/5 p-3 text-xs leading-5 text-amber-100/80">Model limitations: goal estimates use a Poisson baseline. Other markets use generic statistical priors until team, opponent, referee, and player history are available. Treat these as research estimates, not betting guarantees.</div></div>}
        </article>;
      })}</div> : <div className="mt-6 rounded-2xl border border-white/10 bg-[#101a29] p-12 text-center"><Target size={28} className="mx-auto text-slate-500"/><p className="mt-3 font-semibold">No fixtures found</p><p className="mt-1 text-sm text-slate-400">Try another date, league, or search term.</p></div>}

      <footer className="mt-10 border-t border-white/10 pt-5 text-xs leading-6 text-slate-500">MatchIQ is an independent football analysis application and is not affiliated with bookmakers or football leagues. API coverage varies by competition. Probability estimates can be wrong and are not guarantees. <a className="text-emerald-300 underline" href="/api/predictions?date=" onClick={e => { e.preventDefault(); window.location.href = `/api/predictions?date=${date}`; }}>Open prediction API</a></footer>
    </section>
  </main>;
}
function Stat({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl bg-white/[.04] p-3"><p className="text-xs text-slate-400">{label}</p><p className="mt-2 text-xl font-bold">{value}</p></div>; }
function Metric({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) { return <div className={`rounded-xl p-2.5 ${highlight ? "bg-emerald-300/10" : "bg-white/[.03]"}`}><p className="text-[10px] text-slate-400">{label}</p><p className={`mt-1 font-semibold ${highlight ? "text-emerald-200" : "text-slate-100"}`}>{value}</p></div>; }
