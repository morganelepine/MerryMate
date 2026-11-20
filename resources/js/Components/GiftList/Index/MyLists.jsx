import PropTypes from "prop-types";
import AuthListCard from "@/Components/GiftList/Auth/AuthListCard";
import CreateListButton from "@/Components/GiftList/Action/CreateListButton";
import SectionHeader from "@/Components/Utils/SectionHeader";

export default function MyLists({ lists }) {
    return (
        <section>
            <SectionHeader title="Mes listes" action={<CreateListButton />} />

            {lists.length > 0 ? (
                <div className="mt-4 space-y-3">
                    {lists.map((list) => (
                        <AuthListCard key={list.id} list={list} />
                    ))}
                </div>
            ) : (
                <p className="mt-6 text-gray-600">
                    Tu n’as pas encore créé de liste.
                </p>
            )}
        </section>
    );
}

MyLists.propTypes = {
    lists: PropTypes.array.isRequired,
};
