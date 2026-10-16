import { renderHook, waitFor, act } from "@testing-library/react";
import { useTickets } from "./useTickets";
import { createElement, ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

const wrapper = ({ children }: { children: ReactNode }) =>
  createElement(MemoryRouter, null, children);

const makeWrapper =
  (initialEntries: string[] = ["/"]) =>
  ({ children }: { children: ReactNode }) =>
    createElement(MemoryRouter, { initialEntries }, children);

vi.mock("../lib/fakeApi", async () => {
  const actual =
    await vi.importActual<typeof import("../lib/fakeApi")>("../lib/fakeApi");
  const api = actual.createFakeTicketingApi({
    delayRangeMs: [0, 0],
    failureRate: 0,
  });
  return { ...actual, demoApi: api };
});

describe("useTickets", () => {
  it("fetches and returns tickets", async () => {
    const { result } = renderHook(() => useTickets(), { wrapper });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.tickets).toHaveLength(3);
    expect(result.current.error).toBeNull();
  });

  it("filters tickets by search text", async () => {
    const { result } = renderHook(() => useTickets(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setSearch("monitor");
    });

    await waitFor(() => {
      expect(result.current.tickets).toHaveLength(1);
      expect(result.current.tickets[0].description).toContain("monitor");
    });
  });

  it("filters tickets by assigneeId", async () => {
    const { result } = renderHook(() => useTickets(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setAssigneeFilter(111);
    });

    await waitFor(() => {
      expect(result.current.tickets).toHaveLength(1);
      expect(result.current.tickets[0].assigneeId).toBe(111);
    });
  });

  it("reads the assignee filter from the URL", async () => {
    const { result } = renderHook(() => useTickets(), {
      wrapper: makeWrapper(["/?assignee=111"]),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.assigneeFilter).toBe(111);
    expect(result.current.tickets).toHaveLength(1);
    expect(result.current.tickets[0].assigneeId).toBe(111);
  });

  it.each(["abc", "1.5", ""])(
    "ignores an invalid assignee param (%j)",
    async (value) => {
      const { result } = renderHook(() => useTickets(), {
        wrapper: makeWrapper([`/?assignee=${value}`]),
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.assigneeFilter).toBeNull();
      expect(result.current.tickets).toHaveLength(3);
    },
  );
});
