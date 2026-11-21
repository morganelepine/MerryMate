import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ListToFollow from "@/Components/GiftList/User/ListToFollow/ListToFollowCard";
import { requestAccessToList } from "@/api/notifications";

vi.mock("@/api/notifications", () => ({
    requestAccessToList: vi.fn(),
}));

vi.mock("sonner", () => ({
    toast: { error: vi.fn(), success: vi.fn() },
}));

const listToFollow = {
    id: 3,
    user_id: 9,
    name: "Noël",
    user_name: "Bob",
    user_lastname: "Martin",
    isEmpty: true,
    formatted_created_at: "01/01/2026",
};

const requestButton = () =>
    screen.getByRole("button", { name: /demande/i });

describe("ListToFollowCard", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("sends an access request and persists it in localStorage on success", async () => {
        requestAccessToList.mockResolvedValueOnce({});
        render(<ListToFollow listToFollow={listToFollow} />);

        fireEvent.click(requestButton());

        await waitFor(() => {
            expect(requestAccessToList).toHaveBeenCalledWith(9, 3);
        });
        expect(localStorage.getItem("requestSent-3")).toBe("true");
    });

    it("disables the button immediately, before the request even resolves", () => {
        requestAccessToList.mockReturnValue(new Promise(() => {}));
        render(<ListToFollow listToFollow={listToFollow} />);

        fireEvent.click(requestButton());

        expect(requestButton()).toBeDisabled();
    });

    it("re-enables the button and shows an error toast when the request fails", async () => {
        const { toast } = await import("sonner");
        requestAccessToList.mockRejectedValueOnce(new Error("network"));
        render(<ListToFollow listToFollow={listToFollow} />);

        fireEvent.click(requestButton());

        await waitFor(() => expect(toast.error).toHaveBeenCalled());
        expect(requestButton()).not.toBeDisabled();
        expect(localStorage.getItem("requestSent-3")).toBeNull();
    });

    it("restores the disabled state from localStorage on mount", () => {
        localStorage.setItem("requestSent-3", "true");
        render(<ListToFollow listToFollow={listToFollow} />);

        expect(requestButton()).toBeDisabled();
    });
});
