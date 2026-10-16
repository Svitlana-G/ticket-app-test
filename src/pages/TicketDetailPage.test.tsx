import { StrictMode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterProvider } from "react-router-dom";
import { createTestRouter } from "../router";
import { within } from "@testing-library/react";

vi.mock("../lib/fakeApi", async () => {
  const actual =
    await vi.importActual<typeof import("../lib/fakeApi")>("../lib/fakeApi");
  const api = actual.createFakeTicketingApi({
    delayRangeMs: [0, 0],
    failureRate: 0,
  });
  return { ...actual, demoApi: api };
});

describe("TicketDetailPage", () => {
  it("renders ticket details after loading", async () => {
    const router = createTestRouter(["/tickets/1"]);
    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText("Install a monitor arm")).toBeInTheDocument();
    });

    expect(screen.getAllByText(/victor/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Open")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to list/i }),
    ).toBeInTheDocument();
  });

  it("shows error for non-existent ticket", async () => {
    const router = createTestRouter(["/tickets/999"]);
    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByText(/ticket not found/i)).toBeInTheDocument();
    });
  });

  it("allows assigning a ticket", async () => {
    const user = userEvent.setup();
    const router = createTestRouter(["/tickets/3"]);
    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(
        screen.getByText("Replace the office keyboard"),
      ).toBeInTheDocument();
    });

    const select = screen.getByRole("combobox", { name: /assign/i });
    await user.selectOptions(select, "111");

    await waitFor(() => {
      expect(screen.getAllByText(/victor/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  it("loads the ticket under StrictMode (effects run twice)", async () => {
    const router = createTestRouter(["/tickets/1"]);
    render(
      <StrictMode>
        <RouterProvider router={router} />
      </StrictMode>,
    );

    await waitFor(() => {
      expect(screen.getByText("Install a monitor arm")).toBeInTheDocument();
    });
  });

  it("shows the route error fallback for an invalid ticket ID", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const router = createTestRouter(["/tickets/abc"]);
    render(<RouterProvider router={router} />);

    expect(await screen.findByText("Invalid ticket ID")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /back to list/i }),
    ).toBeInTheDocument();
    vi.restoreAllMocks();
  });

  it("keeps the list filter in the Back to list link", async () => {
    const user = userEvent.setup();
    const router = createTestRouter(["/?assignee=111"]);
    render(<RouterProvider router={router} />);

    const row = (await screen.findByText("Install a monitor arm")).closest(
      "li",
    )!;
    await user.click(within(row).getByRole("link", { name: /view details/i }));

    await screen.findByText("Open");

    expect(screen.getByRole("link", { name: /back to list/i })).toHaveAttribute(
      "href",
      "/?assignee=111",
    );
  });
});
