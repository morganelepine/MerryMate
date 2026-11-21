import PropTypes from "prop-types";
import IdeaLink from "@/Components/Ideas/IdeaLink";
import {
    formatPrice,
    getIdeaTitle,
    getPaidPrice,
    linkIsTitle,
} from "@/Components/Ideas/ideaHelpers";
import { LIST_CARD } from "@/Components/GiftList/listCard";
import { STATUS_VARIANTS } from "@/Components/Ideas/ideaCard";

const RESERVED = STATUS_VARIANTS.reserved;

export default function BudgetIdeasPurchased({ idea }) {
    const meta = [idea.brand, idea.details, idea.choice]
        .filter(Boolean)
        .join(" ~ ");
    const paidPrice = getPaidPrice(idea);

    return (
        <div className={LIST_CARD}>
            <div className="min-w-0 flex-1">
                {idea.status === "reserved" && (
                    <p
                        className={`mb-1 inline-flex rounded-full border px-2 py-0.5 text-xs ${RESERVED.badgeMine}`}
                    >
                        {RESERVED.label}
                    </p>
                )}
                {linkIsTitle(idea) ? (
                    <IdeaLink idea={idea} />
                ) : (
                    <p className="font-semibold text-gray-900 truncate">
                        {getIdeaTitle(idea)}
                    </p>
                )}
                {meta && (
                    <p className="text-sm text-gray-500 truncate">{meta}</p>
                )}
            </div>
            {!linkIsTitle(idea) && <IdeaLink idea={idea} iconOnlyOnMobile />}
            {paidPrice > 0 && (
                <p className="shrink-0 font-semibold text-gray-900">
                    {formatPrice(paidPrice)}
                </p>
            )}
        </div>
    );
}

BudgetIdeasPurchased.propTypes = {
    idea: PropTypes.shape({
        idea: PropTypes.string,
        link: PropTypes.string,
        brand: PropTypes.string,
        details: PropTypes.string,
        price: PropTypes.number,
        paid_price: PropTypes.number,
        choice: PropTypes.string,
        status: PropTypes.string,
    }).isRequired,
};
