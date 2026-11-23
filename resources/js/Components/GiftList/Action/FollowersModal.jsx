import { useRef } from "react";
import PropTypes from "prop-types";
import Modal from "@/Components/Utils/Modal";
import OutlineButton from "@/Components/Buttons/OutlineButton";
import FollowerRow from "@/Components/GiftList/Action/FollowerRow";
import SecretCodeForm from "@/Components/GiftList/Action/SecretCodeForm";
import useDisclosure from "@/hooks/useDisclosure";

const getTitle = (count) => {
    if (count === 0) return "Personne ne suit ta liste pour le moment";
    if (count === 1) return "1 personne suit ta liste";

    return `${count} personnes suivent ta liste`;
};

// Its own component so that closing the modal also resets the code form.
function FollowersFooter({ list, onClose }) {
    const code = useDisclosure();

    if (code.isOpen) {
        return (
            <div className="mt-6 border-t border-gray-200 pt-4">
                <SecretCodeForm list={list} onClose={code.close} />
            </div>
        );
    }

    return (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
            <button
                ref={code.triggerRef}
                type="button"
                onClick={code.open}
                className="py-1 text-sm text-gray-600 underline underline-offset-4 hover:text-orange-700 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
            >
                Modifier le code secret
            </button>
            <OutlineButton size="small" onClick={onClose}>
                Fermer
            </OutlineButton>
        </div>
    );
}

FollowersFooter.propTypes = {
    list: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default function FollowersModal({ list, followers, show, onClose }) {
    const titleRef = useRef(null);
    const hasFollowers = followers.length > 0;

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <Modal.Title
                    as="h2"
                    ref={titleRef}
                    tabIndex={-1}
                    className="text-lg font-medium focus:outline-none"
                >
                    {getTitle(followers.length)}
                </Modal.Title>

                <p className="mt-1 text-sm text-gray-600">
                    {hasFollowers
                        ? "Si tu retires quelqu’un, ses réservations sont conservées et aucune notification ne lui est envoyée. Pour l’empêcher de suivre ta liste à nouveau, tu peux changer ton code secret."
                        : "Partage ta liste avec tes proches pour qu’ils puissent la suivre."}
                </p>

                {hasFollowers && (
                    <ul className="mt-4 max-h-[50vh] overflow-y-auto divide-y divide-gray-200">
                        {followers.map((follower) => (
                            <FollowerRow
                                key={follower.id}
                                list={list}
                                follower={follower}
                                onRemoved={() => titleRef.current?.focus()}
                            />
                        ))}
                    </ul>
                )}

                <FollowersFooter list={list} onClose={onClose} />
            </div>
        </Modal>
    );
}

FollowersModal.propTypes = {
    list: PropTypes.shape({
        id: PropTypes.number.isRequired,
    }).isRequired,
    followers: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
        }),
    ).isRequired,
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};
