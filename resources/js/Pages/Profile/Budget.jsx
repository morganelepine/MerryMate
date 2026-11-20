import { Head } from "@inertiajs/react";
import PropTypes from "prop-types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import BudgetIdeasPurchased from "@/Components/Profile/Budget/BudgetIdeasPurchased";
import SectionHeader from "@/Components/Utils/SectionHeader";
import OutlineButton from "@/Components/Buttons/OutlineButton";
import { PAGE_BODY } from "@/Layouts/Partials/pageContainer";

// Purchases grouped by the person they were bought for, with a subtotal each.
function groupByRecipient(ideas) {
    const groups = new Map();
    for (const idea of ideas) {
        if (!groups.has(idea.user_name)) {
            groups.set(idea.user_name, { ideas: [], total: 0 });
        }
        const group = groups.get(idea.user_name);
        group.ideas.push(idea);
        group.total += idea.price ?? 0;
    }
    return [...groups.entries()];
}

export default function Budget({ auth, ideas, totalPrice }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            title="Mon budget"
            subtitle="Les cadeaux que vous avez achetés pour vos proches"
            actions={
                ideas.length > 0 ? (
                    <p className="text-right">
                        <span className="block text-xs text-gray-500">
                            Total dépensé
                        </span>
                        <span className="font-yeseva text-2xl text-gray-900">
                            {totalPrice} €
                        </span>
                    </p>
                ) : (
                    <OutlineButton
                        size="medium"
                        href={route("lists.followedLists")}
                    >
                        Voir mes listes suivies
                    </OutlineButton>
                )
            }
        >
            <Head title="Mon budget" />

            <div className={PAGE_BODY}>
                {ideas.length > 0 ? (
                    <div className="space-y-12">
                        {groupByRecipient(ideas).map(([recipient, group]) => (
                            <section key={recipient}>
                                <SectionHeader
                                    title={`Pour ${recipient}`}
                                    count={group.ideas.length}
                                    action={
                                        <p className="font-semibold text-gray-900">
                                            {group.total} €
                                        </p>
                                    }
                                />
                                <div className="mt-4 space-y-3">
                                    {group.ideas.map((idea) => (
                                        <BudgetIdeasPurchased
                                            key={idea.id}
                                            idea={idea}
                                        />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">
                        Vous n’avez effectué aucun achat pour le moment.
                    </p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

Budget.propTypes = {
    auth: PropTypes.object.isRequired,
    ideas: PropTypes.array.isRequired,
    totalPrice: PropTypes.number,
};
