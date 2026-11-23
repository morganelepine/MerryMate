import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Menu } from "@headlessui/react";
import CountBadge from "@/Components/Utils/CountBadge";
import OutlineIcon from "@/Components/Utils/OutlineIcon";
import { CHEVRON_DOWN, MENU_ITEM, MENU_PANEL } from "@/Components/Utils/menu";
import { NAV_ICONS } from "@/Components/Utils/navIcons";
import OutlineButton from "@/Components/Buttons/OutlineButton";
import { BUTTON_SIZE_CLASSES } from "@/Components/Buttons/buttonSizes";
import ArchiveListModal from "@/Components/GiftList/Action/ArchiveListModal";
import FollowersModal from "@/Components/GiftList/Action/FollowersModal";
import { LIST_ACTION_LINK } from "@/Components/GiftList/listAction";
import { shareList } from "@/Components/GiftList/shareList";

const SHARE_PATH =
    "M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z";
const ARCHIVE_PATH =
    "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z";

function ActionContent({ action }) {
    return (
        <>
            <OutlineIcon path={action.icon} className="w-4 h-4 mr-1.5" />
            {action.label}
            {action.count !== undefined && (
                <>
                    {" "}
                    <CountBadge
                        count={action.count}
                        className="ml-1.5 bg-black/5"
                    />
                </>
            )}
        </>
    );
}

ActionContent.propTypes = {
    action: PropTypes.shape({
        icon: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        count: PropTypes.number,
    }).isRequired,
};

// Secondary actions of a shared list: side by side, or behind a menu on small screens.
// The modals live here because the menu unmounts its items when it closes.
export default function ListActions({ list, followers, canArchive }) {
    const [openModal, setOpenModal] = useState(null);
    const closeModal = () => setOpenModal(null);
    const desktopActionsRef = useRef(null);

    // Once the list is archived, the button that opened the modal is gone: don't leave the focus on nothing.
    const restoreLostFocus = () =>
        requestAnimationFrame(() => {
            if (document.activeElement === document.body) {
                desktopActionsRef.current?.querySelector("button")?.focus();
            }
        });

    const share = {
        label: "Partager",
        icon: SHARE_PATH,
        onSelect: () => shareList(list),
    };
    const modalActions = [
        {
            label: "Abonné·e·s",
            icon: NAV_ICONS.followed,
            count: followers.length,
            onSelect: () => setOpenModal("followers"),
        },
        ...(canArchive
            ? [
                  {
                      label: "Archiver",
                      icon: ARCHIVE_PATH,
                      onSelect: () => setOpenModal("archive"),
                  },
              ]
            : []),
    ];

    return (
        <>
            <div
                ref={desktopActionsRef}
                className="hidden md:flex items-center gap-4"
            >
                <OutlineButton size="medium" onClick={share.onSelect}>
                    <ActionContent action={share} />
                </OutlineButton>
                {modalActions.map((action) => (
                    <button
                        key={action.label}
                        type="button"
                        onClick={action.onSelect}
                        aria-haspopup="dialog"
                        className={LIST_ACTION_LINK}
                    >
                        <ActionContent action={action} />
                    </button>
                ))}
            </div>

            <Menu as="div" className="relative md:hidden">
                <Menu.Button
                    aria-label="Autres actions"
                    className={`inline-flex items-center rounded-full bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 ${BUTTON_SIZE_CLASSES.medium}`}
                >
                    Autres
                    <OutlineIcon
                        path={CHEVRON_DOWN}
                        className="w-4 h-4 ml-1.5 -mr-0.5"
                    />
                </Menu.Button>
                <Menu.Items
                    className={`${MENU_PANEL} left-0 sm:left-auto sm:right-0 w-44`}
                >
                    {[share, ...modalActions].map((action) => (
                        <Menu.Item key={action.label}>
                            <button
                                type="button"
                                onClick={action.onSelect}
                                className={`flex items-center py-3 ${MENU_ITEM}`}
                            >
                                <ActionContent action={action} />
                            </button>
                        </Menu.Item>
                    ))}
                </Menu.Items>
            </Menu>

            <FollowersModal
                list={list}
                followers={followers}
                show={openModal === "followers"}
                onClose={closeModal}
            />
            <ArchiveListModal
                list={list}
                show={openModal === "archive"}
                onClose={closeModal}
                onClosed={restoreLostFocus}
            />
        </>
    );
}

ListActions.propTypes = {
    list: PropTypes.shape({
        id: PropTypes.number.isRequired,
        private_code: PropTypes.string,
    }).isRequired,
    followers: PropTypes.array.isRequired,
    canArchive: PropTypes.bool.isRequired,
};
