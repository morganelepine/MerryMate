import PropTypes from "prop-types";
import Linkify from "linkify-react";

function HeartIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            aria-label="Favori"
            role="img"
            className="inline-block w-4 h-4 mr-1 -mt-0.5 align-middle fill-orange-500"
        >
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
        </svg>
    );
}

export default function IdeaShow({ idea }) {
    const isFavorite = idea.favorite === 1;
    const hasHeading = idea.idea || idea.is_multiple === 1 || idea.details;

    return (
        <div className="flex flex-col">
            <div className="flex justify-between gap-3">
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    {/* Inline flow so the heart and the badges follow the title instead of wrapping as whole blocks */}
                    {hasHeading && (
                        <p className="text-sm leading-6 break-words">
                            {isFavorite && idea.idea && <HeartIcon />}
                            {idea.idea && (
                                <span className="sm:uppercase font-semibold mr-3">
                                    {idea.idea}
                                </span>
                            )}
                            {idea.details && (
                                <span className="inline-block max-w-full text-xs leading-4 text-orange-500 border border-orange-400 rounded-full px-3 py-0.5 mr-3">
                                    {idea.details}
                                </span>
                            )}
                            {idea.is_multiple === 1 && (
                                <span className="italic normal-case text-xs text-gray-600 mr-3">
                                    {idea.idea
                                        ? "(peut être offert plusieurs fois)"
                                        : "Peut être offert plusieurs fois"}
                                </span>
                            )}
                        </p>
                    )}
                    {idea.link && (
                        <p className="text-sm italic hover:text-orange-500 truncate">
                            {isFavorite && !idea.idea && <HeartIcon />}
                            <Linkify options={{ target: "blank" }}>
                                {idea.link}
                            </Linkify>
                        </p>
                    )}
                </div>
                {idea.price && (
                    <div className="min-w-max">
                        <p className="text-xs text-white bg-orange-500 rounded-lg px-2 py-1 text-center">
                            {idea.price} €
                        </p>
                    </div>
                )}
            </div>
            {idea.promo === 1 && (
                <div className="flex items-center mt-2">
                    <div className="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                            className="w-4 h-4 mr-1"
                        >
                            <path d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" />
                        </svg>

                        <p className="text-sm mr-2">en promo</p>
                    </div>
                    {idea.promo_details && (
                        <p className="text-xs text-center italic bg-orange-50 rounded-full px-3 py-1 ml-2 mt-1">
                            {idea.promo_details}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

IdeaShow.propTypes = {
    idea: PropTypes.object.isRequired,
};
