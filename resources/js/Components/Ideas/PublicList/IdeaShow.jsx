import PropTypes from "prop-types";
import IdeaLink from "@/Components/Ideas/IdeaLink";
import {
    formatPrice,
    formatPromoEnd,
    getIdeaTitle,
    isPromoActive,
    linkIsTitle,
} from "@/Components/Ideas/ideaHelpers";

function HeartIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            aria-label="Favori"
            role="img"
            className="inline-block w-4 h-4 mr-1.5 -mt-1 align-middle fill-orange-500"
        >
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
        </svg>
    );
}

function MultipleBadge() {
    return (
        <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4"
                aria-hidden="true"
            >
                <path d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
            </svg>
            Plusieurs fois
        </span>
    );
}

export default function IdeaShow({ idea }) {
    const isFavorite = idea.favorite === 1;
    const isMultiple = idea.is_multiple === 1;
    const isPromo = isPromoActive(idea);
    const promoPrice =
        isPromo && idea.promo_price > 0 ? idea.promo_price : null;
    const title = getIdeaTitle(idea);
    const hasPrice = idea.price > 0 || isPromo;
    const linkAsTitle = linkIsTitle(idea);
    // Without a name, the link is already the title (pill or free text): don't repeat it.
    const showsLink = Boolean(idea.idea && idea.link);
    // With no price and a single extra (link or "Plusieurs fois"), it fits on the title line.
    const extrasInline = !hasPrice && showsLink !== isMultiple;

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 break-words leading-6">
                    {isFavorite && <HeartIcon />}
                    {linkAsTitle ? (
                        <IdeaLink idea={idea} />
                    ) : (
                        <span className="font-semibold text-gray-900">
                            {title}
                        </span>
                    )}
                    {idea.details && (
                        <span className="ml-2 text-gray-500 text-sm">
                            ({idea.details})
                        </span>
                    )}
                </p>

                {extrasInline &&
                    (showsLink ? <IdeaLink idea={idea} /> : <MultipleBadge />)}

                {hasPrice && (
                    <div className="shrink-0 text-right leading-6">
                        <p className="whitespace-nowrap">
                            {isPromo && !promoPrice && (
                                <span className="mr-2 text-xs text-orange-700">
                                    (en promo)
                                </span>
                            )}
                            {promoPrice && idea.price > 0 && (
                                <>
                                    {/* Screen readers don't announce <del>. */}
                                    <span className="sr-only">
                                        Prix initial :
                                    </span>
                                    <del className="mr-2 text-sm text-gray-500">
                                        {formatPrice(idea.price)}
                                    </del>
                                    <span className="sr-only">
                                        Prix promo :
                                    </span>
                                </>
                            )}
                            {promoPrice ? (
                                <span className="font-semibold text-orange-700">
                                    {formatPrice(promoPrice)}
                                </span>
                            ) : (
                                idea.price > 0 && (
                                    <span className="font-semibold text-gray-900">
                                        {formatPrice(idea.price)}
                                    </span>
                                )
                            )}
                        </p>
                        {isPromo && idea.promo_end_date && (
                            <p className="text-xs text-orange-700">
                                jusqu'au {formatPromoEnd(idea.promo_end_date)}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {!extrasInline && (isMultiple || showsLink) && (
                <div className="flex flex-wrap items-center gap-2">
                    <IdeaLink idea={idea} />
                    {isMultiple && <MultipleBadge />}
                </div>
            )}
        </div>
    );
}

IdeaShow.propTypes = {
    idea: PropTypes.shape({
        idea: PropTypes.string,
        link: PropTypes.string,
        details: PropTypes.string,
        price: PropTypes.number,
        favorite: PropTypes.number,
        is_multiple: PropTypes.number,
        promo: PropTypes.number,
        promo_price: PropTypes.number,
        promo_end_date: PropTypes.string,
    }).isRequired,
};
