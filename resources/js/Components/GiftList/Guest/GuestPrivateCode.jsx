import PropTypes from "prop-types";
import { formatOwner } from "@/Components/GiftList/listCard";
import { Head } from "@inertiajs/react";
import GuestListLayout from "@/Layouts/GuestListLayout";
import PrivateCodeForm from "@/Components/GiftList/PrivateCodeForm";

export default function GuestPrivateCode({ list }) {
    return (
        <GuestListLayout
            title={list.name}
            subtitle={`Liste de ${formatOwner(list)}`}
        >
            <Head title={list.name} />
            <PrivateCodeForm list={list} routeName="lists.guestAccess" />
        </GuestListLayout>
    );
}

GuestPrivateCode.propTypes = {
    list: PropTypes.object,
};
