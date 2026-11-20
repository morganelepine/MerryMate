import { useState } from "react";
import PropTypes from "prop-types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UserListHeader from "@/Components/GiftList/User/List/UserListHeader";
import IdeasToReserve from "@/Components/GiftList/IdeasToReserve";
import { LIST_WIDTH } from "@/Layouts/Partials/pageContainer";

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
            headerWidth={LIST_WIDTH}
            header={
                <UserListHeader
                    auth={auth}
                    list={list}
                    setUserName={setUserName}
                />
            }
        >
            <IdeasToReserve
                list={list}
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
