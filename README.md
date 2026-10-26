# MatchIQ — All-Market Football Analysis

MatchIQ is an independent Next.js football-analysis application. It includes a responsive match centre, fixture search, date and league filters, market category filters, expandable per-fixture estimates, a prediction API, and a performance page.

## Markets in the interface

- Match result: home/draw/away, double-independent outcome foundation
- Goals: over/under, home and away team goals, both teams to score, correct-score candidates
- Corners: total and team totals
- Discipline: yellow-card totals and red-card occurrence
- Fouls and offsides
- Total shots and shots on target, including home/away shots on target
- First-half score candidates, second-half score candidates, full-time score candidates, and goals by half

## Important model/data status

The project defaults to **demo mode**. Demo fixtures are fictional examples. Goal probabilities use a basic independent Poisson baseline. Corners, cards, fouls, offsides, and shot markets currently use generic priors, not verified fixture-specific historical forecasts. First/second-half goal allocation uses a simple 44%/56% prior. These values must not be presented as validated or guaranteed predictions.

The API-Football adapter loads real fixtures when configured. Real fixture data alone does not make all-market probabilities accurate: the next production step is ingesting licensed historical team/player/referee statistics, persisting predictions and results, calibrating models, and backtesting each market by competition.

## Requirements

- Node.js 20 or newer
- npm
- An API-Football account/key for real fixtures (optional for local demo)
- GitHub and Vercel accounts to deploy publicly

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Connect API-Football

Set these variables in `.env.local` (never use a `NEXT_PUBLIC_` prefix for the secret key):

```env
FOOTBALL_DATA_PROVIDER=api-football
FOOTBALL_DATA_API_KEY=your_private_api_key
FOOTBALL_DATA_BASE_URL=https://v3.football.api-sports.io
```

Restart the dev server. The server-side fixture adapter sends the API key in the `x-apisports-key` header and requests fixtures by date. Confirm the competitions and statistics included in your subscription before relying on coverage. API-Football documentation: https://www.api-football.com/documentation-v3

To return to demo mode, set `FOOTBALL_DATA_PROVIDER=demo`.

## API routes

- `GET /api/fixtures?date=YYYY-MM-DD`
- `GET /api/predictions?date=YYYY-MM-DD`

The predictions endpoint returns fixtures, baseline goal probabilities, market groups, model version, data source, and a disclaimer.

## Deploy to Vercel

1. Create a GitHub repository and push this project.
2. Sign in at https://vercel.com/ and import the repository.
3. Add `FOOTBALL_DATA_PROVIDER`, `FOOTBALL_DATA_API_KEY`, and `FOOTBALL_DATA_BASE_URL` under the Vercel project's Environment Variables. Keep the API key server-only.
4. Deploy. Vercel will issue a public `*.vercel.app` URL.
5. Test `/api/fixtures?date=YYYY-MM-DD` and `/api/predictions?date=YYYY-MM-DD` on the deployed domain.

I cannot publish to a GitHub/Vercel account without the owner completing those authenticated steps. Do not send passwords or private tokens in chat.

## Production checklist

- Ingest recent fixtures and stats for each selected league/season.
- Verify provider coverage for corners, fouls, offsides, cards and shots by competition.
- Add team and opponent-specific distributions; add referee/player features where available.
- Persist predictions before kickoff and final outcomes in Supabase.
- Backtest per market/league and calibrate probabilities before displaying a confidence label.
- Add rate limiting, caching, error monitoring, data-source attribution, privacy and terms pages.

MatchIQ is independent and not affiliated with any bookmaker or league. Verify your data-provider licence for commercial display and redistribution of data and logos.


## v0.4 market additions
- Added all three double-chance outcomes: 1X (home or draw), 12 (home or away), and X2 (draw or away). Probabilities are combined from the model's home-win, draw, and away-win estimates.
- Clarified total and team shots-on-target markets as shots directed towards goal. These remain illustrative estimates until team/opponent shot history is connected.


## Exact-score estimates and live score refresh (v0.5)

- The match cards highlight the highest-probability exact scoreline from the independent-Poisson goal model. It is a probability estimate, not a certain prediction.
- When `FOOTBALL_DATA_PROVIDER=api-football` and a valid `FOOTBALL_DATA_API_KEY` are configured in Vercel Environment Variables, the page refreshes fixture/score data about every 60 seconds while open. Provider coverage, API quota, and latency affect availability.
- Demo mode displays sample fixtures and is not a live-score feed. Keep the API key server-side; do not use a `NEXT_PUBLIC_` variable for it.


## v0.6 multi-sport interface

- Added sport navigation for football, basketball, tennis, and ice hockey.
- Added a market catalog for basketball (winner, spread, totals, team totals, periods, margins, and available player props), tennis (match/set winner, correct set score, totals, games handicap, tie-breaks, aces/double faults when covered), and ice hockey (moneyline, regulation 1X2, puck line, goals totals, period markets, both teams to score, overtime, winning margin, and shots on goal when covered).
- Important: the current live provider adapter is football-only. Basketball, tennis, and ice hockey views currently explain supported market types and required provider integration; they do not fabricate live fixtures, scores, or model probabilities. To make them produce live predictions, add licensed sport-specific data feeds and build/test calibrated models for each sport and market.
