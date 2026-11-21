import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { Head } from "@inertiajs/react";
import { PANEL } from "@/Components/Utils/surfaces";
import { PAGE_BODY } from "@/Layouts/Partials/pageContainer";

export default function Edit({ auth, profile, mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout user={auth.user} title="Mon profil">
            <Head title="Mon profil" />

            <div className={PAGE_BODY}>
                <div className="max-w-2xl space-y-6">
                    <section className={PANEL}>
                        <UpdateProfileInformationForm
                            user={profile}
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className=""
                        />
                    </section>

                    <section className={PANEL}>
                        <UpdatePasswordForm className="" />
                    </section>

                    <section className={PANEL}>
                        <DeleteUserForm className="" />
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
