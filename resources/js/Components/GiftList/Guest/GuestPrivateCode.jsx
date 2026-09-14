import PropTypes from "prop-types";
import { Head } from "@inertiajs/react";
import GuestListLayout from "@/Layouts/GuestListLayout";
import PrivateCodeForm from "@/Components/GiftList/PrivateCodeForm";

export default function GuestPrivateCode({ list }) {
    return (
        <GuestListLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    La liste "{list.name}" de {list.user_name}
                </h2>
            }
        >
            <Head title="Accès à la liste" />
            <PrivateCodeForm list={list} routeName="lists.guestAccess" />
        </GuestListLayout>
    );
}

GuestPrivateCode.propTypes = {
    list: PropTypes.object,
};
