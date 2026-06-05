import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { buildTopicConceptMap, getTopicConceptIds as getTopicConceptIdsPure } from "./topic-utils";
import type {
  CaseStudy,
  Concept,
  Curriculum,
  Framework,
  InterviewQuestion,
  ModuleMeta,
} from "./types";

const CONTENT_DIR = path.join(process.cwd(), "..", "content");

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
}

export function getCurriculum(): Curriculum {
  return readJson<Curriculum>(path.join(CONTENT_DIR, "curriculum", "topics.json"));
}

export function getModuleIds(): string[] {
  const modulesDir = path.join(CONTENT_DIR, "modules");
  return fs
    .readdirSync(modulesDir)
    .filter((f) => fs.statSync(path.join(modulesDir, f)).isDirectory())
    .sort();
}

export function getModule(moduleId: string): ModuleMeta | null {
  const lessonPath = path.join(CONTENT_DIR, "modules", moduleId, "lesson.md");
  if (!fs.existsSync(lessonPath)) return null;
  const raw = fs.readFileSync(lessonPath, "utf-8");
  const { data, content } = matter(raw);
  return {
    moduleId: data.moduleId ?? moduleId,
    title: data.title ?? moduleId,
    tags: data.tags ?? [],
    difficulty: data.difficulty ?? "foundational",
    topicIds: data.topicIds ?? [],
    content,
  };
}

export function getModuleConcepts(moduleId: string): Concept[] {
  const conceptsPath = path.join(CONTENT_DIR, "modules", moduleId, "concepts.json");
  if (!fs.existsSync(conceptsPath)) return [];
  return readJson<Concept[]>(conceptsPath);
}

export function getAllConcepts(): Concept[] {
  return getModuleIds().flatMap((id) => getModuleConcepts(id));
}

export function getFrameworkIds(): string[] {
  const dir = path.join(CONTENT_DIR, "frameworks");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(".md", ""));
}

export function getFramework(id: string): Framework | null {
  const filePath = path.join(CONTENT_DIR, "frameworks", `${id}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    id: data.id ?? id,
    title: data.title ?? id,
    topicIds: data.topicIds ?? [],
    content,
  };
}

export function getGlossary(): string {
  const p = path.join(CONTENT_DIR, "glossary.md");
  return fs.existsSync(p) ? fs.readFileSync(p, "utf-8") : "";
}

export function getInterviewQuestions(): InterviewQuestion[] {
  const p = path.join(CONTENT_DIR, "interview-bank", "questions.json");
  return fs.existsSync(p) ? readJson<InterviewQuestion[]>(p) : [];
}

export function getCaseStudyIds(): string[] {
  const dir = path.join(CONTENT_DIR, "case-studies");
  return fs
    .readdirSync(dir)
    .filter((f) => fs.statSync(path.join(dir, f)).isDirectory())
    .sort();
}

export function getCaseStudy(id: string): CaseStudy | null {
  const scenarioPath = path.join(CONTENT_DIR, "case-studies", id, "scenario.md");
  const rubricPath = path.join(CONTENT_DIR, "case-studies", id, "rubric.md");
  if (!fs.existsSync(scenarioPath)) return null;
  const raw = fs.readFileSync(scenarioPath, "utf-8");
  const { data, content } = matter(raw);
  const rubric = fs.existsSync(rubricPath) ? fs.readFileSync(rubricPath, "utf-8") : "";
  return {
    id: data.id ?? id,
    title: data.title ?? id,
    topicIds: data.topicIds ?? [],
    scenario: content,
    rubric,
  };
}

export function getCaseStudySummaries(): { id: string; topicIds: string[] }[] {
  return getCaseStudyIds().map((id) => {
    const cs = getCaseStudy(id);
    return { id, topicIds: cs?.topicIds ?? [] };
  });
}

export function getSearchDocuments() {
  const docs: { id: string; title: string; body: string; href: string; type: string }[] = [];

  for (const moduleId of getModuleIds()) {
    const mod = getModule(moduleId);
    if (mod) {
      docs.push({
        id: moduleId,
        title: mod.title,
        body: mod.content,
        href: `/learn/${moduleId}`,
        type: "module",
      });
    }
    for (const c of getModuleConcepts(moduleId)) {
      docs.push({
        id: c.id,
        title: c.title,
        body: `${c.definition} ${c.whenToUse} ${c.officeUse}`,
        href: `/learn/${moduleId}`,
        type: "concept",
      });
    }
  }

  for (const fwId of getFrameworkIds()) {
    const fw = getFramework(fwId);
    if (fw) {
      docs.push({
        id: fwId,
        title: fw.title,
        body: fw.content,
        href: `/frameworks/${fwId}`,
        type: "framework",
      });
    }
  }

  docs.push({
    id: "glossary",
    title: "Glossary",
    body: getGlossary(),
    href: "/reference",
    type: "glossary",
  });

  return docs;
}

export function getModuleConceptIdMap(): Record<string, string[]> {
  return Object.fromEntries(
    getModuleIds().map((id) => [id, getModuleConcepts(id).map((c) => c.id)])
  );
}

export function getTopicConceptMap(curriculum: Curriculum): Record<string, string[]> {
  return buildTopicConceptMap(curriculum.topics, getModuleConceptIdMap());
}

export function getTopicConceptIds(topic: { conceptIds: string[]; moduleIds: string[] }): string[] {
  return getTopicConceptIdsPure(topic, getModuleConceptIdMap());
}

export function getConceptsForTopic(topicId: string, curriculum: Curriculum): Concept[] {
  const topic = curriculum.topics.find((t) => t.id === topicId);
  if (!topic) return [];
  const ids = new Set(getTopicConceptIds(topic));
  const all = getAllConcepts();
  return all.filter((c) => ids.has(c.id) || c.topicIds?.includes(topicId));
}
