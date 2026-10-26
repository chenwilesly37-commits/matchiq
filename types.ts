export type FixtureStatus = "scheduled" | "live" | "finished";
export type Fixture = {
  id: string;
  league: string;
  country: string;
  kickoff: string;
  status: FixtureStatus;
  homeTeam: string;
  awayTeam: string;
  homeGoals: number | null;
  awayGoals: number | null;
  homeForm: string[];
  awayForm: string[];
  homeExpectedGoals: number;
  awayExpectedGoals: number;
};
export type GoalProbabilities = {
  over15: number;
  over25: number;
  over35: number;
  under25: number;
  under35: number;
  expectedTotalGoals: number;
};
