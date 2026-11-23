import PropTypes from "prop-types";
import TakeIdeaButton from "@/Components/Ideas/UserList/Buttons/TakeIdeaButton";
import { STATUS_ICONS } from "@/Components/Ideas/statusIcons";

export default function ButtonReserve({ idea, userName }) {
    return (
        <TakeIdeaButton
            idea={idea}
            userName={userName}
            routeName={
                idea.is_multiple === 1
                    ? "multiple-ideas.reserve"
                    : "ideas.reserve"
            }
            label="Réserver"
            icon={STATUS_ICONS.reserve}
            confirmLabel="Confirmer la réservation"
            successMessage="Idée réservée !"
        />
    );
}

ButtonReserve.propTypes = {
    idea: PropTypes.object.isRequired,
    userName: PropTypes.string,
};
