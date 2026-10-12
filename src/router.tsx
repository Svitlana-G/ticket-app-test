import { createBrowserRouter, createMemoryRouter, RouteObject } from 'react-router-dom';
import { App } from './App';
import { RouteErrorFallback } from './components/RouteErrorFallback';
import { TicketDetailPage } from './pages/TicketDetailPage';
import { TicketsListPage } from './pages/TicketsListPage';
export function buildAppRoutes(): RouteObject[] {
  return [
    {
      path: '/',
      element: <App />,
      children: [
        {
          // Render route errors (e.g. an invalid ticket ID) inside the app layout
          errorElement: <RouteErrorFallback />,
          children: [
            {
              index: true,
              element: <TicketsListPage />,
            },
            {
              path: 'tickets/:ticketId',
              element: <TicketDetailPage />,
            },
          ],
        },
      ],
    },
  ];
}

export function createAppRouter() {
  return createBrowserRouter(buildAppRoutes());
}

export function createTestRouter(initialEntries: string[]) {
  return createMemoryRouter(buildAppRoutes(), {
    initialEntries,
  });
}
