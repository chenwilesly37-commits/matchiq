
import type { Fixture } from "./types";

export async function getFixtures(date?: string): Promise<Fixture[]> {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    throw new Error("API_FOOTBALL_KEY is not configured");
  }

  const endpoint = date
    ? `https://v3.football.api-sports.io/fixtures?date=${date}`
    : "https://v3.football.api-sports.io/fixtures?next=20";

  const response = await fetch(endpoint, {
    headers: {
      "x-apisports-key": apiKey,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Football data provider request failed");
  }

  const data = await response.json();

  if (data.errors && Object.keys(data.errors).length > 0) {
    throw new Error("API-Football returned an error");
  }

  return (data.response ?? []).map((item: any) => ({
    id: item.fixture?.id,
    home: item.teams?.home?.name ?? "Home team",
    away: item.teams?.away?.name ?? "Away team",
    competition: item.league?.name ?? "Football",
    kickoff: item.fixture?.date ?? null,
    status_text: item.fixture?.status?.long ?? "Scheduled",
    home_score: item.goals?.home ?? null,
    away_score: item.goals?.away ?? null,
    homeExpectedGoals: 1.3,
    awayExpectedGoals: 1.1,
  }));
}
