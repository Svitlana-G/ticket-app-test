# CopilotKit Frontend Engineering Assessment

## Context

You're receiving a ticketing application built by a previous developer. The app is functional but has bugs — some obvious, some subtle. You're also receiving a product brief with stakeholder input that contains contradictions, and a component (`REVIEW_ME.tsx`) to review.

Your job is to demonstrate engineering judgment: find and fix bugs systematically, evaluate code critically, and make defensible product decisions when requirements conflict.

**You are expected to use whatever tools you normally use**, including AI coding assistants. How you direct and evaluate automated work is part of what we're assessing.

## Scope — Tier 1: Core only

- Investigate and aim to fix the **3 most critical bugs** you find in the application
- Submit a written review of `src/REVIEW_ME.tsx` with severity ratings and reasoning
- Submit a decision document resolving the contradictions in `BRIEF.md`, with reasoning

Three fixes describe the target scope, not a completion threshold. No additional
features, shared-package technical plan, or fake API extensions are required.

## Time Budget

Plan for **2–3 hours total**, including setup, investigation, implementation,
and notes. Stop by three hours and submit what you have.

**Full completion is not expected. An honest partial answer is better than a
complete answer that you cannot explain.** Record blockers, hypotheses,
unsuccessful attempts, and unfinished work.

## Deliverables

Submit a public clone of the repository (or a patch), with the following files
to the extent reached within the timebox. Do not send exercise solutions as
pull requests to the upstream repository.

| File | What to include |
|------|----------------|
| `BUGS.md` | Bugs found with: root cause explanation, reproduction steps, your fix, and before/after test cases |
| `REVIEW.md` | Written review of `REVIEW_ME.tsx` with severity ratings for each issue found |
| `DECISIONS.md` | How you resolve each contradiction in `BRIEF.md`, with reasoning |
| Code changes | Your focused fixes and tests |
| `NOTES.md` | Time spent and a brief chronological thinking log: attempts, blockers, priorities, assumptions, rejected alternatives, remaining work, and AI/tool use with how you checked the results. Full chat transcripts are not required. |
| Screen recording | **Optional.** You may use a recording with voice comments instead of the thinking log in `NOTES.md`. Show your working process, not just a demo. |

## Scoring

We evaluate your submission across these dimensions:

| Dimension | Weight | What we look for |
|-----------|--------|-----------------|
| Bug diagnosis quality | 25% | Root cause accuracy, systematic approach, reproduction steps |
| Code review depth | 20% | Finding real issues, severity calibration, actionable feedback |
| Decision document | 20% | Noticed contradictions, defensible tradeoffs, clear reasoning |
| Implementation quality | 15% | Correctness, edge case handling, clean code |
| Test quality | 10% | Tests cover actual risk areas, not just happy paths |
| Communication | 10% | Tradeoff clarity, self-assessment honesty, writing quality |

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

- Keep to the **2–3-hour timebox**; setup and documentation count toward it.
- If you choose to record, work naturally and narrate your thinking; recording is not required.
- If you find more than three bugs, document them. Fixing fewer bugs well is better than fixing many bugs poorly.
- AI tools are allowed. Be ready to explain your reasoning and how you verified your findings and code changes in a follow-up call.
- The fake API resets on page refresh. This is by design, not a bug.
