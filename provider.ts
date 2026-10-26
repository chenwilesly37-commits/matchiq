import type { Fixture } from "./types";
import { demoFixtures } from "./demo";

const BASE_URL = process.env.FOOTBALL_DATA_BASE_URL || "https://v3.football.api-sports.io";

/**
 * Provider adapter. Demo mode is the default.
 * Verify the current API-Football schema and your licence before production use.
 */
export async function getFixtures(date?: string): Promise<Fixture[]> {
  const provider = process.env.FOOTBALL_DATA_PROVIDER || "demo";
  const key = process.env.FOOTBALL_DATA_API_KEY;

  if (provider !== "api-football" || !key) {
    return date ? demoFixtures.filter((f) => f.kickoff.slice(0, 10) === date) : demoFixtures;
  }

  const requestedDate = date || new Date().toISOString().slice(0, 10);
  const url = new URL(`${BASE_URL}/fixtures`);
  url.searchParams.set("date", requestedDate);
  url.searchParams.set("timezone", "Africa/Douala");

  const response = await fetch(url, {
    headers: { "x-apisports-key": key },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Football provider returned ${response.status}`);

  const payload = await response.json();
  if (!Array.isArray(payload.response)) throw new Error("Unexpected provider response shape");

  return payload.response.map((item: any): Fixture => ({
    id: String(item.fixture?.id),
    league: String(item.league?.name ?? "Unknown league"),
    country: String(item.league?.country ?? ""),
    kickoff: String(item.fixture?.date),
    status: item.fixture?.status?.short === "FT" ? "finished" :
      ["1H", "2H", "HT", "ET", "P", "LIVE"].includes(item.fixture?.status?.short) ? "live" : "scheduled",
    homeTeam: String(item.teams?.home?.name ?? "Home"),
    awayTeam: String(item.teams?.away?.name ?? "Away"),
    homeGoals: typeof item.goals?.home === "number" ? item.goals.home : null,
    awayGoals: typeof item.goals?.away === "number" ? item.goals.away : null,
    // These should be replaced with licensed historical-stat calculations.
    homeForm: [], awayForm: [],
    homeExpectedGoals: 1.25, awayExpectedGoals: 1.05,
  }));
}
