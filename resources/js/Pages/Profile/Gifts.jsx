import { useState } from "react";
import { Head } from "@inertiajs/react";
import PropTypes from "prop-types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import IdeaSummaryCard from "@/Components/Ideas/IdeaSummaryCard";
import { PAGE_BODY } from "@/Layouts/Partials/pageContainer";
import CountBadge from "@/Components/Utils/CountBadge";

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

function YearPills({ years, selected, onSelect }) {
    return (
        <fieldset className="flex flex-wrap gap-2">
            <legend className="sr-only">Année</legend>
            {years.map(([year, yearIdeas]) => {
                const active = year === selected;
                return (
                    <button
                        key={year}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onSelect(year)}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 ${
                            active
                                ? "bg-orange-100 border-orange-200 text-orange-700"
                                : "bg-white border-gray-200 text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        {year}
                        <CountBadge
                            count={yearIdeas.length}
                            className={`border ${active ? "border-orange-600 bg-orange-600 text-white" : "bg-black/5"}`}
                        />
                    </button>
                );
            })}
        </fieldset>
    );
}

YearPills.propTypes = {
    years: PropTypes.array.isRequired,
    selected: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
};

export default function Gifts({ auth, ideas }) {
    const years = groupByYear(ideas);
    const [selectedYear, setSelectedYear] = useState(years[0]?.[0]);
    const selectedIdeas =
        years.find(([year]) => year === selectedYear)?.[1] ?? [];

    return (
        <AuthenticatedLayout
            user={auth.user}
            title="Cadeaux reçus"
            subtitle="Les cadeaux qu’on t’a offerts depuis tes listes"
        >
            <Head title="Cadeaux reçus" />

            <div className={PAGE_BODY}>
                {ideas.length > 0 ? (
                    <>
                        {years.length > 1 && (
                            <YearPills
                                years={years}
                                selected={selectedYear}
                                onSelect={setSelectedYear}
                            />
                        )}
                        <div
                            className={`space-y-3 ${years.length > 1 ? "mt-6" : ""}`}
                        >
                            {selectedIdeas.map((idea) => (
                                <IdeaSummaryCard
                                    key={idea.id}
                                    idea={idea}
                                    showPrice={false}
                                    giver={idea.status_user || null}
                                />
                            ))}
                        </div>
                    </>
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
