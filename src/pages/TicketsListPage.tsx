import { useEffect, useState } from 'react';
import { useTickets } from '../hooks/useTickets';
import { useUsers } from '../hooks/useUsers';
import { TicketRow } from '../components/TicketRow';
import { AddTicketForm } from '../components/AddTicketForm';
import { demoApi } from '../lib/fakeApi';

const POLL_INTERVAL_MS = 5000;

export function TicketsListPage() {
  const {
    tickets,
    setTickets,
    loading,
    error,
    search,
    setSearch,
    assigneeFilter,
    setAssigneeFilter,
    refetch,
  } = useTickets();
  const { users, error: usersError, refetch: refetchUsers } = useUsers();
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());
  const [actionError, setActionError] = useState<string | null>(null);

  // Poll for fresh data every 5 seconds
  useEffect(() => {
    const intervalId = window.setInterval(refetch, POLL_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [refetch]);

  const handleToggleStatus = async (ticketId: number, completed: boolean) => {
    setPendingIds((prev) => new Set(prev).add(ticketId));
    setActionError(null);

    try {
      // Only update the UI once the server has confirmed the change
      const updated = await demoApi.updateTicketStatus(ticketId, completed);
      setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Failed to update ticket');
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(ticketId);
        return next;
      });
    }
  };

  return (
    <section>
      <h2>Ticket list</h2>

      <AddTicketForm onTicketAdded={refetch} />

      <div>
        <label>
          Search{' '}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets"
          />
        </label>{' '}
        <label>
          Assignee{' '}
          <select
            value={assigneeFilter ?? ''}
            onChange={(e) =>
              setAssigneeFilter(
                e.target.value ? Number(e.target.value) : null,
              )
            }
          >
            <option value="">All assignees</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {usersError && (
        <p role="alert">
          Failed to load users.{' '}
          <button type="button" onClick={refetchUsers}>Retry</button>
        </p>
      )}

      {loading && tickets.length === 0 && <p>Loading tickets...</p>}
      {error && <p role="alert">Error: {error}</p>}
      {actionError && <p role="alert">Could not update ticket: {actionError}</p>}

      {!loading && !error && tickets.length === 0 && (
        <p>No tickets match your filters.</p>
      )}

      <ul>
        {tickets.map((ticket) => (
          <TicketRow
            key={ticket.id}
            ticket={ticket}
            users={users}
            onToggleStatus={handleToggleStatus}
            pending={pendingIds.has(ticket.id)}
          />
        ))}
      </ul>
    </section>
  );
}
