import api from "@/api/client";
import {
    getUnreadNotifications,
    getAllNotifications,
    requestAccessToList,
    respondToAccessRequest,
} from "@/api/notifications";

vi.mock("@/api/client", () => ({
    default: { get: vi.fn(), post: vi.fn() },
}));

describe("api/notifications", () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it("getUnreadNotifications calls the right endpoint and unwraps the response", async () => {
        api.get.mockResolvedValueOnce({
            data: { unread_notifications: [{ id: 1 }] },
        });

        const result = await getUnreadNotifications();

        expect(api.get).toHaveBeenCalledWith("/notifications/unread");
        expect(result).toEqual([{ id: 1 }]);
    });

    it("getAllNotifications calls the right endpoint and unwraps the response", async () => {
        api.get.mockResolvedValueOnce({
            data: { notifications: [{ id: 2 }] },
        });

        const result = await getAllNotifications();

        expect(api.get).toHaveBeenCalledWith("/notifications/all");
        expect(result).toEqual([{ id: 2 }]);
    });

    it("requestAccessToList posts to the correct URL", async () => {
        api.post.mockResolvedValueOnce({ data: {} });

        await requestAccessToList(5, 9);

        expect(api.post).toHaveBeenCalledWith(
            "/notifications/request-access/5/9"
        );
    });

    it("respondToAccessRequest posts the response body to the correct URL", async () => {
        api.post.mockResolvedValueOnce({ data: {} });

        await respondToAccessRequest(3, 9, "accepté");

        expect(api.post).toHaveBeenCalledWith(
            "/notifications/respond-access/3/9",
            { response: "accepté" }
        );
    });
});
