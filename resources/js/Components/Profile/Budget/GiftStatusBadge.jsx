import PropTypes from "prop-types";
import OutlineIcon from "@/Components/Utils/OutlineIcon";
import {
    GIFT_STATUS,
    otherStatus,
} from "@/Components/Profile/Budget/budgetHelpers";

// Icon only: the status is named by the tooltip and for screen readers.
// The shape (check, bulb, bookmark) tells statuses apart without relying on color.
const BADGE =
    "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border";

// A button when `onToggle` is given, a plain icon otherwise (MerryMate purchases).
export default function GiftStatusBadge({
    status,
    giftTitle,
    onToggle,
    disabled = false,
}) {
    const { label, icon, badge } = GIFT_STATUS[status];
    const iconElement = <OutlineIcon path={icon} className="h-4 w-4" />;

    if (!onToggle) {
        return (
            <span
                role="img"
                aria-label={label}
                title={label}
                className={`${BADGE} ${badge}`}
            >
                {iconElement}
            </span>
        );
    }

    // A switch announces its new state once toggled, which a changed aria-label doesn't.
    // aria-disabled rather than disabled: disabling the focused button would drop the focus.
    return (
        <button
            type="button"
            role="switch"
            aria-checked={status === "purchased"}
            aria-label={`${giftTitle} acheté`}
            aria-disabled={disabled}
            onClick={disabled ? undefined : onToggle}
            title={`${label} · passer en ${GIFT_STATUS[otherStatus(status)].label.toLowerCase()}`}
            className={`${BADGE} ${badge} transition hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 aria-disabled:opacity-50 aria-disabled:cursor-wait`}
        >
            {iconElement}
        </button>
    );
}

GiftStatusBadge.propTypes = {
    status: PropTypes.oneOf(Object.keys(GIFT_STATUS)).isRequired,
    // Names the switch ("Parfum acheté"): required with `onToggle`.
    giftTitle: PropTypes.string,
    onToggle: PropTypes.func,
    disabled: PropTypes.bool,
};
