import PropTypes from "prop-types";
import IdeaLink from "@/Components/Ideas/IdeaLink";
import {
    NO_BRAND,
    formatPrice,
    getIdeaTitle,
    getPaidPrice,
    linkIsTitle,
} from "@/Components/Ideas/ideaHelpers";
import { LIST_CARD } from "@/Components/GiftList/listCard";
import { STATUS_VARIANTS } from "@/Components/Ideas/ideaCard";

const RESERVED = STATUS_VARIANTS.reserved;

export default function IdeaSummaryCard({
    idea,
    showPrice = true,
    giver = null,
}) {
    const brand = idea.brand === NO_BRAND ? null : idea.brand;
    const meta = [brand, idea.details, idea.choice].filter(Boolean).join(" ~ ");
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
                {/* Stacked on mobile, side by side from `sm` up. */}
                <div className="min-w-0 sm:flex sm:items-baseline sm:gap-4">
                    {linkIsTitle(idea) ? (
                        <IdeaLink idea={idea} />
                    ) : (
                        <p className="min-w-0 font-semibold text-gray-900 truncate">
                            {getIdeaTitle(idea)}
                        </p>
                    )}
                    {meta && (
                        <p className="min-w-0 text-sm text-gray-500 truncate">
                            {meta}
                        </p>
                    )}
                </div>

                {giver && (
                    <p className="mt-1 text-sm text-orange-600">
                        Offert par {giver}
                    </p>
                )}
            </div>
            {!linkIsTitle(idea) && <IdeaLink idea={idea} iconOnlyOnMobile />}
            {showPrice && paidPrice > 0 && (
                <p className="shrink-0 font-semibold text-gray-900">
                    {formatPrice(paidPrice)}
                </p>
            )}
        </div>
    );
}

IdeaSummaryCard.propTypes = {
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
    showPrice: PropTypes.bool,
    giver: PropTypes.string,
};
