import React from "react";
import PropTypes from "prop-types";
import AuthList from "@/Components/GiftList/Auth/Public/AuthList";
import AuthPrivateList from "@/Components/GiftList/Auth/Private/AuthPrivateList";
import UserList from "@/Components/GiftList/User/List/UserList";
import AuthPrivateCode from "@/Components/GiftList/User/ListToFollow/AuthPrivateCode";
import GuestList from "@/Components/GiftList/Guest/GuestList";
import GuestPrivateCode from "@/Components/GiftList/Guest/GuestPrivateCode";

export default function Show({
    auth,
    list,
    ideas,
    ideas_available,
    ideas_reserved,
    ideas_purchased,
    followedLists,
    guestAccessGranted,
}) {
    // A signed-out visitor: either they've already unlocked this list
    // with its private code (see GiftListController::guestAccess),
    // or they land on the code gate.
    if (!auth.user) {
        return guestAccessGranted ? (
            <GuestList
                list={list}
                ideas_available={ideas_available}
                ideas_reserved={ideas_reserved}
                ideas_purchased={ideas_purchased}
            />
        ) : (
            <GuestPrivateCode list={list} />
        );
    }

    const listIsFollowed = followedLists.some(
        (followedList) => followedList.gift_list_id === list.id,
    );

    const isConnectedUser = list.user_id === auth.user.id;

    const isPrivateList = list.isPrivate === 1;
    const isSharedList = list.isPrivate === 0;

    return (
        <div>
            {isConnectedUser && isSharedList && (
                <AuthList
                    auth={auth}
                    list={list}
                    ideas={ideas}
                    ideas_available={ideas_available}
                />
            )}

            {isConnectedUser && isPrivateList && (
                <AuthPrivateList auth={auth} list={list} ideas={ideas} />
            )}

            {!isConnectedUser && listIsFollowed && (
                <UserList
                    auth={auth}
                    list={list}
                    ideas_available={ideas_available}
                    ideas_reserved={ideas_reserved}
                    ideas_purchased={ideas_purchased}
                />
            )}

            {!isConnectedUser && !listIsFollowed && (
                <AuthPrivateCode auth={auth} list={list} />
            )}
        </div>
    );
}

Show.propTypes = {
    auth: PropTypes.object.isRequired,
    list: PropTypes.object,
    ideas: PropTypes.array,
    ideas_available: PropTypes.array,
    ideas_reserved: PropTypes.array,
    ideas_purchased: PropTypes.array,
    followedLists: PropTypes.array,
    guestAccessGranted: PropTypes.bool,
};
