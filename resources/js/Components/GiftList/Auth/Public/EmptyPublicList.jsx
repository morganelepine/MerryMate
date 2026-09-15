import PropTypes from "prop-types";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";

export default function EmptyPublicList({ list }) {
    return (
        <div className="flex flex-col text-center gap-4">
            <p>
                Votre liste est vide. Cliquez sur ce bouton pour la compléter :
            </p>
            <PrimaryButton href={route("ideas.create", list.id)}>
                Commencer la liste
            </PrimaryButton>
        </div>
    );
}

EmptyPublicList.propTypes = {
    list: PropTypes.object,
};
