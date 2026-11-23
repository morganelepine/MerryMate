import { useRef } from "react";
import PropTypes from "prop-types";
import Modal from "@/Components/Utils/Modal";
import OutlineButton from "@/Components/Buttons/OutlineButton";
import FollowerRow from "@/Components/GiftList/Action/FollowerRow";

const getTitle = (count) => {
    if (count === 0) return "Personne ne suit ta liste pour le moment";
    if (count === 1) return "1 personne suit ta liste";

    return `${count} personnes suivent ta liste`;
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
                        ? "Si tu retires quelqu’un, ses réservations sont conservées et aucune notification ne lui est envoyée. Avec ton code secret, cette personne pourra suivre ta liste à nouveau."
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

                <div className="mt-6 flex justify-end">
                    <OutlineButton size="small" onClick={onClose}>
                        Fermer
                    </OutlineButton>
                </div>
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
