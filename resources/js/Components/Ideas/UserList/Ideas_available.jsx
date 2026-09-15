import PropTypes from "prop-types";
import Linkify from "linkify-react"; //rendre les liens cliquables
import ButtonPurchase from "@/Components/Ideas/UserList/Buttons/ButtonPurchase";
import ButtonReserve from "@/Components/Ideas/UserList/Buttons/ButtonReserve";

export default function Ideas_available({ idea, userName, canReserve }) {
    return (
        <div key={idea.id}>
            <div className="my-2 sm:flex items-center">
                {/* RESERVE & BUY BUTTONS */}
                <div className="flex sm:flex-col mr-2 mb-1 sm:mb-0">
                    <ButtonPurchase idea={idea} userName={userName} />
                    {canReserve && (
                        <ButtonReserve idea={idea} userName={userName} />
                    )}
                </div>

                {/* IDEA */}
                <div className="p-3 flex flex-1 flex-col bg-white shadow rounded-lg">
                    <div className="flex flex-col">
                        <div className="flex justify-between">
                            <div className="flex flex-col mr-3 w-full">
                                <div className="flex flex-wrap items-center">
                                    {idea.favorite === 1 && idea.idea && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-4 h-4 mb-1.5 mr-1 fill-orange-500"
                                        >
                                            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                                        </svg>
                                    )}
                                    {idea.idea && (
                                        <p className="flex items-center text-sm sm:uppercase font-semibold mb-1.5 mr-3">
                                            {idea.idea}
                                        </p>
                                    )}
                                    {idea.is_multiple === 1 && (
                                        <span className="italic normal-case text-xs font-normal text-gray-600 mb-1.5 mr-4">
                                            {idea.idea
                                                ? "(peut être offert plusieurs fois)"
                                                : "Peut être offert plusieurs fois"}
                                        </span>
                                    )}
                                    {idea.details && (
                                        <p className="text-xs text-center text-orange-500 border border-orange-400 rounded-full px-3 py-0.5 mb-1.5 mr-4">
                                            {idea.details}
                                        </p>
                                    )}
                                    {idea.brand && (
                                        <small className="text-sm text-center text-gray-600 mb-1.5 mr-4">
                                            {idea.brand}
                                        </small>
                                    )}
                                </div>
                                {idea.link && (
                                    <div className="flex items-center">
                                        {idea.favorite === 1 && !idea.idea && (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="w-4 h-4 mr-1 fill-orange-500"
                                            >
                                                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                                            </svg>
                                        )}
                                        <p className="w-full text-sm italic hover:text-orange-500 max-h-5 text-ellipsis overflow-hidden break-all">
                                            <Linkify
                                                options={{ target: "blank" }}
                                            >
                                                {idea.link}
                                            </Linkify>
                                        </p>
                                    </div>
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
                            <div className="flex items-center mt-1.5">
                                <div className="flex items-center">
                                    <svg
                                        xmlns="https://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
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
                </div>
            </div>
        </div>
    );
}

Ideas_available.propTypes = {
    idea: PropTypes.object,
    userName: PropTypes.string,
    canReserve: PropTypes.bool,
};

Ideas_available.defaultProps = {
    canReserve: true,
};
