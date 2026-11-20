import PropTypes from "prop-types";
import IdeaShow from "@/Components/Ideas/PublicList/IdeaShow";
import ButtonPurchase from "@/Components/Ideas/UserList/Buttons/ButtonPurchase";
import ButtonReserve from "@/Components/Ideas/UserList/Buttons/ButtonReserve";

export default function Ideas_available({
    idea,
    userName,
    canReserve = true,
}) {
    return (
        <div key={idea.id}>
            <div className="my-2 sm:flex items-center">
                {/* RESERVE & BUY BUTTONS */}
                <div className="flex sm:flex-col mr-2 mb-1 sm:mb-0">
                    <ButtonPurchase idea={idea} userName={userName} />
                    {canReserve && (
                        <ButtonReserve idea={idea} userName={userName} />
                    )}
                </div>

                {/* IDEA */}
                <div className="p-3 flex-1 min-w-0 bg-white shadow rounded-lg">
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
