export interface Concept {
  id: string;
  title: string;
  module: string;
  topicIds?: string[];
  definition: string;
  whenToUse: string;
  frameworkSteps?: string[];
  interviewPrompts?: string[];
  officeUse: string;
  relatedConcepts?: string[];
  sources?: string[];
}

export interface Phase {
  id: string;
  title: string;
  description: string;
}

export interface Topic {
  id: string;
  title: string;
  phase: string;
  description: string;
  moduleIds: string[];
  conceptIds: string[];
  frameworkIds: string[];
  prerequisites: string[];
  interviewTags: string[];
}

export interface Curriculum {
  phases: Phase[];
  topics: Topic[];
}

export interface ModuleMeta {
  moduleId: string;
  title: string;
  tags: string[];
  difficulty: string;
  topicIds?: string[];
  content: string;
}

export interface Framework {
  id: string;
  title: string;
  topicIds?: string[];
  content: string;
}

export interface InterviewQuestion {
  id: string;
  topicIds: string[];
  question: string;
  rubric: string;
  modelAnswer: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  topicIds: string[];
  scenario: string;
  rubric: string;
}

export type MasteryStatus = "not_started" | "learning" | "weak" | "solid";

export type GapType = "knowledge" | "coverage" | "application" | "decay";

export interface Gap {
  topicId: string;
  topicTitle: string;
  type: GapType;
  mastery: number;
  message: string;
  action: string;
  actionHref: string;
}

export interface RecommendedAction {
  message: string;
  href: string;
  priority: number;
}

export interface TopicMastery {
  topicId: string;
  mastery: number;
  status: MasteryStatus;
  recallScore: number;
  quizScore: number;
  applicationScore: number;
  coverageScore: number;
  dueCards: number;
}

export interface CardState {
  ease: number;
  interval: number;
  repetitions: number;
  nextReview: number;
  lastRating?: number;
  lastReviewed?: number;
  lapses: number;
}

export interface QuizResult {
  moduleId: string;
  score: number;
  total: number;
  timestamp: number;
}

export interface InterviewRating {
  questionId: string;
  rating: number;
  timestamp: number;
}

export interface CaseRating {
  caseId: string;
  selfScore: number;
  timestamp: number;
}

export interface ProgressData {
  cards: Record<string, CardState>;
  quizzes: QuizResult[];
  interviews: InterviewRating[];
  cases: CaseRating[];
  visitedModules: string[];
  visitedTopics: string[];
  streakDays: number;
  lastActiveDate: string;
}

export const STORAGE_KEY = "pm-discovery-progress";
