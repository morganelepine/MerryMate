import { useState } from "react";
import PropTypes from "prop-types";
import { router } from "@inertiajs/react";
import GiftStatusBadge from "@/Components/Profile/Budget/GiftStatusBadge";
import BudgetGiftForm from "@/Components/Profile/Budget/BudgetGiftForm";
import { formatPrice } from "@/Components/Ideas/ideaHelpers";
import useDisclosure from "@/hooks/useDisclosure";
import {
    BUDGET_ROW,
    BUDGET_ROW_LAYOUT,
    BUDGET_ROW_PRICE,
    BUDGET_ROW_TEXT,
    GIFT_STATUSES,
} from "@/Components/Profile/Budget/budgetHelpers";

export default function BudgetGiftRow({
    gift,
    recipient,
    year,
    occasionFilter,
}) {
    const { isOpen, open, close, triggerRef } = useDisclosure();
    const [toggling, setToggling] = useState(false);

    const toggleStatus = () =>
        router.patch(
            route("budget-gifts.status", gift.id),
            {},
            {
                preserveScroll: true,
                onStart: () => setToggling(true),
                onFinish: () => setToggling(false),
            },
        );

    if (isOpen) {
        return (
            <li className={BUDGET_ROW}>
                <BudgetGiftForm
                    recipient={recipient}
                    year={year}
                    gift={gift}
                    occasionFilter={occasionFilter}
                    onClose={close}
                />
            </li>
        );
    }

    return (
        <li className={BUDGET_ROW}>
            <div className={BUDGET_ROW_LAYOUT}>
                <GiftStatusBadge
                    status={gift.status}
                    giftTitle={gift.title}
                    onToggle={toggleStatus}
                    disabled={toggling}
                />
                <button
                    ref={triggerRef}
                    type="button"
                    onClick={open}
                    aria-label={`Modifier le cadeau ${gift.title}`}
                    className={`${BUDGET_ROW_TEXT} text-left text-sm text-gray-900 break-words hover:text-orange-600 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300`}
                >
                    {gift.title}
                </button>
                {gift.price > 0 && (
                    <span
                        className={`${BUDGET_ROW_PRICE} ${gift.status === "idea" ? "text-orange-700" : ""}`}
                    >
                        {formatPrice(gift.price)}
                    </span>
                )}
            </div>
        </li>
    );
}

BudgetGiftRow.propTypes = {
    gift: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        price: PropTypes.number,
        status: PropTypes.oneOf(GIFT_STATUSES).isRequired,
    }).isRequired,
    recipient: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
    year: PropTypes.number.isRequired,
    occasionFilter: PropTypes.string.isRequired,
};
