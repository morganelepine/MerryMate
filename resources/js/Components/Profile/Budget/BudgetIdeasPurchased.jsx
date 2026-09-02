import PropTypes from "prop-types";
import Linkify from "linkify-react"; //rendre les liens cliquables

export default function BudgetIdeasPurchased({ idea }) {
    return (
        <div className="p-3 flex flex-1 flex-col bg-white shadow rounded-lg">
            <div className="flex justify-between">
                <div className="flex flex-col mr-2 w-full">
                    <div className="flex flex-wrap items-center">
                        {idea.idea && (
                            <p className="text-sm font-semibold mr-2 mb-1 sm:mr-4">
                                {idea.idea}
                            </p>
                        )}
                        {idea.details && (
                            <p className="text-xs text-center text-orange-500 border border-orange-400 rounded-full px-2 py-0.5 mb-1 mr-4">
                                {idea.details}
                            </p>
                        )}
                        {idea.brand && (
                            <small className="text-sm text-center text-gray-600 mb-1 mr-4">
                                {idea.brand}
                            </small>
                        )}
                    </div>
                    {idea.link && (
                        <p className="text-sm italic  hover:text-orange-500 max-h-5 text-ellipsis overflow-hidden break-all">
                            <Linkify
                                options={{
                                    target: "blank",
                                }}
                            >
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
        </div>
    );
}

BudgetIdeasPurchased.propTypes = {
    idea: PropTypes.object,
};
