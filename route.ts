import { NextRequest, NextResponse } from "next/server";
import { getFixtures } from "@/lib/football/provider";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  try {
    const date = request.nextUrl.searchParams.get("date") || undefined;
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ error: "date must use YYYY-MM-DD" }, { status: 400 });
    const fixtures = await getFixtures(date);
    return NextResponse.json({ fixtures, source: process.env.FOOTBALL_DATA_PROVIDER === "api-football" && process.env.FOOTBALL_DATA_API_KEY ? "api-football" : "demo" }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("fixtures route error", error);
    return NextResponse.json({ error: "Unable to load fixtures. Check provider settings, API credentials, and API quota." }, { status: 502 });
  }
}
