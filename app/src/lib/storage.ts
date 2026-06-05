"use client";

import type { ProgressData } from "./types";
import { STORAGE_KEY } from "./types";

export function defaultProgress(): ProgressData {
  return {
    cards: {},
    quizzes: [],
    interviews: [],
    cases: [],
    visitedModules: [],
    visitedTopics: [],
    streakDays: 0,
    lastActiveDate: "",
  };
}

export function loadProgress(): ProgressData {
  if (typeof window === "undefined") return defaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    return { ...defaultProgress(), ...JSON.parse(raw) };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(data: ProgressData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function touchActivity(data: ProgressData): ProgressData {
  const today = new Date().toISOString().slice(0, 10);
  const next = { ...data };
  if (next.lastActiveDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().slice(0, 10);
    next.streakDays = next.lastActiveDate === yStr ? next.streakDays + 1 : 1;
    next.lastActiveDate = today;
  }
  return next;
}

export function exportProgressJson(): string {
  return JSON.stringify(loadProgress(), null, 2);
}
