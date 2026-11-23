import PropTypes from "prop-types";
import TakeIdeaButton from "@/Components/Ideas/UserList/Buttons/TakeIdeaButton";
import { STATUS_ICONS } from "@/Components/Ideas/statusIcons";

const getRouteName = (idea) => {
    if (idea.is_multiple !== 1) return "ideas.purchase";

    // A reserved multiple idea is a reservation row, whose id is not an idea id.
    return idea.status === "reserved"
        ? "multiple-ideas.confirm-purchase"
        : "multiple-ideas.purchase";
};

export default function ButtonPurchase({ idea, userName }) {
    return (
        <TakeIdeaButton
            idea={idea}
            userName={userName}
            routeName={getRouteName(idea)}
            label="Acheter"
            icon={STATUS_ICONS.purchase}
            confirmLabel="Confirmer l'achat"
            successMessage="Cadeau acheté !"
        />
    );
}

ButtonPurchase.propTypes = {
    idea: PropTypes.object.isRequired,
    userName: PropTypes.string,
};
