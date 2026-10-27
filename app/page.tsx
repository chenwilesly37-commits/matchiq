
"use client";

import { useEffect, useState } from "react";

type Match = {
  home: string;
  away: string;
  competition?: string;
  kickoff?: string | null;
  status_text?: string;
  home_score?: number | null;
  away_score?: number | null;
};

export default function HomePage() {
  const [sport, setSport] = useState("football");
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadMatches() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/matches?sport=${encodeURIComponent(sport)}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load matches.");
        }

        if (active) {
          setMatches(data.matches || []);
          if (data.error) setError(data.error);
          else if (data.message) setError(data.message);
        }
      } catch {
        if (active) setError("Unable to load matches. Please try again.");
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
    <main style={{
      minHeight: "100vh",
      background: "#080d18",
      color: "#f5f7fb",
      padding: "28px 16px",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <header style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 36
        }}>
          <div>
            <h1 style={{ fontSize: 32, margin: 0 }}>
              Match<span style={{ color: "#43e0a0" }}>IQ</span>
            </h1>
            <p style={{ color: "#9ca9bd", marginBottom: 0 }}>
              Sports insights. Smarter decisions.
            </p>
          </div>
          <span style={{
            border: "1px solid #26344a",
            borderRadius: 20,
            padding: "8px 12px",
            color: "#43e0a0",
            fontSize: 13
          }}>
            LIVE MATCH CENTRE
          </span>
        </header>

        <section style={{
          background: "linear-gradient(135deg, #14283a, #101728)",
          border: "1px solid #26344a",
          borderRadius: 20,
          padding: 24,
          marginBottom: 24
        }}>
          <p style={{ color: "#43e0a0", fontWeight: 700 }}>
            YOUR SPORTS DASHBOARD
          </p>
          <h2 style={{ fontSize: 30, margin: "8px 0" }}>
            Every match. More insight.
          </h2>
          <p style={{ color: "#b5c0d0", lineHeight: 1.6 }}>
            Follow fixtures and explore match information across multiple
            sports in one place.
          </p>
        </section>

        <section>
          <h2>Choose your sport</h2>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 24
          }}>
            {["football", "basketball", "tennis", "hockey"].map((item) => (
              <button
                key={item}
                onClick={() => setSport(item)}
                style={{
                  padding: "12px 16px",
                  borderRadius: 10,
                  border: sport === item ? "1px solid #43e0a0" : "1px solid #29364b",
                  background: sport === item ? "#143b31" : "#111a2a",
                  color: "#f5f7fb",
                  cursor: "pointer",
                  textTransform: "capitalize"
                }}
              >
                {item}
              </button>
            ))}
          </div>

          <h2>Upcoming matches</h2>

          {loading && <p style={{ color: "#a9b6c9" }}>Loading matches...</p>}

          {!loading && error && (
            <p style={{
              background: "#241e18",
              color: "#ffd29b",
              padding: 14,
              borderRadius: 10
            }}>
              {error}
            </p>
          )}

          {!loading && matches.length === 0 && !error && (
            <p style={{ color: "#a9b6c9" }}>
              No matches are available right now.
            </p>
          )}

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 14
          }}>
            {matches.map((match, index) => (
              <article key={`${match.home}-${match.away}-${index}`} style={{
                background: "#111a2a",
                border: "1px solid #29364b",
                borderRadius: 14,
                padding: 18
              }}>
                <p style={{ color: "#43e0a0", fontSize: 12 }}>
                  {match.competition || "Sports fixture"}
                </p>
                <h3>{match.home}</h3>
                <p style={{ color: "#9ca9bd" }}>VS</p>
                <h3>{match.away}</h3>
                <p style={{ color: "#a9b6c9", fontSize: 13 }}>
                  {match.status_text || "Scheduled"}
                </p>
                {match.kickoff && (
                  <p style={{ color: "#a9b6c9", fontSize: 13 }}>
                    {new Date(match.kickoff).toLocaleString()}
                  </p>
                )}
                {match.home_score != null && match.away_score != null && (
                  <p>Score: {match.home_score} - {match.away_score}</p>
                )}
              </article>
            ))}
          </div>
        </section>

        <footer style={{
          borderTop: "1px solid #29364b",
          marginTop: 40,
          paddingTop: 18,
          color: "#7f8da3",
          fontSize: 12
        }}>
          MatchIQ predictions are estimates, not guaranteed results.
        </footer>
      </div>
    </main>
  );
}
