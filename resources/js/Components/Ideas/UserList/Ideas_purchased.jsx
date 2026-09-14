import PropTypes from "prop-types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ButtonCancel from "@/Components/Ideas/UserList/Buttons/ButtonCancel";
import Linkify from "linkify-react"; //rendre les liens cliquables

dayjs.extend(relativeTime);

export default function Ideas_purchased({ idea, userName }) {
    return (
        <div key={idea.id}>
            <div className="my-2 sm:flex items-center">
                {/* CANCEL PURCHASE BUTTON */}
                {idea.is_mine && (
                    <div className="flex sm:flex-col mr-2 mb-1 sm:mb-0">
                        <ButtonCancel idea={idea} userName={userName} />
                    </div>
                )}

                {/* IDEA */}
                <div className="p-3 flex flex-1 flex-col bg-white shadow rounded-lg w-full">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-wrap items-center">
                            {idea.idea && (
                                <p className="flex items-center text-sm sm:uppercase text-gray-400 mr-2 mb-1 sm:mb-0 sm:mr-4 line-through">
                                    {idea.idea}{" "}
                                    {idea.is_multiple === 1 && (
                                        <span className="ml-2 italic lowercase text-xs font-normal text-gray-400">
                                            (peut être offert plusieurs fois)
                                        </span>
                                    )}
                                </p>
                            )}
                            {idea.brand && (
                                <small className="text-sm text-center text-gray-400 mb-1 sm:mb-0 mr-4 line-through">
                                    {idea.brand}
                                </small>
                            )}
                        </div>
                    </div>

                    {idea.link && (
                        <p className="text-sm italic text-gray-400 hover:text-indigo-500 max-h-5 text-ellipsis overflow-hidden break-all line-through mb-1">
                            <Linkify
                                options={{
                                    target: "blank",
                                }}
                            >
                                {idea.link}
                            </Linkify>
                        </p>
                    )}

                    {idea.is_multiple === 1 && (
                        <p className="bg-indigo-100 rounded-full text-xs text-center max-w-max px-3 py-1 sm:mb-0 my-1">
                            Modèle choisi :{" "}
                            {idea.choice ? (
                                <span className="text-indigo-500">
                                    {idea.choice}
                                </span>
                            ) : (
                                <span className="italic">non précisé</span>
                            )}
                        </p>
                    )}

                    <div className="flex justify-end items-center text-right">
                        <small className="text-xs italic text-gray-700">
                            Acheté
                            {idea.is_mine ? " " : ` par ${idea.status_user} `}
                            {dayjs(idea.updated_at).fromNow()}
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
}

Ideas_purchased.propTypes = {
    idea: PropTypes.object,
    userName: PropTypes.string,
};
