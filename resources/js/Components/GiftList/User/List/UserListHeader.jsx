import { useState } from "react";
import PropTypes from "prop-types";
import Toggle from "@/Components/Utils/Toggle";
import Modal from "@/Components/Utils/Modal";
import { LIST_TITLE } from "@/Components/GiftList/listTitle";

export default function UserListHeader({ auth, list, setUserName }) {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <h1 className={LIST_TITLE}>{list.name}</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Liste de {list.user_name} {list.user_lastname}
                    </p>
                </div>
                <div className="inline-flex items-center gap-1 self-start sm:self-auto shrink-0 rounded-full bg-white border border-gray-200 shadow-sm pl-2.5 pr-1.5 py-1.5 sm:pl-3 sm:pr-2 sm:py-2">
                    <Toggle
                        id="is_secret_santa"
                        name="is_secret_santa"
                        label="Mode Secret Santa"
                        size="responsive"
                        defaultChecked={false}
                        onChange={(e) => {
                            setUserName(
                                e.target.checked ? "Anonyme" : auth.user.name,
                            );
                        }}
                    />

                    <button
                        className="p-1 rounded-full text-gray-400 hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
                        title="En savoir plus sur le mode Secret Santa"
                        aria-label="En savoir plus sur le mode Secret Santa"
                        onClick={() => setModalVisible(true)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-4 h-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <Modal show={modalVisible} onClose={() => setModalVisible(false)}>
                <button
                    onClick={() => setModalVisible(false)}
                    className="text-sm hover:text-orange-500 absolute top-2 right-2"
                    aria-label="Fermer"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 28 28"
                        stroke="currentColor"
                        className="h-8 w-8"
                    >
                        <path d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="p-6">
                    <h2 className="text-lg font-medium ">
                        Le mode Secret Santa
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        En activant le mode Secret Santa, vous restez anonyme
                        lorsque vous réservez ou achetez un cadeau.
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                        En face du cadeau réservé/acheté, les autres
                        participant·e·s ne verront plus votre nom mais la
                        mention "Anonyme".
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                        Cela permet de préserver la surprise lors de l'échange
                        de cadeaux !
                    </p>
                </div>
            </Modal>
        </>
    );
}

UserListHeader.propTypes = {
    auth: PropTypes.object.isRequired,
    list: PropTypes.shape({
        name: PropTypes.string.isRequired,
        user_name: PropTypes.string.isRequired,
        user_lastname: PropTypes.string.isRequired,
    }).isRequired,
    setUserName: PropTypes.func.isRequired,
};
