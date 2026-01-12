---
id: 2
title: Correct Feature Spec File Path
stage: spec
date: 2026-01-12
surface: agent
model: gemini-1.5-flash
feature: features/task-crud
branch: main
user: hp
command: sp.specify features/task-crud.md
labels: ["feature", "task-crud", "spec", "correction"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - specs/features/task-crud.md
tests:
 - null
---

## Prompt

1

## Response snapshot

PHR creation for corrected task-crud feature specification.

## Outcome

- ✅ Impact: Corrected feature specification file path to `specs/features/task-crud.md`.
- 🧪 Tests: N/A
- 📁 Files: Created `specs/features/task-crud.md`, deleted `specs/features/task-crud/spec.md`, and created `history/prompts/features/task-crud/2-correct-feature-spec-file-path.spec.prompt.md`.
- 🔁 Next prompts: Waiting for next instruction.
- 🧠 Reflection: This PHR corrects the file path from PHR 1. The previous PHR (1-specify-task-crud-feature.spec.prompt.md) is now obsolete.

## Evaluation notes (flywheel)

- Failure modes observed: N/A
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
