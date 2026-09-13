import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ListToFollow from "@/Components/GiftList/User/ListToFollow/ListToFollowCard";
import { requestAccessToList } from "@/api/notifications";

vi.mock("@/api/notifications", () => ({
    requestAccessToList: vi.fn(),
}));

vi.mock("sonner", () => ({
    toast: { error: vi.fn(), success: vi.fn() },
}));

const auth = { user: { id: 1, name: "Alice" } };
const listToFollow = {
    id: 3,
    user_id: 9,
    name: "Noël",
    user_name: "Bob",
    user_lastname: "Martin",
    isEmpty: true,
    formatted_created_at: "01/01/2026",
};

describe("ListToFollowCard", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("sends an access request and persists it in localStorage on success", async () => {
        requestAccessToList.mockResolvedValueOnce({});
        render(<ListToFollow auth={auth} listToFollow={listToFollow} />);

        fireEvent.click(screen.getByText("Demander un accès"));

        await waitFor(() => {
            expect(requestAccessToList).toHaveBeenCalledWith(9, 3);
        });
        expect(localStorage.getItem("requestSent-3")).toBe("true");
    });

    it("disables the button immediately, before the request even resolves", () => {
        requestAccessToList.mockReturnValue(new Promise(() => {}));
        render(<ListToFollow auth={auth} listToFollow={listToFollow} />);

        fireEvent.click(screen.getByText("Demander un accès"));

        expect(screen.getByText("Demander un accès")).toBeDisabled();
    });

    it("re-enables the button and shows an error toast when the request fails", async () => {
        const { toast } = await import("sonner");
        requestAccessToList.mockRejectedValueOnce(new Error("network"));
        render(<ListToFollow auth={auth} listToFollow={listToFollow} />);

        fireEvent.click(screen.getByText("Demander un accès"));

        await waitFor(() => expect(toast.error).toHaveBeenCalled());
        expect(screen.getByText("Demander un accès")).not.toBeDisabled();
        expect(localStorage.getItem("requestSent-3")).toBeNull();
    });

    it("restores the disabled state from localStorage on mount", () => {
        localStorage.setItem("requestSent-3", "true");
        render(<ListToFollow auth={auth} listToFollow={listToFollow} />);

        expect(screen.getByText("Demander un accès")).toBeDisabled();
    });
});
