# Bugs

Ordered by severity. Bugs 1–3 are the critical ones; the rest were fixed because they were small or touched the same code.

All tests: `npm test` (30 passing). Each "Test" below was run against the original code (fails) and the fixed code (passes).

---

## 1. Polling intervals leak and multiply (list page) — Critical

**Symptom.** After touching the assignee dropdown (or anything that re-renders the list), the page starts refreshing more and more often. Every ~5s the list can also flip back to the results of an *old* filter. Requests continue after navigating away.

**Root cause.** `src/pages/TicketsListPage.tsx`:

```ts
useEffect(() => {
  pollRef.current = window.setInterval(() => refetch(), 5000);
}, [refetch]);
```

- `refetch` was a new function on every render, so the effect re-ran on every render.
- The effect had no cleanup, so each run added an interval and never cleared the old ones.
- Each `refetch` triggers several state updates → several renders → several more intervals. Growth is exponential.
- Each interval closes over the `refetch` (and therefore `search` / `assigneeFilter`) of the render it was created in, so old intervals keep applying stale filters.

**Repro.** `npm run dev`, open `/`, change the Assignee dropdown a few times, watch the Network/console activity grow and the list flicker between filter results.

**Fix.**
- `useTickets.refetch` is memoised with `useCallback([debouncedSearch, assigneeFilter])`.
- The poll effect returns `clearInterval`, so exactly one interval is running, bound to the current filters.
- `refetch` aborts the previous in-flight request, so out-of-order responses can't overwrite newer data.

**Test.** `TicketsListPage.test.tsx` › *keeps a single polling interval across re-renders and clears it on unmount*: before, many intervals active and still active after unmount; after, 1 active, 0 after unmount.

---

## 2. Ticket detail page stuck on "Loading..." (dev / StrictMode) — Critical

**Symptom.** Clicking "View details" in `npm run dev` shows "Loading..." forever.

**Root cause.** `src/hooks/useTicket.ts` created the `AbortController` in the render body instead of inside the effect. React StrictMode mounts → unmounts → re-mounts effects using the *same* render closure: the cleanup aborts the controller, the second run reuses that already-aborted signal, the API rejects immediately with `AbortError`, which is silently ignored. `loading` never becomes `false`. Existing tests didn't render with `StrictMode`, so they passed.

**Repro.** `npm run dev`, open `/`, click "View details" on any ticket.

**Fix.** The controller is created per request inside `refetch` (stored in a ref, previous one aborted); the effect calls `refetch` and aborts on cleanup. Invalid IDs don't fire a request.

**Test.** `TicketDetailPage.test.tsx` › *loads the ticket under StrictMode*: before, stuck on "Loading..."; after, ticket rendered.

---

## 3. New tickets get a duplicate ID — Critical

**Symptom.** The first ticket you create gets id `3`, which already exists. React warns about duplicate keys, and "View details" on the new ticket opens the old ticket #3.

**Root cause.** `src/lib/fakeApi.ts` hard-coded `let lastId = 2` while the seed data contains a ticket with id `3`.

**Repro.** Create a ticket, click its "View details" → "Replace the office keyboard" is shown.

**Fix.** `lastId` is initialised to the max ID in the seeded tickets.

**Test.** `fakeApi.test.ts` › *assigns new tickets an ID that does not collide*: before, IDs `1,2,3,3`; after, new ID `4`, all unique.

---

## Other bugs fixed

| # | Bug | Root cause | Fix | Test |
|---|-----|-----------|-----|------|
| 4 | Complete/Reopen on the list shows success even when the server fails | Optimistic update with `.catch(() => {})`, no rollback or message | Update the row only with the server response; disable the button while pending; show an error on failure | *does not change the status and shows an error when the update fails* |
| 5 | Unassigned tickets show "User null" | Template string on `null` assignee (an existing test asserted this) | Show "Unassigned" | `TicketRow.test.tsx` › *shows "Unassigned"* |
| 6 | Detail page flashes "Loading..." after every action and can show an error although the action succeeded | Mutation success called `refetch()`, which resets the page and can fail independently (8%) | Use the ticket returned by the mutation | existing *allows assigning a ticket* |
| 7 | `/tickets/abc` shows React Router's default crash screen | `RouteErrorFallback` existed but no `errorElement` was configured | Added `errorElement` inside the app layout | *shows the route error fallback for an invalid ticket ID* |
| 8 | Failed user load is silent (empty dropdowns, "User 111") | `useUsers` error never rendered, no retry | Show message with Retry on both pages | manual |
| 9 | Search fires a request on every keystroke | No debounce | 300 ms debounce in `useTickets` | existing search tests |
| 10 | Choosing "Unassigned" on the detail page does nothing | API has no unassign operation | Option disabled once a ticket is assigned | manual |
| 11 | `npm run build` fails type-check | After upgrading to vitest 5, `defineConfig` from `vite` doesn't know the `test` key | Import `defineConfig` from `vitest/config` | `npx tsc --noEmit` clean |

## Not bugs / not changed

- Random latency, the 8% failure rate and data reset on refresh are documented fake-API behavior.
- `REVIEW_ME.tsx` is not wired into the app; it's covered in the review, not fixed.
- Filtering is still done client-side after fetching the full list: the fake API has no server-side filtering.
