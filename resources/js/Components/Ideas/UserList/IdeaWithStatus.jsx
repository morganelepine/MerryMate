import PropTypes from "prop-types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";
import IdeaLink from "@/Components/Ideas/IdeaLink";
import { getIdeaTitle, linkIsTitle } from "@/Components/Ideas/ideaHelpers";
import {
    IDEA_ACTIONS,
    IDEA_CARD_BASE,
    STATUS_VARIANTS,
} from "@/Components/Ideas/ideaCard";

dayjs.extend(relativeTime);
dayjs.locale("fr");

// Neutral grey pill: the card border already carries the status colour.
const LINK_COLOR = "bg-gray-200 text-gray-700 hover:bg-gray-100";

export default function IdeaWithStatus({ idea, status, actions }) {
    const variant = STATUS_VARIANTS[status];
    const linkAsTitle = linkIsTitle(idea);

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
                        {linkAsTitle ? (
                            <IdeaLink idea={idea} color={LINK_COLOR} />
                        ) : (
                            <span className="font-semibold text-gray-900">
                                {getIdeaTitle(idea)}
                            </span>
                        )}
                        {idea.is_multiple === 1 && (
                            <span className="ml-2 text-sm text-gray-500">
                                ({idea.choice || "modèle non précisé"})
                            </span>
                        )}
                    </p>
                    {!linkAsTitle && (
                        <IdeaLink
                            idea={idea}
                            color={LINK_COLOR}
                            className="ml-auto"
                            iconOnlyOnMobile
                        />
                    )}
                </div>

                <div className="mt-3">
                    <p
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${idea.is_mine ? variant.badgeMine : variant.badgeOther}`}
                    >
                        {variant.label}
                        {idea.is_mine ? " par toi" : ` par ${idea.status_user}`}
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
    status: PropTypes.oneOf(Object.keys(STATUS_VARIANTS)).isRequired,
    actions: PropTypes.node,
};
