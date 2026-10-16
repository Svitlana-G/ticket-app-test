# NOTES

## Setup

- Based on commit `fd6c1bf`.
- Run: `npm install && npm run dev`

## What happened

The repo contained a commit (`fd6c1bf`) with an internal BUGS.md listing the fixes. I reported it to the organizers. They confirmed it was a mistake. Bug fixing was dropped; my task became two new features on my current version.

## Time

- ~2h on the original task (setup, exploring the app, reading code and BRIEF.md, one fix).
- ~1h on the new task

## Before the task changed

- Reproduced on the buggy commit (`5a43232`): duplicate ticket ID (`/tickets/3`), detail page stuck on "Loading...", flickering "Error: Fake API request failed" on the list.
- Fixed only the duplicate ID (branch `solution`): `lastId` starts from the max seeded ID. My first version used the last array item, which breaks for unsorted data, so I added a test for that.

## Feature 1: assignee filter in the URL

- Why: Sarah wants shareable links, Aisha wants the filter to survive "details -> back".
- How: `?assignee=111` via `useSearchParams`; the URL is the only source of truth. "Back to list" restores the filter (query passed via router state).
- Tests: filter read from URL, invalid values, "Back to list" keeps the filter. `npm test` and build pass.

## Feature 2: Retry button on the ticket details page

- Not implemented. Idea: when loading a ticket fails (simulated 8% API failures), the page is a dead end with only "Back to list". A Retry button using the hook's existing `refetch` would fix it.

## Not done

- Only one feature was completed. I decided to stop at one feature given the time limit.
- Search is not in the URL (only the assignee filter).
- DECISIONS.md and REVIEW.md were not written.

## AI usage

- Delegated: summarising the brief, code review and drafting tests
