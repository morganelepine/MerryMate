import { render, screen } from "@testing-library/react";
import ArchiveReminder from "@/Components/GiftList/Auth/Public/Actions/ArchiveReminder";

const mockList = { id: 1, name: "Gift List" };
const mockDaysSinceLastLogin = 31;

const renderArchiveReminder = (overrides = {}) => {
    const defaultProps = {
        list: mockList,
        daysSinceLastLogin: mockDaysSinceLastLogin,
    };

    return render(<ArchiveReminder {...{ ...defaultProps, ...overrides }} />);
};

describe("ArchiveReminder", () => {
    it("displays the archive reminder modal if the user hasn't logged in for over 30 days", async () => {
        renderArchiveReminder();
        expect(
            screen.getByText(/Pense à archiver ta liste/i)
        ).toBeInTheDocument();
    });

    it("does NOT display the archive reminder modal if the user has logged in less than 30 days ago", async () => {
        renderArchiveReminder({ daysSinceLastLogin: 20 });
        expect(screen.queryByText(/Pense à archiver ta liste/i)).toBeNull();
    });

    it("does NOT display archive reminder if 'archive-reminder' already exists in localStorage", async () => {
        localStorage.setItem(`archive-reminder-${mockList.id}`, "no-reminder");
        renderArchiveReminder();
        expect(screen.queryByText(/Pense à archiver ta liste/i)).toBeNull();
    });
});
