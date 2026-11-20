import { Head } from "@inertiajs/react";
import PropTypes from "prop-types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import BudgetIdeasPurchased from "@/Components/Profile/Budget/BudgetIdeasPurchased";
import SectionHeader from "@/Components/Utils/SectionHeader";
import { PAGE_BODY } from "@/Layouts/Partials/pageContainer";

// Most recent year first.
function groupByYear(ideas) {
    const groups = new Map();
    for (const idea of ideas) {
        const year = new Date(idea.updated_at).getFullYear();
        if (!groups.has(year)) groups.set(year, []);
        groups.get(year).push(idea);
    }
    return [...groups.entries()].sort(([a], [b]) => b - a);
}

export default function Gifts({ auth, ideas }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            title="Cadeaux reçus"
            subtitle="Les cadeaux qu’on t’a offerts depuis tes listes"
        >
            <Head title="Cadeaux reçus" />

            <div className={PAGE_BODY}>
                {ideas.length > 0 ? (
                    <div className="space-y-12">
                        {groupByYear(ideas).map(([year, yearIdeas]) => (
                            <section key={year}>
                                <SectionHeader
                                    title={String(year)}
                                    count={yearIdeas.length}
                                />
                                <div className="mt-4 space-y-3">
                                    {yearIdeas.map((idea) => (
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
                        Tu n’as reçu aucun cadeau provenant de tes listes pour
                        le moment.
                    </p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

Gifts.propTypes = {
    auth: PropTypes.object.isRequired,
    ideas: PropTypes.array.isRequired,
};
