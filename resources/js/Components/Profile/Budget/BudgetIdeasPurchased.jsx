import PropTypes from "prop-types";
import IdeaLink from "@/Components/Ideas/IdeaLink";
import { getIdeaTitle, linkIsTitle } from "@/Components/Ideas/ideaHelpers";
import { LIST_CARD } from "@/Components/GiftList/listCard";

export default function BudgetIdeasPurchased({ idea }) {
    const meta = [idea.brand, idea.details].filter(Boolean).join(" · ");

    return (
        <div className={LIST_CARD}>
            <div className="min-w-0 flex-1">
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
            {!linkIsTitle(idea) && <IdeaLink idea={idea} />}
            {idea.price && (
                <p className="shrink-0 font-semibold text-gray-900">
                    {idea.price} €
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
    }).isRequired,
};
