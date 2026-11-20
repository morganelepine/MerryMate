import PropTypes from "prop-types";
import IdeaShow from "@/Components/Ideas/PublicList/IdeaShow";
import { IDEA_ACTIONS, IDEA_CARD } from "@/Components/Ideas/ideaCard";
import ButtonPurchase from "@/Components/Ideas/UserList/Buttons/ButtonPurchase";
import ButtonReserve from "@/Components/Ideas/UserList/Buttons/ButtonReserve";

export default function Ideas_available({ idea, userName, canReserve = true }) {
    return (
        <div key={idea.id}>
            <div className="sm:flex items-center">
                {/* RESERVE & BUY BUTTONS */}
                <div className={IDEA_ACTIONS}>
                    <ButtonPurchase idea={idea} userName={userName} />
                    {canReserve && (
                        <ButtonReserve idea={idea} userName={userName} />
                    )}
                </div>

                {/* IDEA */}
                <div className={IDEA_CARD}>
                    <IdeaShow idea={idea} />
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
