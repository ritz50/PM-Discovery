# Transcript ingestion helper

## Usage

1. Place helloPM transcript in `content/inbox/<module-name>-transcript.md`
2. In Cursor chat:

```
Process content/inbox/<module-name>-transcript.md into content/modules/<module-id>/
Produce: lesson.md (with frontmatter), concepts.json (5-15 cards), sources.md
```

3. Move processed transcript to `content/archive/`
4. Update `content/curriculum/topics.json` if new concept IDs were added

## Module ID mapping

| Module folder | Topic |
|---------------|-------|
| 01-problem-discovery | Problem Validation |
| 02-jobs-to-be-done | JTBD |
| 03-user-research | User Research |
| 04-personas | Personas |
| 05-opportunity-sizing | Opportunity Sizing |
| 06-solution-discovery | Solution Discovery |
| 07-experimentation | Experimentation |
| 08-prd-writing | PRD |
| 09-prioritization | RICE, OST |
| 10-ai-pm-discovery | AI PM |
