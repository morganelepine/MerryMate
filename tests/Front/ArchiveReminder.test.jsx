import { fireEvent, render, screen } from "@testing-library/react";
import ArchiveReminder from "@/Components/GiftList/Auth/Public/Actions/ArchiveReminder";

vi.mock("@inertiajs/react", () => ({
    useForm: () => ({
        patch: (url, { onSuccess }) => onSuccess(),
        reset: vi.fn(),
    }),
}));

vi.mock("sonner", () => ({
    toast: { error: vi.fn(), success: vi.fn() },
}));

const mockList = { id: 1, name: "Gift List" };
const REMINDER_TEXT = /Pense à archiver ta liste/i;

describe("ArchiveReminder", () => {
    it("displays the archive reminder modal when the server asks for it", () => {
        render(<ArchiveReminder list={mockList} show />);
        expect(screen.getByText(REMINDER_TEXT)).toBeInTheDocument();
    });

    it("does NOT display the archive reminder modal otherwise", () => {
        render(<ArchiveReminder list={mockList} />);
        expect(screen.queryByText(REMINDER_TEXT)).toBeNull();
    });

    it("closes the modal once the list is archived", () => {
        render(<ArchiveReminder list={mockList} show />);
        fireEvent.click(screen.getByText("Archiver la liste"));
        expect(screen.queryByText(REMINDER_TEXT)).toBeNull();
    });
});
