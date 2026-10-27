
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sport = searchParams.get("sport") || "football";

  if (sport !== "football") {
    return NextResponse.json(
      {
        matches: [],
        message: "This sport's data provider is not connected yet.",
      },
      { status: 200 }
    );
  }

  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        matches: [],
        error: "API_FOOTBALL_KEY is not configured on the server.",
      },
      { status: 503 }
    );
  }

  try {
    const response = await fetch(
      "https://v3.football.api-sports.io/fixtures?next=20",
      {
        headers: {
          "x-apisports-key": apiKey,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { matches: [], error: "Football data provider request failed." },
        { status: 502 }
      );
    }

    const data = await response.json();

    const matches = (data.response || []).map((item: any) => ({
      home: item.teams?.home?.name ?? "Home team",
      away: item.teams?.away?.name ?? "Away team",
      competition: item.league?.name ?? "Football",
      status_text: item.fixture?.status?.long ?? "Scheduled",
      kickoff: item.fixture?.date ?? null,
      home_score: item.goals?.home ?? null,
      away_score: item.goals?.away ?? null,
      fixture_id: item.fixture?.id ?? null,
    }));

    return NextResponse.json({ matches });
  } catch {
    return NextResponse.json(
      { matches: [], error: "Could not connect to the football data provider." },
      { status: 502 }
    );
  }
}
