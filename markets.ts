import type { Fixture } from "@/lib/football/types";

export type MarketPick = { label: string; probability: number; side: string };
export type MarketGroup = { id: string; title: string; note: string; picks: MarketPick[] };
function pmf(k: number, mean: number): number {
  if (mean <= 0) return k === 0 ? 1 : 0;
  let factorial = 1; for (let i = 2; i <= k; i++) factorial *= i;
  return Math.exp(-mean) * Math.pow(mean, k) / factorial;
}
function under(line: number, mean: number): number {
  let sum = 0; for (let k = 0; k <= Math.floor(line); k++) sum += pmf(k, mean);
  return Math.max(0, Math.min(1, sum));
}
function ou(prefix: string, line: number, mean: number): MarketPick[] {
  const u = under(line, mean);
  return [{ label: `${prefix} Over ${line}`, probability: 1 - u, side: "over" }, { label: `${prefix} Under ${line}`, probability: u, side: "under" }];
}
function clamp(p: number) { return Math.max(0, Math.min(1, p)); }
function exactScore(homeMean: number, awayMean: number, labelPrefix: string): MarketPick[] {
  const scores: { label: string; probability: number }[] = [];
  for (let h = 0; h <= 4; h++) for (let a = 0; a <= 4; a++) scores.push({ label: `${labelPrefix} ${h}-${a}`, probability: pmf(h, homeMean) * pmf(a, awayMean) });
  return scores.sort((a, b) => b.probability - a.probability).slice(0, 5).map(s => ({ ...s, side: "score" }));
}
export function predictAllMarkets(fixture: Fixture): MarketGroup[] {
  const home = fixture.homeExpectedGoals, away = fixture.awayExpectedGoals, total = home + away;
  // Basic independent-Poisson match outcome estimate.
  let homeWin = 0, draw = 0, awayWin = 0;
  for (let h = 0; h <= 8; h++) for (let a = 0; a <= 8; a++) {
    const p = pmf(h, home) * pmf(a, away);
    if (h > a) homeWin += p; else if (h === a) draw += p; else awayWin += p;
  }
  const btts = (1 - Math.exp(-home)) * (1 - Math.exp(-away));
  const corners = 9.4 + (total - 2.5) * .45;
  const cards = 3.7, fouls = 23.5, offsides = 2.2;
  const shots = 23.8 + (total - 2.5) * 1.3, sot = 8 + (total - 2.5) * .5;
  const halfHome = home * .44, halfAway = away * .44, secondHome = home * .56, secondAway = away * .56;
  const group = (id: string, title: string, note: string, picks: MarketPick[]): MarketGroup => ({ id, title, note, picks });
  return [
    group("goals", "Goals & match result", "Goal and result probabilities use an independent-Poisson baseline; expected goals are placeholders until team history is connected.", [
      ...[0.5,1.5,2.5,3.5,4.5].flatMap(line => ou("Goals", line, total)),
      ...[0.5,1.5,2.5].flatMap(line => ou("Home team goals", line, home)),
      ...[0.5,1.5,2.5].flatMap(line => ou("Away team goals", line, away)),
      { label: "Home win (1)", probability: clamp(homeWin), side: "home" }, { label: "Draw (X)", probability: clamp(draw), side: "draw" }, { label: "Away win (2)", probability: clamp(awayWin), side: "away" },
      { label: "Double chance: Home or Draw (1X)", probability: clamp(homeWin + draw), side: "double-chance-1x" },
      { label: "Double chance: Home or Away (12)", probability: clamp(homeWin + awayWin), side: "double-chance-12" },
      { label: "Double chance: Draw or Away (X2)", probability: clamp(draw + awayWin), side: "double-chance-x2" },
      { label: "Both teams to score — Yes", probability: btts, side: "yes" }, { label: "Both teams to score — No", probability: 1 - btts, side: "no" },
      ...exactScore(home, away, "Correct score"),
    ]),
    group("corners", "Corners", "Generic league-average prior. Requires team and opponent corner history for fixture-specific forecasts.", [
      ...[7.5,8.5,9.5,10.5,11.5].flatMap(line => ou("Total corners", line, corners)),
      ...[3.5,4.5,5.5].flatMap(line => ou("Home corners", line, corners * .54)),
      ...[2.5,3.5,4.5].flatMap(line => ou("Away corners", line, corners * .46)),
    ]),
    group("cards", "Yellow & red cards", "Generic card prior; referee and competition history are not yet connected. Red cards are rare-event estimates.", [
      ...[1.5,2.5,3.5,4.5,5.5].flatMap(line => ou("Total yellow cards", line, cards)),
      { label: "Any red card — Yes", probability: .12, side: "yes" }, { label: "Any red card — No", probability: .88, side: "no" },
    ]),
    group("fouls", "Fouls", "Generic match prior; needs team foul rates, opponent style and referee tendencies.", [
      ...[17.5,19.5,21.5,23.5,25.5,27.5].flatMap(line => ou("Total fouls", line, fouls)),
    ]),
    group("offsides", "Offsides", "Generic prior; team playing style and opponent defensive line are not yet ingested.", [
      ...[0.5,1.5,2.5,3.5,4.5].flatMap(line => ou("Total offsides", line, offsides)),
    ]),
    group("shots", "Shots & shots on target (towards goal)", "Illustrative count estimates. Shots on target are attempts directed on goal that require a save or result in a goal; connect team and opponent shot history before treating these as fixture-specific forecasts.", [
      ...[17.5,19.5,21.5,23.5,25.5,27.5].flatMap(line => ou("Total shots", line, shots)),
      ...[4.5,5.5,6.5,7.5,8.5,9.5].flatMap(line => ou("Total shots on target (towards goal)", line, sot)),
      ...[1.5,2.5,3.5,4.5].flatMap(line => ou("Home shots on target (towards goal)", line, sot * .57)),
      ...[1.5,2.5,3.5,4.5].flatMap(line => ou("Away shots on target (towards goal)", line, sot * .43)),
    ]),
    group("halves", "First-half, second-half & full-time score", "Half splits use a generic 44%/56% goal-timing prior. Exact scorelines are the most likely outcomes under this baseline, not certainties.", [
      ...exactScore(halfHome, halfAway, "First-half score"),
      ...exactScore(secondHome, secondAway, "Second-half score"),
      ...exactScore(home, away, "Full-time score"),
      ...[0.5,1.5,2.5].flatMap(line => ou("First-half goals", line, halfHome + halfAway)),
      ...[0.5,1.5,2.5].flatMap(line => ou("Second-half goals", line, secondHome + secondAway)),
    ]),
  ];
}
