
export type Fixture = {
  id?: number | string;
  home: string;
  away: string;
  competition?: string;
  kickoff?: string | null;
  status_text?: string;
  home_score?: number | null;
  away_score?: number | null;

  // Expected goals used by the prediction model
  homeExpectedGoals: number;
  awayExpectedGoals: number;
};

export type GoalProbabilities = {
  home: number[];
  away: number[];
};

