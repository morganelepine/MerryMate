import { render, screen, fireEvent } from "@testing-library/react";
import AddIdeaAlert from "@/Components/GiftList/Auth/Public/Actions/AddIdeaAlert";

const mockList = { id: 1, name: "Gift List" };
const MUTED_LISTS_KEY = "few-ideas-left-reminder-muted";
const ALERT_TEXT = /il ne reste plus que/i;

const renderAddIdeaAlert = (overrides = {}) => {
    const defaultProps = {
        list: mockList,
        ideas: [1, 2, 3, 4, 5, 6, 7],
        availableIdeasCount: 4,
    };

    return render(<AddIdeaAlert {...{ ...defaultProps, ...overrides }} />);
};

describe("AddIdeaAlert", () => {
    it("displays the 'few-ideas-left' modal when there are less than 6 available ideas in the list", () => {
        renderAddIdeaAlert();
        expect(screen.getByText(ALERT_TEXT)).toBeInTheDocument();
    });

    it("does NOT display the 'few-ideas-left' modal when there are more than 5 available ideas in the list", () => {
        renderAddIdeaAlert({ availableIdeasCount: 6 });
        expect(screen.queryByText(ALERT_TEXT)).toBeNull();
    });

    it("comes back on the next visit after a simple close", () => {
        const { unmount } = renderAddIdeaAlert();
        fireEvent.click(screen.getByRole("button", { name: "Fermer" }));
        expect(screen.queryByText(ALERT_TEXT)).toBeNull();
        unmount();

        renderAddIdeaAlert();
        expect(screen.getByText(ALERT_TEXT)).toBeInTheDocument();
    });

    it("stops showing for this list only once 'Ne plus me le rappeler' is clicked", () => {
        const { unmount } = renderAddIdeaAlert();
        fireEvent.click(
            screen.getByRole("button", { name: /Ne plus me le rappeler/i }),
        );
        expect(screen.queryByText(ALERT_TEXT)).toBeNull();
        unmount();

        renderAddIdeaAlert();
        expect(screen.queryByText(ALERT_TEXT)).toBeNull();
        renderAddIdeaAlert({ list: { id: 2, name: "Other list" } });
        expect(screen.getByText(ALERT_TEXT)).toBeInTheDocument();
    });

    it("shows again once muted reminders are reset, then can be muted again", () => {
        localStorage.setItem(MUTED_LISTS_KEY, JSON.stringify([mockList.id]));

        const first = renderAddIdeaAlert({ resetMutedReminders: true });
        expect(screen.getByText(ALERT_TEXT)).toBeInTheDocument();
        fireEvent.click(
            screen.getByRole("button", { name: /Ne plus me le rappeler/i }),
        );
        first.unmount();

        renderAddIdeaAlert();
        expect(screen.queryByText(ALERT_TEXT)).toBeNull();
    });

    it("waits for the next visit when deferred, still resetting muted reminders", () => {
        localStorage.setItem(MUTED_LISTS_KEY, JSON.stringify([mockList.id]));

        const first = renderAddIdeaAlert({
            resetMutedReminders: true,
            deferred: true,
        });
        expect(screen.queryByText(ALERT_TEXT)).toBeNull();
        first.unmount();

        renderAddIdeaAlert();
        expect(screen.getByText(ALERT_TEXT)).toBeInTheDocument();
    });
});
