import PropTypes from "prop-types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";
import IdeaLink from "@/Components/Ideas/IdeaLink";
import { getIdeaTitle } from "@/Components/Ideas/ideaHelpers";
import { IDEA_ACTIONS, IDEA_CARD_BASE } from "@/Components/Ideas/ideaCard";

dayjs.extend(relativeTime);
dayjs.locale("fr");

const VARIANTS = {
    reserved: {
        label: "Réservé",
        card: "border-lilac-300",
        // Filled when it's the viewer's own action, outlined when someone else's.
        badgeMine: "bg-lilac-100 border-lilac-100 text-lilac-800",
        badgeOther: "bg-white border-lilac-300 text-lilac-800",
    },
    purchased: {
        label: "Acheté",
        card: "border-sage-300",
        badgeMine: "bg-sage-100 border-sage-100 text-sage-800",
        badgeOther: "bg-white border-sage-300 text-sage-800",
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
                <div className="flex items-center gap-3">
                    <p className="min-w-0 truncate">
                        <span className="font-semibold text-gray-900">
                            {getIdeaTitle(idea)}
                        </span>
                        {idea.is_multiple === 1 && (
                            <span className="ml-2 text-sm text-gray-500">
                                ({idea.choice || "modèle non précisé"})
                            </span>
                        )}
                    </p>
                    <IdeaLink
                        idea={idea}
                        color="bg-gray-200 text-gray-700 hover:bg-gray-100"
                        className="ml-auto"
                        iconOnlyOnMobile
                    />
                </div>

                <div className="mt-3">
                    <p
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${idea.is_mine ? variant.badgeMine : variant.badgeOther}`}
                    >
                        {variant.label}
                        {idea.is_mine
                            ? " par vous"
                            : ` par ${idea.status_user}`}
                        {" · "}
                        {dayjs(idea.updated_at).fromNow()}
                    </p>
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
