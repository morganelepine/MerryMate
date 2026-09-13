import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RequestButtons from "@/Components/Profile/Notifications/Utils/RequestButtons";
import { respondToAccessRequest } from "@/api/notifications";

vi.mock("@/api/notifications", () => ({
    respondToAccessRequest: vi.fn(),
}));

vi.mock("sonner", () => ({
    toast: { error: vi.fn(), success: vi.fn(), info: vi.fn() },
}));

const notification = {
    id: 42,
    data: { listId: 7, requestingUser: "Alice", listToFollow: "Noël" },
};

describe("RequestButtons", () => {
    const reload = vi.fn();

    beforeAll(() => {
        Object.defineProperty(window, "location", {
            configurable: true,
            value: { ...window.location, reload },
        });
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("accepts a request and reloads the page on success", async () => {
        respondToAccessRequest.mockResolvedValueOnce({});
        render(<RequestButtons notification={notification} />);

        fireEvent.click(screen.getByRole("button", { name: /accepter/i }));

        await waitFor(() => {
            expect(respondToAccessRequest).toHaveBeenCalledWith(
                42,
                7,
                "accepté"
            );
        });
        await waitFor(() => expect(window.location.reload).toHaveBeenCalled());
    });

    it("declines a request", async () => {
        respondToAccessRequest.mockResolvedValueOnce({});
        render(<RequestButtons notification={notification} />);

        fireEvent.click(screen.getByRole("button", { name: /refuser/i }));

        await waitFor(() => {
            expect(respondToAccessRequest).toHaveBeenCalledWith(
                42,
                7,
                "décliné"
            );
        });
    });

    it("shows an error toast and does not reload when the request fails", async () => {
        const { toast } = await import("sonner");
        respondToAccessRequest.mockRejectedValueOnce(new Error("network"));
        render(<RequestButtons notification={notification} />);

        fireEvent.click(screen.getByRole("button", { name: /accepter/i }));

        await waitFor(() => expect(toast.error).toHaveBeenCalled());
        expect(window.location.reload).not.toHaveBeenCalled();
    });

    it("shows the outcome instead of the buttons once a response was recorded", () => {
        render(
            <RequestButtons
                notification={{
                    ...notification,
                    data: { ...notification.data, response: "accepté" },
                }}
            />
        );

        expect(
            screen.queryByRole("button", { name: /accepter/i })
        ).toBeNull();
        expect(
            screen.getByText(/vous avez accepté la demande/i)
        ).toBeInTheDocument();
    });
});
