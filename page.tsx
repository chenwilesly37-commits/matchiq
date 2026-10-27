
"use client";

import { useEffect, useState } from "react";

type Match = {
  home: string;
  away: string;
  competition?: string;
  status_text?: string;
  kickoff?: string | number;
  home_score?: number | null;
  away_score?: number | null;
};

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sport, setSport] = useState("football");

  useEffect(() => {
    let active = true;

    async function loadMatches() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/matches?sport=" + sport);
        if (!response.ok) throw new Error("Match data is unavailable.");
        const data = await response.json();
        if (active) setMatches(data.matches ?? []);
      } catch {
        if (active) {
          setError("Match data is not connected yet. We will connect the data API next.");
          setMatches([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadMatches();
    return () => {
      active = false;
    };
  }, [sport]);

  return (
    <main className="min-h-screen bg-[#080d18] text-white">
      <header className="border-b border-white/10 px-5 py-5 md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              Match<span className="text-cyan-400">IQ</span>
            </h1>
            <p className="text-xs text-slate-400">
              Sports intelligence & probability analysis
            </p>
          </div>
          <span className="rounded-full border border-cyan-400/30 px-3 py-1 text-xs text-cyan-300">
            BETA
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-8 md:px-10">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#13243a] to-[#101522] p-6 md:p-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Data-driven predictions
          </p>
          <h2 className="max-w-2xl text-3xl font-bold md:text-5xl">
            Every match. More insight. Better analysis.
          </h2>
          <p className="mt-4 max-w-xl text-slate-300">
            Explore fixtures, statistics, predicted outcomes and estimated
            probabilities in one place.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Match centre</h2>
            <p className="mt-1 text-sm text-slate-400">
              Fixtures and analysis
            </p>
          </div>
          <select
            value={sport}
            onChange={(event) => setSport(event.target.value)}
            className="rounded-lg border border-white/15 bg-[#111827] px-4 py-3 text-sm"
          >
            <option value="football">Football</option>
            <option value="basketball">Basketball</option>
            <option value="tennis">Tennis</option>
            <option value="hockey">Ice hockey</option>
          </select>
        </div>

        <div className="mt-5 space-y-3">
          {loading && (
            <p className="rounded-xl border border-white/10 p-5 text-slate-300">
              Loading matches...
            </p>
          )}

          {!loading && error && (
            <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-5">
              <p className="font-semibold text-amber-200">
                Data connection needed
              </p>
              <p className="mt-2 text-sm text-slate-300">{error}</p>
            </div>
          )}

          {!loading && !error && matches.map((match, index) => (
            <article
              key={`${match.home}-${match.away}-${index}`}
              className="rounded-xl border border-white/10 bg-[#111827] p-5"
            >
              <p className="text-xs text-slate-400">
                {match.competition ?? sport.toUpperCase()}
              </p>
              <div className="my-4 grid grid-cols-[1fr_auto] gap-3">
                <div className="space-y-3">
                  <p className="font-semibold">{match.home}</p>
                  <p className="font-semibold">{match.away}</p>
                </div>
                <div className="text-right font-bold">
                  <p>{match.home_score ?? "—"}</p>
                  <p>{match.away_score ?? "—"}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                {match.status_text ?? "Fixture"}
              </p>
              <div className="mt-4 rounded-lg bg-[#0b1220] p-3 text-sm text-slate-300">
                Prediction analysis will appear here when the statistics
                and prediction engine are connected.
              </div>
            </article>
          ))}

          {!loading && !error && matches.length === 0 && (
            <p className="rounded-xl border border-white/10 p-5 text-slate-300">
              No matches available right now.
            </p>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          Probabilities are estimates, not guarantees. No prediction is certain.
        </p>
      </section>
    </main>
  );
}
