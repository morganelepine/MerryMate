import { Head } from "@inertiajs/react";
import PropTypes from "prop-types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import MyLists from "@/Components/GiftList/Index/MyLists";
import FollowedLists from "@/Components/GiftList/Index/FollowedLists";
import QuickActions from "@/Components/GiftList/Index/QuickActions";
import { HOME_WIDTH, PAGE_GUTTER } from "@/Layouts/Partials/pageContainer";

export default function Index({
    auth,
    followedLists,
    mySharedLists,
    myPrivateLists,
}) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            // The quick actions replace the nav links on desktop.
            showDesktopNav={false}
        >
            <Head title="Accueil" />

            <div className={`${HOME_WIDTH} ${PAGE_GUTTER} pb-16`}>
                <h1 className="hidden sm:block font-yeseva pt-10 text-3xl sm:text-4xl text-gray-900">
                    Bonjour {auth.user.name}
                </h1>

                {/* Mobile keeps the burger menu instead. */}
                <div className="hidden sm:block mt-8">
                    <QuickActions />
                </div>

                <div className="mt-8 sm:mt-12 grid grid-cols-1 gap-12 md:grid-cols-2">
                    <FollowedLists followedLists={followedLists} />
                    <MyLists lists={[...mySharedLists, ...myPrivateLists]} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

Index.propTypes = {
    auth: PropTypes.object.isRequired,
    followedLists: PropTypes.array.isRequired,
    mySharedLists: PropTypes.array.isRequired,
    myPrivateLists: PropTypes.array.isRequired,
};
