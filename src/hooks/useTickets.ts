import { useCallback, useEffect, useRef, useState } from "react";
import { Ticket } from "../lib/types";
import { demoApi } from "../lib/fakeApi";
import { useSearchParams } from "react-router-dom";

const SEARCH_DEBOUNCE_MS = 300;

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const controllerRef = useRef<AbortController | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get("assignee");
  const parsed = raw ? Number(raw) : NaN;
  const assigneeFilter = Number.isInteger(parsed) ? parsed : null;

  const setAssigneeFilter = useCallback(
    (id: number | null) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (id === null) next.delete("assignee");
        else next.set("assignee", String(id));
        return next;
      });
    },
    [setSearchParams],
  );

  useEffect(() => {
    const timerId = window.setTimeout(
      () => setDebouncedSearch(search),
      SEARCH_DEBOUNCE_MS,
    );
    return () => window.clearTimeout(timerId);
  }, [search]);

  // Stable between renders; only changes when the applied filters change.
  const refetch = useCallback(() => {
    // Cancel any in-flight request so a stale response can't overwrite a newer one
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);

    demoApi
      .listTickets({ signal: controller.signal })
      .then((data) => {
        // Apply filters client-side after fetch
        const filtered = data.filter((ticket) => {
          const matchesSearch =
            debouncedSearch === "" ||
            ticket.description
              .toLowerCase()
              .includes(debouncedSearch.toLowerCase());
          const matchesAssignee =
            assigneeFilter === null || ticket.assigneeId === assigneeFilter;
          return matchesSearch && matchesAssignee;
        });
        setTickets(filtered);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setLoading(false);
      });
  }, [debouncedSearch, assigneeFilter]);

  useEffect(() => {
    refetch();
    return () => controllerRef.current?.abort();
  }, [refetch]);

  return {
    tickets,
    setTickets,
    loading,
    error,
    search,
    setSearch,
    assigneeFilter,
    setAssigneeFilter,
    refetch,
  };
}
