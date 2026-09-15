import PropTypes from "prop-types";
import ShowPrivateCode from "@/Components/GiftList/Action/ShowPrivateCode";
import DeleteListButton from "@/Components/GiftList/Action/Delete";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import OutlineButton from "@/Components/Buttons/OutlineButton";

export default function AuthListCard({ list }) {
    const isSharedList = list.isPrivate === 0;

    return (
        <div className="relative flex items-start w-full">
            <div className="flex flex-col items-center w-full">
                <div className="flex flex-col items center">
                    {/* LIST NAME */}
                    <div className="md:w-52">
                        <p>
                            Ma liste{" "}
                            <span className="uppercase font-semibold text-orange-500">
                                {list.name}
                            </span>{" "}
                        </p>
                    </div>
                    <small className="italic text-gray-500 mt-1 mb-2">
                        {list.isEmpty
                            ? `Créée le ${list.formatted_created_at}`
                            : `Mise à jour le ${list.formatted_updated_at}`}
                    </small>{" "}
                </div>

                <div className="flex flex-col items-center gap-4">
                    <div className="space-x-2">
                        <PrimaryButton
                            size="small"
                            href={route("lists.show", list.id)}
                            title="Voir ma liste"
                        >
                            {isSharedList ? (
                                <span>Voir ma liste</span>
                            ) : (
                                <span>Voir et compléter ma liste</span>
                            )}
                        </PrimaryButton>
                        {isSharedList && (
                            <OutlineButton
                                size="small"
                                color="orange"
                                href={route("ideas.create", list.id)}
                            >
                                Compléter
                            </OutlineButton>
                        )}
                    </div>

                    {/* PRIVATE CODE */}
                    {isSharedList && <ShowPrivateCode list={list} />}
                </div>
            </div>

            {/* DELETE BUTTON */}
            <DeleteListButton list={list} />
        </div>
    );
}

AuthListCard.propTypes = {
    list: PropTypes.object,
};
