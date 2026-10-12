import { Link } from 'react-router-dom';
import { Ticket, User } from '../lib/types';

type TicketRowProps = {
  ticket: Ticket;
  users: User[];
  onToggleStatus: (ticketId: number, completed: boolean) => void;
  pending?: boolean;
};

export function TicketRow({ ticket, users, onToggleStatus, pending = false }: TicketRowProps) {
  const assignee = users.find((u) => u.id === ticket.assigneeId);
  const assigneeLabel = ticket.assigneeId === null
    ? 'Unassigned'
    : assignee?.name ?? `User #${ticket.assigneeId}`;

  return (
    <li>
      <p>
        <strong>{ticket.description}</strong>
      </p>
      <p>Status: {ticket.completed ? 'Completed' : 'Open'}</p>
      <p>Assignee: {assigneeLabel}</p>
      <p>
        <button
          type="button"
          onClick={() => onToggleStatus(ticket.id, !ticket.completed)}
          disabled={pending}
        >
          {ticket.completed ? 'Reopen' : 'Complete'}
        </button>{' '}
        <Link to={`/tickets/${ticket.id}`}>View details</Link>
      </p>
    </li>
  );
}
