"use client";

import { useEffect } from "react";
import { loadProgress, saveProgress } from "@/lib/storage";

export function VisitTracker({ moduleId, topicId }: { moduleId?: string; topicId?: string }) {
  useEffect(() => {
    const p = loadProgress();
    let changed = false;
    if (moduleId && !p.visitedModules.includes(moduleId)) {
      p.visitedModules.push(moduleId);
      changed = true;
    }
    if (topicId && !p.visitedTopics.includes(topicId)) {
      p.visitedTopics.push(topicId);
      changed = true;
    }
    if (changed) saveProgress(p);
  }, [moduleId, topicId]);

  return null;
}
