---
title: AI Product Discovery
moduleId: 10-ai-pm-discovery
tags: [ai, discovery, evals]
difficulty: advanced
topicIds: [ai-discovery, ai-evals]
---

# AI Product Discovery

AI products add unique discovery challenges: non-deterministic outputs, data dependencies, and eval criteria.

## AI problem framing

Ask: Is AI the right solution? Could rules, search, or templates solve this cheaper?

Good AI problems: unstructured input, pattern recognition, language generation at scale.

## Eval criteria

Define quality before building:
- Accuracy / relevance
- Latency and cost
- Safety and hallucination rate
- User satisfaction (human eval)

## Human-in-the-loop

Design where humans review, correct, or override AI outputs — especially at launch.

## Discovery loop for AI

1. Frame problem and AI fit
2. Build golden dataset (input → expected output)
3. Prototype with prompts/models
4. Run evals against quality bar
5. Ship with monitoring and regression tests

## Key takeaway

You cannot discovery-drive AI without evals. Define "good enough" before you demo.
