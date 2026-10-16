import { Link, useLocation, useParams } from "react-router-dom";
import { useTicket } from "../hooks/useTicket";
import { useUsers } from "../hooks/useUsers";
import { demoApi } from "../lib/fakeApi";
import { useState } from "react";

export function TicketDetailPage() {
  const { ticketId } = useParams();
  const numericId = Number(ticketId);
  const { ticket, setTicket, loading, error } = useTicket(numericId);
  const { users, error: usersError, refetch: refetchUsers } = useUsers();
  const [mutating, setMutating] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const location = useLocation();
  const listSearch =
    (location.state as { listSearch?: string } | null)?.listSearch ?? "";

  const backLink = (
    <p>
      <Link to={{ pathname: "/", search: listSearch }}>Back to list</Link>
    </p>
  );

  if (!Number.isInteger(numericId)) {
    throw new Error("Invalid ticket ID");
  }

  if (loading) {
    return (
      <section>
        <h2>Ticket details</h2>
        <p>Loading...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <h2>Ticket details</h2>
        <p role="alert">Error: {error}</p>
        {backLink}
      </section>
    );
  }

  if (!ticket) {
    return (
      <section>
        <h2>Ticket details</h2>
        <p>Ticket not found</p>
        {backLink}
      </section>
    );
  }

  const assignee =
    ticket.assigneeId !== null
      ? users.find((u) => u.id === ticket.assigneeId)
      : null;
  const assigneeLabel =
    ticket.assigneeId === null
      ? "Unassigned"
      : (assignee?.name ?? `User #${ticket.assigneeId}`);

  const handleAssign = async (userId: number) => {
    setMutating(true);
    setMutationError(null);
    try {
      // Use the server-confirmed ticket instead of refetching
      setTicket(await demoApi.assignTicket(ticket.id, userId));
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : "Failed to assign");
    } finally {
      setMutating(false);
    }
  };

  const handleToggleStatus = async () => {
    setMutating(true);
    setMutationError(null);
    try {
      setTicket(await demoApi.updateTicketStatus(ticket.id, !ticket.completed));
    } catch (err) {
      setMutationError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setMutating(false);
    }
  };

  return (
    <section>
      <h2>Ticket details</h2>
      <dl>
        <dt>Description</dt>
        <dd>{ticket.description}</dd>
        <dt>Status</dt>
        <dd>{ticket.completed ? "Completed" : "Open"}</dd>
        <dt>Assignee</dt>
        <dd>{assigneeLabel}</dd>
      </dl>

      <div>
        <button type="button" onClick={handleToggleStatus} disabled={mutating}>
          {ticket.completed ? "Reopen" : "Complete"}
        </button>{" "}
        <label>
          Assign to{" "}
          <select
            value={ticket.assigneeId ?? ""}
            onChange={(e) => {
              if (e.target.value) handleAssign(Number(e.target.value));
            }}
            disabled={mutating}
          >
            {/* The API has no "unassign" operation, so this can't be picked once assigned */}
            <option value="" disabled={ticket.assigneeId !== null}>
              Unassigned
            </option>
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
          Failed to load users.{" "}
          <button type="button" onClick={refetchUsers}>
            Retry
          </button>
        </p>
      )}
      {mutationError && <p role="alert">{mutationError}</p>}
      {backLink}
    </section>
  );
}
