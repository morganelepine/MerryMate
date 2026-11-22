import PropTypes from "prop-types";
import { CARD_SURFACE } from "@/Components/Utils/surfaces";
import OutlineIcon from "@/Components/Utils/OutlineIcon";
import PencilIcon from "@/Components/Utils/PencilIcon";
import BudgetGiftRow from "@/Components/Profile/Budget/BudgetGiftRow";
import BudgetGiftForm from "@/Components/Profile/Budget/BudgetGiftForm";
import BudgetRecipientForm from "@/Components/Profile/Budget/BudgetRecipientForm";
import GiftStatusBadge from "@/Components/Profile/Budget/GiftStatusBadge";
import {
    BUDGET_ICONS,
    BUDGET_ROW,
    BUDGET_ROW_LAYOUT,
    BUDGET_ROW_PRICE,
    BUDGET_ROW_TEXT,
    cardAddButtonId,
    focusById,
    formatGiftCount,
} from "@/Components/Profile/Budget/budgetHelpers";
import {
    formatPrice,
    getIdeaTitle,
    getPaidPrice,
} from "@/Components/Ideas/ideaHelpers";
import useDisclosure from "@/hooks/useDisclosure";

const FOOTER_BUTTON =
    "inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-800 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300";

// Reservations and purchases made in MerryMate lists: read-only here.
function MerryMateRow({ idea }) {
    const paidPrice = getPaidPrice(idea);

    return (
        <li className={BUDGET_ROW}>
            <div className={BUDGET_ROW_LAYOUT}>
                <GiftStatusBadge
                    status={
                        idea.status === "reserved" ? "reserved" : "purchased"
                    }
                />
                <div className={BUDGET_ROW_TEXT}>
                    <p className="text-sm text-gray-900 break-words">
                        {getIdeaTitle(idea)}
                    </p>
                    <p className="text-xs text-gray-500">sur MerryMate</p>
                </div>
                {paidPrice > 0 && (
                    <span className={BUDGET_ROW_PRICE}>
                        {formatPrice(paidPrice)}
                    </span>
                )}
            </div>
        </li>
    );
}

MerryMateRow.propTypes = {
    idea: PropTypes.object.isRequired,
};

export default function BudgetRecipientCard({ card, year }) {
    const rename = useDisclosure();
    const addGift = useDisclosure();
    const { recipient } = card;
    const titleId = `budget-card-${card.key}`;

    return (
        <article
            aria-labelledby={titleId}
            className={`${CARD_SURFACE} flex flex-col border-t-4 ${card.accent}`}
        >
            <header className="border-b border-gray-200 p-4 sm:p-5">
                {rename.isOpen ? (
                    <BudgetRecipientForm
                        recipient={recipient}
                        onClose={rename.close}
                    />
                ) : (
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <div className="flex items-center gap-1">
                                <h3
                                    id={titleId}
                                    className="font-yeseva text-xl text-gray-900 break-words min-w-0"
                                >
                                    {card.name}
                                </h3>
                                {recipient && (
                                    <button
                                        ref={rename.triggerRef}
                                        type="button"
                                        onClick={rename.open}
                                        aria-label={`Modifier ${card.name}`}
                                        title="Modifier"
                                        className="shrink-0 p-1.5 rounded-full text-gray-400 hover:text-orange-600 hover:bg-orange-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            <p className="text-xs text-gray-500">
                                {formatGiftCount(card.count)}
                            </p>
                        </div>
                        <p className="shrink-0 text-right">
                            <span className="block text-xs text-gray-500">
                                Total
                            </span>
                            <span className="text-lg font-semibold text-gray-900 tabular-nums">
                                {formatPrice(card.total)}
                            </span>
                        </p>
                    </div>
                )}
            </header>

            <ul className="flex-1 divide-y divide-gray-100 px-4 sm:px-5">
                {card.ideas.map((idea) => (
                    <MerryMateRow key={idea.key} idea={idea} />
                ))}
                {card.gifts.map((gift) => (
                    <BudgetGiftRow
                        key={gift.id}
                        gift={gift}
                        recipient={recipient}
                        year={year}
                    />
                ))}
                {card.count === 0 && !addGift.isOpen && (
                    <li className={`${BUDGET_ROW} text-sm text-gray-500`}>
                        Aucun cadeau en {year}.
                    </li>
                )}
            </ul>

            <footer className="border-t border-gray-200 p-4 sm:px-5">
                {recipient ? (
                    addGift.isOpen ? (
                        <BudgetGiftForm
                            recipient={recipient}
                            year={year}
                            onClose={addGift.close}
                        />
                    ) : (
                        <button
                            ref={addGift.triggerRef}
                            id={cardAddButtonId(card.name)}
                            type="button"
                            onClick={addGift.open}
                            className={FOOTER_BUTTON}
                        >
                            <OutlineIcon
                                path={BUDGET_ICONS.plus}
                                className="h-4 w-4"
                            />
                            Ajouter un cadeau
                            <span className="sr-only">pour {card.name}</span>
                        </button>
                    )
                ) : addGift.isOpen ? (
                    <BudgetRecipientForm
                        defaultName={card.name}
                        onClose={addGift.close}
                        // This card is replaced by the new recipient's one.
                        onSaved={(name) => focusById(cardAddButtonId(name))}
                    />
                ) : (
                    <button
                        ref={addGift.triggerRef}
                        type="button"
                        onClick={addGift.open}
                        className={FOOTER_BUTTON}
                    >
                        <OutlineIcon
                            path={BUDGET_ICONS.userPlus}
                            className="h-4 w-4"
                        />
                        Ajouter {card.name} à mes proches
                    </button>
                )}
            </footer>
        </article>
    );
}

BudgetRecipientCard.propTypes = {
    card: PropTypes.shape({
        key: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        recipient: PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        }),
        gifts: PropTypes.array.isRequired,
        ideas: PropTypes.array.isRequired,
        accent: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
    }).isRequired,
    year: PropTypes.number.isRequired,
};
