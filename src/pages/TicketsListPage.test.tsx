import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider } from 'react-router-dom';
import { createTestRouter } from '../router';
import { demoApi } from '../lib/fakeApi';

vi.mock('../lib/fakeApi', async () => {
  const actual = await vi.importActual<typeof import('../lib/fakeApi')>('../lib/fakeApi');
  const api = actual.createFakeTicketingApi({
    delayRangeMs: [0, 0],
    failureRate: 0,
  });
  return { ...actual, demoApi: api };
});

describe('TicketsListPage', () => {
  it('renders ticket list after loading', async () => {
    const router = createTestRouter(['/']);
    render(<RouterProvider router={router} />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Install a monitor arm')).toBeInTheDocument();
    });

    expect(screen.getByText('Move the desk to the new location')).toBeInTheDocument();
    expect(screen.getByText('Replace the office keyboard')).toBeInTheDocument();
  });

  it('filters tickets by search text', async () => {
    const user = userEvent.setup();
    const router = createTestRouter(['/']);
    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText('Install a monitor arm')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, 'monitor');

    await waitFor(() => {
      expect(screen.getByText('Install a monitor arm')).toBeInTheDocument();
      expect(screen.queryByText('Move the desk to the new location')).not.toBeInTheDocument();
    });
  });

  it('filters tickets by assignee', async () => {
    const user = userEvent.setup();
    const router = createTestRouter(['/']);
    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText('Install a monitor arm')).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox', { name: /assignee/i });
    await user.selectOptions(select, '111');

    await waitFor(() => {
      expect(screen.getByText('Install a monitor arm')).toBeInTheDocument();
      expect(screen.queryByText('Move the desk to the new location')).not.toBeInTheDocument();
    });
  });

  it('keeps a single polling interval across re-renders and clears it on unmount', async () => {
    const user = userEvent.setup();
    const active = new Set<number>();
    const realSetInterval = window.setInterval;
    const realClearInterval = window.clearInterval;
    vi.spyOn(window, 'setInterval').mockImplementation(((handler: TimerHandler, timeout?: number) => {
      const id = realSetInterval(handler, timeout);
      if (timeout === 5000) active.add(id);
      return id;
    }) as typeof window.setInterval);
    vi.spyOn(window, 'clearInterval').mockImplementation((id?: number) => {
      if (id !== undefined) active.delete(id);
      realClearInterval(id);
    });

    const router = createTestRouter(['/']);
    const { unmount } = render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText('Install a monitor arm')).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox', { name: /assignee/i });
    await user.selectOptions(select, '111');
    await user.selectOptions(select, '222');
    await user.selectOptions(select, '');

    expect(active.size).toBe(1);

    unmount();
    expect(active.size).toBe(0);
    vi.restoreAllMocks();
  });

  it('does not change the status and shows an error when the update fails', async () => {
    const user = userEvent.setup();
    vi.spyOn(demoApi, 'updateTicketStatus').mockRejectedValueOnce(new Error('Server rejected'));

    const router = createTestRouter(['/']);
    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText('Install a monitor arm')).toBeInTheDocument();
    });

    const [firstRow] = screen.getAllByRole('listitem');
    await user.click(within(firstRow).getByRole('button', { name: 'Complete' }));

    expect(await screen.findByText(/could not update ticket: server rejected/i)).toBeInTheDocument();
    expect(within(firstRow).getByText('Status: Open')).toBeInTheDocument();
    vi.restoreAllMocks();
  });
});
