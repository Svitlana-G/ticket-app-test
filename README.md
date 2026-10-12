# Zunft Frontend Engineering Assessment

This is Zunft's frontend assignment, based on the CopilotKit ticketing app.
Choose **one** engineering assignment; you only need to submit one repository.

## Context

You're receiving a ticketing application built by a previous developer. The app is functional but has bugs — some obvious, some subtle. You're also receiving a product brief with stakeholder input that contains contradictions, and a component (`REVIEW_ME.tsx`) to review.

Your job is to demonstrate engineering judgment: find and fix bugs systematically, evaluate code critically, and make defensible product decisions when requirements conflict.

## AI tools

AI tools are allowed. Explain what you delegated, accepted or rejected, and
how you checked it. Be ready to explain your reasoning and demonstrate the
changed behavior in a follow-up interview.

## Zunft scope — Tier 1 only

- Investigate and aim to fix the **3 most critical bugs** you find in the application
- Submit a written review of `src/REVIEW_ME.tsx` with severity ratings and reasoning
- Submit a decision document resolving the contradictions in `BRIEF.md`, with reasoning

Three fixes describe the target scope, not a completion threshold. No additional
features, shared-package technical plan, or fake API extensions are required.

## Timebox

Timebox your work to **2–3 hours**, including setup, investigation,
implementation, and notes. Stop by three hours and submit what you have.
**Full completion is not expected. An honest thinking log is more valuable
than completing every task without transparency.**

## Submission

Clone the assignment repository into your account and submit your public
cloned repository (or a patch), with code changes to the extent reached
within the timebox. Do not send exercise solutions as pull requests to the
upstream repository.

Include concise notes in `NOTES.md` (alternatively an **optional screen
recording with your voice comments**) covering:

- Starting repository; how to run your version.
- Problems found, priorities, and root causes for changes you made.
- Reproduction steps and tests or manual checks, including results.
- Assumptions, rejected alternatives, deliberate omissions, and next steps with another day.
- Time spent and an honest thinking log: what you noticed, tried, learned, changed your mind about, and left unfinished. Include failed attempts, blockers, and uncertainty. For AI/tool use, explain what you delegated, accepted or rejected, and how you checked it. Brief chronological notes are enough; full chat transcripts are not required.

### Frontend deliverables

Submit these files to the extent reached within the timebox:

| File | What to include |
| --- | --- |
| `BUGS.md` | Root causes, reproduction steps, fixes, and before/after tests or manual checks with results |
| `REVIEW.md` | Review of `src/REVIEW_ME.tsx` with severity ratings and reasoning |
| `DECISIONS.md` | How you resolve the contradictions in `BRIEF.md`, with reasoning |

The optional recording can replace the thinking log in `NOTES.md`; the
frontend review and decision documents remain part of the target scope.

## Assessment and follow-up

We assess substantive scope and reasoning, not setup effort or unfamiliar
tooling alone. If setup consumes the timebox, document the blocker and your
approach rather than spending extra unpaid time.

In the follow-up interview, be ready to show the changed behavior and explain
a root cause. We assess your reasoning and understanding of the submitted
code, not your ability to recite an upstream answer.

## Getting Started

```bash
npm install
npm run dev      # Start the dev server
npm test         # Run the test suite
npm run build    # Type-check and build
```

The app runs at `http://localhost:5173`. The fake API has randomized latency (150–1100ms) and an 8% failure rate to simulate real-world conditions. Data is stored in memory and resets on page refresh.

## What's in the repo

- `src/` — The application source code (React + TypeScript)
- `src/REVIEW_ME.tsx` — A standalone component for your code review exercise (not wired into the app)
- `BRIEF.md` — Product brief with stakeholder notes
- `src/lib/fakeApi.ts` — The fake API with configurable delay, failure rate, and AbortSignal support
- `src/lib/types.ts` — TypeScript type definitions

## Notes

- If you find more than three bugs, document them. Fixing fewer bugs well is better than fixing many bugs poorly.
- The fake API resets on page refresh. This is documented behavior, not a bug; explain why you consider other reported behavior a bug.
