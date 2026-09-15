import PropTypes from "prop-types";
import AuthListCard from "@/Components/GiftList/Auth/AuthListCard";
import NoListCreated from "@/Components/GiftList/Auth/NoListCreated";

export default function SharedLists({ auth, mySharedLists }) {
    return (
        <div className="flex flex-col items-center text-center md:w-1/3 mt-12 md:mt-0">
            <h1 className="text-xl font-semibold mb-2">Listes partagées</h1>
            {mySharedLists.length > 0 ? (
                mySharedLists.map((list) => (
                    <div
                        className="p-5 my-2 flex flex-col text-center shadow bg-white rounded-xl w-full"
                        key={list.id}
                    >
                        <AuthListCard list={list} auth={auth} />
                    </div>
                ))
            ) : (
                <NoListCreated listType="à partager" />
            )}
        </div>
    );
}

SharedLists.propTypes = {
    auth: PropTypes.object.isRequired,
    mySharedLists: PropTypes.array,
};
