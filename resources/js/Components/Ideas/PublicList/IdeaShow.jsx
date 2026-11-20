import PropTypes from "prop-types";

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

// The link field is free text: only treat it as a URL when it parses to a real domain.
function parseLink(link) {
    if (!link) return null;
    try {
        const url = new URL(
            /^https?:\/\//i.test(link) ? link : `https://${link}`,
        );
        if (!url.hostname.includes(".")) return null;
        return { href: url.href, host: url.hostname.replace(/^www\./, "") };
    } catch {
        return null;
    }
}

export default function IdeaShow({ idea }) {
    const isFavorite = idea.favorite === 1;
    const isMultiple = idea.is_multiple === 1;
    const isPromo = idea.promo === 1;
    const link = parseLink(idea.link);
    const title = idea.idea || link?.host || idea.link;

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 break-words leading-6">
                    {isFavorite && <HeartIcon />}
                    <span className="font-semibold text-gray-900">{title}</span>
                    {idea.details && (
                        <span className="ml-2 text-gray-500 text-sm">
                            ({idea.details})
                        </span>
                    )}
                </p>

                {(idea.price || isPromo) && (
                    <p className="shrink-0 whitespace-nowrap leading-6">
                        {isPromo && (
                            <span className="mr-2 text-xs text-orange-700">
                                ({idea.promo_details || "en promo"})
                            </span>
                        )}
                        {idea.price && (
                            <span className="font-semibold text-gray-900">
                                {idea.price} €
                            </span>
                        )}
                    </p>
                )}
            </div>

            {(isMultiple || idea.link) && (
                <div className="flex flex-wrap items-center gap-2">
                    {isMultiple && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600">
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
                    )}

                    {link ? (
                        <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-auto inline-flex max-w-full items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-sm text-orange-700 hover:bg-orange-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
                        >
                            <span className="truncate">{link.host}</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-4 h-4 shrink-0"
                                aria-hidden="true"
                            >
                                <path d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                            <span className="sr-only">(nouvel onglet)</span>
                        </a>
                    ) : (
                        idea.link &&
                        idea.idea && (
                            <span className="ml-auto max-w-full truncate text-sm text-gray-500">
                                {idea.link}
                            </span>
                        )
                    )}
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
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        favorite: PropTypes.number,
        is_multiple: PropTypes.number,
        promo: PropTypes.number,
        promo_details: PropTypes.string,
    }).isRequired,
};
