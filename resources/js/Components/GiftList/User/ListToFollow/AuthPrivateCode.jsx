import PropTypes from "prop-types";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrivateCodeForm from "@/Components/GiftList/PrivateCodeForm";

export default function AuthPrivateCode({ auth, list }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        La liste "{list.name}" de {list.user_name}
                    </h2>
                </div>
            }
        >
            <Head title="Accès refusé" />
            <PrivateCodeForm
                list={list}
                routeName="lists.followList"
                extraData={{
                    user_id: auth.user.id,
                    gift_list_id: list.id,
                }}
            />
        </AuthenticatedLayout>
    );
}

AuthPrivateCode.propTypes = {
    auth: PropTypes.object.isRequired,
    list: PropTypes.object,
};
