import type { CardState } from "./types";

const RATING_MAP: Record<string, number> = {
  again: 1,
  hard: 3,
  good: 4,
  easy: 5,
};

export function defaultCardState(): CardState {
  return {
    ease: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: Date.now(),
    lapses: 0,
  };
}

export function ratingFromLabel(label: string): number {
  return RATING_MAP[label] ?? 3;
}

export function isDue(card: CardState): boolean {
  return card.nextReview <= Date.now();
}

export function updateCardSM2(card: CardState, quality: number): CardState {
  const next = { ...card };
  next.lastRating = quality;
  next.lastReviewed = Date.now();

  if (quality < 3) {
    next.repetitions = 0;
    next.interval = 1;
    next.lapses += 1;
    next.nextReview = Date.now() + 60 * 1000;
  } else {
    if (next.repetitions === 0) {
      next.interval = 1;
    } else if (next.repetitions === 1) {
      next.interval = 6;
    } else {
      next.interval = Math.round(next.interval * next.ease);
    }
    next.repetitions += 1;
    next.ease = Math.max(1.3, next.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    next.nextReview = Date.now() + next.interval * 24 * 60 * 60 * 1000;
  }

  return next;
}
