import PropTypes from "prop-types";
import AuthListCard from "@/Components/GiftList/Auth/AuthListCard";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import ColumnHeader from "@/Components/GiftList/Index/ColumnHeader";

export default function MyLists({ lists }) {
    return (
        <section>
            <ColumnHeader
                title="Mes listes"
                count={lists.length}
                action={
                    <PrimaryButton size="medium" href={route("lists.create")}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="w-4 h-4 mr-1.5 -ml-0.5"
                            aria-hidden="true"
                        >
                            <path d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Créer
                    </PrimaryButton>
                }
            />

            {lists.length > 0 ? (
                <div className="mt-4 space-y-3">
                    {lists.map((list) => (
                        <AuthListCard key={list.id} list={list} />
                    ))}
                </div>
            ) : (
                <p className="mt-6 text-gray-600">
                    Vous n’avez pas encore créé de liste.
                </p>
            )}
        </section>
    );
}

MyLists.propTypes = {
    lists: PropTypes.array.isRequired,
};
