import type { GoalProbabilities } from "@/lib/football/types";

/** P(X=k) for X~Poisson(lambda). */
function poissonProbability(lambda: number, k: number): number {
  if (lambda < 0 || k < 0) return 0;
  let factorial = 1;
  for (let i = 2; i <= k; i++) factorial *= i;
  return Math.exp(-lambda) * Math.pow(lambda, k) / factorial;
}

/** Derive total-goal probabilities by convolving two independent Poisson goal models. */
export function predictGoals(homeLambda: number, awayLambda: number): GoalProbabilities {
  const maxGoals = 10;
  let under15 = 0, under25 = 0, under35 = 0;
  for (let h = 0; h <= maxGoals; h++) {
    for (let a = 0; a <= maxGoals; a++) {
      const p = poissonProbability(homeLambda, h) * poissonProbability(awayLambda, a);
      const total = h + a;
      if (total <= 1) under15 += p;
      if (total <= 2) under25 += p;
      if (total <= 3) under35 += p;
    }
  }
  return {
    over15: clamp(1 - under15),
    over25: clamp(1 - under25),
    over35: clamp(1 - under35),
    under25: clamp(under25),
    under35: clamp(under35),
    expectedTotalGoals: round(homeLambda + awayLambda, 2),
  };
}
function clamp(n: number) { return Math.min(1, Math.max(0, n)); }
function round(n: number, places: number) { return Number(n.toFixed(places)); }
