import PropTypes from "prop-types";
import ButtonCancel from "@/Components/Ideas/UserList/Buttons/ButtonCancel";
import ButtonPurchase from "@/Components/Ideas/UserList/Buttons/ButtonPurchase";
import Linkify from "linkify-react"; //rendre les liens cliquables
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";

dayjs.extend(relativeTime);
dayjs.locale("fr");

export default function Ideas_reserved({ idea, userName }) {
    return (
        <div key={idea.id}>
            <div className="my-2 sm:flex items-center">
                {/* CANCEL RESERVATION and CONFIRM PURCHASE BUTTONS */}
                {idea.is_mine && (
                    <div className="flex sm:flex-col mr-2 mb-1 sm:mb-0">
                        <ButtonPurchase idea={idea} userName={userName} />
                        <ButtonCancel idea={idea} userName={userName} />
                    </div>
                )}

                {/* IDEA */}
                <div className="p-3 flex flex-1 flex-col bg-white shadow rounded-lg w-full">
                    <div className="flex flex-wrap items-center">
                        {idea.idea && (
                            <p className="text-sm sm:uppercase font-semibold mb-1.5 min-w-max mr-3">
                                {idea.idea}
                            </p>
                        )}
                        {idea.is_multiple === 1 && (
                            <p className="italic lowercase text-xs font-normal text-gray-600 mb-1.5 mr-4 min-w-max">
                                (peut être offert plusieurs fois)
                            </p>
                        )}
                        {idea.details && (
                            <p className="text-xs text-center border border-bordeaux-800 text-bordeaux-800 rounded-full px-3 py-0.5 mb-1.5 mr-4">
                                {idea.details}
                            </p>
                        )}
                        {idea.brand && (
                            <p className="text-sm text-center text-gray-600 mb-1.5">
                                {idea.brand}
                            </p>
                        )}
                    </div>

                    {idea.link && (
                        <p className="text-sm italic hover:text-bordeaux-800 max-h-5 text-ellipsis overflow-hidden break-all mb-1.5">
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
                        <p className="bg-bordeaux-100 rounded-full text-xs text-center max-w-max px-3 py-1 sm:mb-0 my-1">
                            Modèle choisi :{" "}
                            {idea.choice ? (
                                <span className="text-bordeaux-800">
                                    {idea.choice}
                                </span>
                            ) : (
                                <span className="italic">non précisé</span>
                            )}
                        </p>
                    )}

                    <div className="flex justify-end items-center text-right">
                        <small className="text-xs italic text-gray-700">
                            Réservé
                            {idea.is_mine ? " " : ` par ${idea.status_user} `}
                            {dayjs(idea.updated_at).fromNow()}
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
}

Ideas_reserved.propTypes = {
    idea: PropTypes.object,
    userName: PropTypes.string,
};
