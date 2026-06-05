# Rubric — AI Summarization Case

## Strong answer includes

- AI fit assessment (vs manual templates or search)
- Eval dimensions: accuracy, action-item extraction, hallucination rate, latency
- Golden dataset approach (20-30 labeled meetings)
- Human-in-the-loop for PII and low-confidence outputs
- Experiment with pre-committed decision rule

## Red flags

- Ship because demo "felt good"
- No eval criteria or regression plan
- Ignoring legal/PII constraints

## Model answer outline

AI fits for unstructured transcript → structured actions. Eval: 90% action-item recall, <2% hallucinated tasks, <30s latency. Build golden set from 25 meetings labeled by CSMs. Experiment: wizard-of-oz summaries for 20 users, measure edit rate and weekly usage. Human review for PII flags. If edit rate <20% and WAU >40%, persevere to v1; else pivot to search/highlight only.
