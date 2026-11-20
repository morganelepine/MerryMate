import PropTypes from "prop-types";
import Linkify from "linkify-react"; //rendre les liens cliquables
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";

dayjs.extend(relativeTime);
dayjs.locale("fr");

const VARIANTS = {
    reserved: {
        label: "Réservé",
        title: "font-semibold",
        details: "border-bordeaux-800 text-bordeaux-800",
        link: "hover:text-bordeaux-800",
        choiceBadge: "bg-bordeaux-100",
        choiceText: "text-bordeaux-800",
    },
    purchased: {
        label: "Acheté",
        title: "text-gray-400 line-through",
        details: "border-gray-300 text-gray-400 line-through",
        link: "text-gray-400 line-through hover:text-indigo-500",
        choiceBadge: "bg-indigo-100",
        choiceText: "text-indigo-500",
    },
};

export default function IdeaWithStatus({ idea, status, actions }) {
    const variant = VARIANTS[status];

    return (
        <div className="my-2 sm:flex items-center">
            {idea.is_mine && (
                <div className="flex sm:flex-col mr-2 mb-1 sm:mb-0">
                    {actions}
                </div>
            )}

            <div className="p-3 flex flex-1 flex-col gap-1.5 min-w-0 bg-white shadow rounded-lg">
                <p className="text-sm leading-6 break-words">
                    {idea.idea && (
                        <span className={`sm:uppercase mr-3 ${variant.title}`}>
                            {idea.idea}
                        </span>
                    )}
                    {idea.details && (
                        <span
                            className={`inline-block max-w-full text-xs leading-4 border rounded-full px-3 py-0.5 mr-3 ${variant.details}`}
                        >
                            {idea.details}
                        </span>
                    )}
                    {idea.is_multiple === 1 && (
                        <span className="italic lowercase text-xs text-gray-600 mr-3">
                            (peut être offert plusieurs fois)
                        </span>
                    )}
                </p>

                {idea.link && (
                    <p className={`text-sm italic truncate ${variant.link}`}>
                        <Linkify options={{ target: "blank" }}>
                            {idea.link}
                        </Linkify>
                    </p>
                )}

                {idea.is_multiple === 1 && (
                    <p
                        className={`rounded-full text-xs text-center max-w-max px-3 py-1 ${variant.choiceBadge}`}
                    >
                        Modèle choisi :{" "}
                        {idea.choice ? (
                            <span className={variant.choiceText}>
                                {idea.choice}
                            </span>
                        ) : (
                            <span className="italic">non précisé</span>
                        )}
                    </p>
                )}

                <small className="text-xs italic text-gray-700 text-right">
                    {variant.label}
                    {idea.is_mine ? " " : ` par ${idea.status_user} `}
                    {dayjs(idea.updated_at).fromNow()}
                </small>
            </div>
        </div>
    );
}

IdeaWithStatus.propTypes = {
    idea: PropTypes.object.isRequired,
    status: PropTypes.oneOf(Object.keys(VARIANTS)).isRequired,
    actions: PropTypes.node,
};
