import { render, screen, fireEvent } from "@testing-library/react";
import ListActions from "@/Components/GiftList/Action/ListActions";

const { destroy } = vi.hoisted(() => ({ destroy: vi.fn() }));

vi.mock("@inertiajs/react", () => ({
    Link: ({ children }) => children,
    useForm: () => ({ delete: destroy, processing: false }),
}));

vi.mock("sonner", () => ({
    toast: { error: vi.fn(), success: vi.fn() },
}));

const list = { id: 7 };
const followers = [
    { id: 1, name: "Alice", last_name: "Martin" },
    { id: 2, name: "Bob", last_name: null },
];

const openModal = async () => {
    fireEvent.click(screen.getByRole("button", { name: /abonné·e·s/i }));
    await screen.findByRole("dialog");
};

describe("ListActions", () => {
    beforeAll(() => {
        globalThis.route = (name, { list, follower }) =>
            `${name}/${list}/${follower}`;
        globalThis.ResizeObserver ??= class {
            observe() {}
            unobserve() {}
            disconnect() {}
        };
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("lists the followers", async () => {
        render(<ListActions list={list} followers={followers} canArchive />);
        await openModal();

        expect(screen.getByText("2 personnes suivent ta liste")).toBeTruthy();
        expect(screen.getByText("Alice Martin")).toBeTruthy();
        expect(screen.getByText("Bob")).toBeTruthy();
    });

    it("shows an empty state", async () => {
        render(<ListActions list={list} followers={[]} canArchive />);
        await openModal();

        expect(
            screen.getByText("Personne ne suit ta liste pour le moment"),
        ).toBeTruthy();
    });

    it("asks for confirmation, then removes the follower and moves the focus to the title", async () => {
        destroy.mockImplementation((url, { onSuccess }) => onSuccess());
        render(<ListActions list={list} followers={followers} canArchive />);
        await openModal();

        fireEvent.click(
            screen.getByRole("button", { name: "Retirer Alice Martin" }),
        );
        expect(destroy).not.toHaveBeenCalled();

        fireEvent.click(screen.getByRole("button", { name: "Retirer" }));

        expect(destroy).toHaveBeenCalledWith(
            "lists.removeFollower/7/1",
            expect.objectContaining({ only: ["followers"] }),
        );
        expect(document.activeElement.textContent).toBe(
            "2 personnes suivent ta liste",
        );
    });

    it("opens the same modals from the small screen menu", async () => {
        render(<ListActions list={list} followers={followers} canArchive />);

        fireEvent.click(screen.getByRole("button", { name: "Autres actions" }));
        expect(
            screen.getAllByRole("menuitem").map((item) => item.textContent),
        ).toEqual(["Partager", "Abonné·e·s 2", "Archiver"]);

        fireEvent.click(screen.getByRole("menuitem", { name: "Archiver" }));
        await screen.findByRole("dialog", { name: /archiver cette liste/i });
    });

    it("hides the archive action when there is nothing to archive", () => {
        render(
            <ListActions
                list={list}
                followers={followers}
                canArchive={false}
            />,
        );

        fireEvent.click(screen.getByRole("button", { name: "Autres actions" }));
        expect(screen.queryByText("Archiver")).toBeNull();
    });
});
