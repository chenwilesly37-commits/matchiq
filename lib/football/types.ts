export type Fixture = {
  id?: number | string;
  home: string;
  away: string;
  competition?: string;
  kickoff?: string | null;
  status_text?: string;
  home_score?: number | null;
  away_score?: number | null;
};
