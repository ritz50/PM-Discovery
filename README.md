# PM Discovery Guide

Personal Product Discovery learning system: interactive web app + Cursor tutor.

## Quick start

Requires Node.js 18+ and npm.

```bash
cd app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

If `npm` is not installed, install [Node.js](https://nodejs.org/) or run `xcode-select --install` on macOS for git and developer tools.

## Project layout

| Path | Purpose |
|------|---------|
| `content/inbox/` | Drop raw transcripts, PDFs, links here |
| `content/modules/` | Structured lessons + concept cards |
| `content/curriculum/topics.json` | Product Discovery topic map |
| `content/frameworks/` | Framework reference pages |
| `content/interview-bank/` | Interview Q&A with rubrics |
| `content/case-studies/` | Practice scenarios |
| `content/templates/` | Work templates (PRD, discovery plan) |
| `app/` | Next.js interactive app |
| `.cursor/skills/pm-discovery-tutor/` | Cursor tutor skill |
| `canvases/` | Framework visual canvases |

## Cursor usage

- **Learn:** "explain JTBD" or `@content/modules/02-jobs-to-be-done/lesson.md`
- **Quiz:** "quiz me on product discovery"
- **Gaps:** Export from `/gaps` → "drill my weak areas"
- **Interview:** "mock PM interview, focus on discovery"
- **Work:** `@content/templates/prd-outline.md` while drafting

## Adding content

1. Drop files in `content/inbox/`
2. Ask Cursor to process a transcript into `content/modules/<id>/`
3. Update `content/curriculum/topics.json` if adding new topics
