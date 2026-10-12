import { useCallback, useEffect, useRef, useState } from 'react';
import { Ticket } from '../lib/types';
import { demoApi } from '../lib/fakeApi';

export function useTicket(ticketId: number) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const refetch = useCallback(() => {
    // Cancel any in-flight request so a stale response can't overwrite a newer one
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);
    setTicket(null);

    demoApi.getTicket(ticketId, { signal: controller.signal })
      .then((data) => {
        setTicket(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setLoading(false);
      });
  }, [ticketId]);

  useEffect(() => {
    // Invalid IDs are rejected by the page; don't fire a request for them
    if (!Number.isInteger(ticketId)) return;

    refetch();
    return () => controllerRef.current?.abort();
  }, [ticketId, refetch]);

  return { ticket, setTicket, loading, error, refetch };
}
