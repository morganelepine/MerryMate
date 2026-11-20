import PropTypes from "prop-types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";
import IdeaShow from "@/Components/Ideas/PublicList/IdeaShow";
import { IDEA_ACTIONS, IDEA_CARD_BASE } from "@/Components/Ideas/ideaCard";

dayjs.extend(relativeTime);
dayjs.locale("fr");

const VARIANTS = {
    reserved: {
        label: "Réservé",
        card: "border-lilac-300",
        badge: "bg-lilac-100 text-lilac-800",
        dot: "bg-lilac-300",
    },
    purchased: {
        label: "Acheté",
        card: "border-sage-300",
        badge: "bg-sage-100 text-sage-800",
        dot: "bg-sage-300",
    },
};

export default function IdeaWithStatus({ idea, status, actions }) {
    const variant = VARIANTS[status];

    return (
        <div className="sm:flex items-center">
            <div
                className={`${IDEA_ACTIONS} ${idea.is_mine ? "" : "hidden sm:flex"}`}
            >
                {idea.is_mine && actions}
            </div>

            <div className={`${IDEA_CARD_BASE} ${variant.card}`}>
                <IdeaShow idea={idea} />

                <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-gray-100">
                    <p
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm ${variant.badge}`}
                    >
                        <span
                            className={`w-2 h-2 rounded-full ${variant.dot}`}
                            aria-hidden="true"
                        />
                        {variant.label}
                        {idea.is_mine
                            ? " par vous"
                            : ` par ${idea.status_user}`}
                        {" · "}
                        {dayjs(idea.updated_at).fromNow()}
                    </p>

                    {idea.is_multiple === 1 && (
                        <p className="text-sm text-gray-600">
                            Modèle choisi :{" "}
                            {idea.choice ? (
                                <span className="font-medium text-gray-900">
                                    {idea.choice}
                                </span>
                            ) : (
                                <span className="italic">non précisé</span>
                            )}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

IdeaWithStatus.propTypes = {
    idea: PropTypes.object.isRequired,
    status: PropTypes.oneOf(Object.keys(VARIANTS)).isRequired,
    actions: PropTypes.node,
};
