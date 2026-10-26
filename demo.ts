import type { Fixture } from "./types";

const day = new Date();
day.setHours(19, 0, 0, 0);
const tomorrow = new Date(day);
tomorrow.setDate(tomorrow.getDate() + 1);

export const demoFixtures: Fixture[] = [
  { id: "demo-001", league: "Ligue 1", country: "France", kickoff: tomorrow.toISOString(), status: "scheduled", homeTeam: "Paris Saint-Germain", awayTeam: "Olympique Lyon", homeGoals: null, awayGoals: null, homeForm: ["W","W","W","D","W"], awayForm: ["W","L","W","W","L"], homeExpectedGoals: 2.05, awayExpectedGoals: 1.10 },
  { id: "demo-002", league: "Premier League", country: "England", kickoff: tomorrow.toISOString(), status: "scheduled", homeTeam: "Northbridge FC", awayTeam: "Riverside United", homeGoals: null, awayGoals: null, homeForm: ["W","D","W","L","W"], awayForm: ["L","D","W","L","D"], homeExpectedGoals: 1.55, awayExpectedGoals: 0.95 },
  { id: "demo-003", league: "La Liga", country: "Spain", kickoff: day.toISOString(), status: "finished", homeTeam: "Coastal Athletic", awayTeam: "Capital Sporting", homeGoals: 2, awayGoals: 1, homeForm: ["W","D","W","W","L"], awayForm: ["L","W","D","L","W"], homeExpectedGoals: 1.65, awayExpectedGoals: 1.05 },
  { id: "demo-004", league: "Bundesliga", country: "Germany", kickoff: tomorrow.toISOString(), status: "scheduled", homeTeam: "Bavaria 04", awayTeam: "Harbor SV", homeGoals: null, awayGoals: null, homeForm: ["W","W","D","W","W"], awayForm: ["L","D","L","W","D"], homeExpectedGoals: 1.85, awayExpectedGoals: 1.25 },
  { id: "demo-005", league: "Serie A", country: "Italy", kickoff: tomorrow.toISOString(), status: "scheduled", homeTeam: "Old Town Calcio", awayTeam: "Blue City", homeGoals: null, awayGoals: null, homeForm: ["D","W","L","W","D"], awayForm: ["W","D","W","L","W"], homeExpectedGoals: 1.20, awayExpectedGoals: 1.30 },
];
