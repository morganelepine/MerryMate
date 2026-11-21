import PropTypes from "prop-types";
import { formatOwner } from "@/Components/GiftList/listCard";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrivateCodeForm from "@/Components/GiftList/PrivateCodeForm";

export default function AuthPrivateCode({ auth, list }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            title={list.name}
            subtitle={`Liste de ${formatOwner(list)}`}
        >
            <Head title={list.name} />
            <PrivateCodeForm list={list} routeName="lists.followList" />
        </AuthenticatedLayout>
    );
}

AuthPrivateCode.propTypes = {
    auth: PropTypes.object.isRequired,
    list: PropTypes.object,
};
