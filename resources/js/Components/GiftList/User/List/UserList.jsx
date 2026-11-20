import { useState } from "react";
import PropTypes from "prop-types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserListHeader from "@/Components/GiftList/User/List/UserListHeader";
import IdeasToReserve from "@/Components/GiftList/IdeasToReserve";

export default function UserList({
    auth,
    list,
    ideas_available,
    ideas_reserved,
    ideas_purchased,
}) {
    const [userName, setUserName] = useState(auth.user.name);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <UserListHeader
                    auth={auth}
                    list={list}
                    setUserName={setUserName}
                />
            }
        >
            <IdeasToReserve
                ideas_available={ideas_available}
                ideas_reserved={ideas_reserved}
                ideas_purchased={ideas_purchased}
                userName={userName}
            />
        </AuthenticatedLayout>
    );
}

UserList.propTypes = {
    auth: PropTypes.object.isRequired,
    list: PropTypes.object,
    ideas_available: PropTypes.array,
    ideas_reserved: PropTypes.array,
    ideas_purchased: PropTypes.array,
};
