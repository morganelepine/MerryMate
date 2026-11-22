import { useId, useMemo, useState } from "react";
import { Head, router } from "@inertiajs/react";
import PropTypes from "prop-types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import Modal from "@/Components/Utils/Modal";
import OutlineIcon from "@/Components/Utils/OutlineIcon";
import { CARD_SURFACE } from "@/Components/Utils/surfaces";
import { NAV_ICONS } from "@/Components/Utils/navIcons";
import { INPUT_CLASSES } from "@/Components/Utils/TextInput";
import BudgetStat from "@/Components/Profile/Budget/BudgetStat";
import BudgetRecipientCard from "@/Components/Profile/Budget/BudgetRecipientCard";
import BudgetRecipientForm from "@/Components/Profile/Budget/BudgetRecipientForm";
import OccasionFilter from "@/Components/Profile/Budget/OccasionFilter";
import {
    BUDGET_CARDS_TITLE_ID,
    BUDGET_ICONS,
    ALL_OCCASIONS,
    DEFAULT_OCCASION,
    OCCASIONS,
    buildBudget,
    formatGiftCount,
} from "@/Components/Profile/Budget/budgetHelpers";
import { formatIdeaCount, formatPrice } from "@/Components/Ideas/ideaHelpers";
import {
    HOME_WIDTH,
    PAGE_BOTTOM,
    PAGE_GUTTER,
} from "@/Layouts/Partials/pageContainer";

const BUDGET_PROPS = ["ideas", "recipients", "year", "years"];

export default function Budget({ auth, ideas, recipients, year, years }) {
    const [addingRecipient, setAddingRecipient] = useState(false);
    const [occasion, setOccasion] = useState(DEFAULT_OCCASION);
    const yearId = useId();
    const { cards, totals } = useMemo(
        () => buildBudget(recipients, ideas, occasion),
        [recipients, ideas, occasion],
    );
    const occasionLabel =
        occasion === ALL_OCCASIONS
            ? "Toutes occasions"
            : OCCASIONS[occasion].filter;

    const changeYear = (e) =>
        router.get(
            route("profile.purchase"),
            { year: e.target.value },
            { preserveScroll: true, preserveState: true, only: BUDGET_PROPS },
        );

    return (
        <AuthenticatedLayout
            user={auth.user}
            title="Budget cadeaux"
            subtitle="Distingue tes idées de tes achats et suis les dépenses pour chaque proche, année par année."
            headerWidth={HOME_WIDTH}
            actions={
                <PrimaryButton
                    size="medium"
                    onClick={() => setAddingRecipient(true)}
                    className="gap-2"
                >
                    <OutlineIcon
                        path={BUDGET_ICONS.userPlus}
                        className="h-4 w-4"
                    />
                    Ajouter une personne
                </PrimaryButton>
            }
        >
            <Head title="Budget cadeaux" />

            <div
                className={`${HOME_WIDTH} ${PAGE_GUTTER} pt-8 sm:pt-10 ${PAGE_BOTTOM} space-y-6`}
            >
                <div
                    className={`${CARD_SURFACE} flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between`}
                >
                    <div>
                        <p className="flex items-center gap-2 font-semibold text-gray-900">
                            <OutlineIcon
                                path={BUDGET_ICONS.calendar}
                                className="h-5 w-5 text-orange-600"
                            />
                            Filtres
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <OccasionFilter
                            value={occasion}
                            onChange={setOccasion}
                        />
                        <label htmlFor={yearId} className="sr-only">
                            Année
                        </label>
                        <select
                            id={yearId}
                            value={year}
                            onChange={changeYear}
                            className={`${INPUT_CLASSES} !mt-0 sm:w-32`}
                        >
                            {years.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    <BudgetStat
                        icon={BUDGET_ICONS.wallet}
                        iconClassName="bg-lilac-100 text-lilac-800"
                        label="Budget total"
                        value={formatPrice(totals.all)}
                        hint="Idées et achats"
                    />
                    <BudgetStat
                        icon={NAV_ICONS.gifts}
                        iconClassName="bg-sage-100 text-sage-800"
                        label="Achats"
                        value={formatPrice(totals.purchased)}
                        hint={formatGiftCount(totals.purchasedCount)}
                    />
                    <BudgetStat
                        icon={BUDGET_ICONS.bulb}
                        iconClassName="bg-orange-100 text-orange-700"
                        label="Idées"
                        value={formatPrice(totals.idea)}
                        hint={formatIdeaCount(totals.ideaCount)}
                    />
                    <BudgetStat
                        icon={NAV_ICONS.followed}
                        iconClassName="bg-blue-100 text-blue-800"
                        label="Proches"
                        value={cards.length}
                    />
                </div>

                <section
                    aria-labelledby={BUDGET_CARDS_TITLE_ID}
                    className="pt-4"
                >
                    <div className="border-b border-gray-200 pb-4">
                        {/* Focusable by script: focus lands here once a card is deleted. */}
                        <h2
                            id={BUDGET_CARDS_TITLE_ID}
                            tabIndex={-1}
                            className="font-yeseva text-xl text-gray-900 focus:outline-none"
                        >
                            Cadeaux par proche
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            {year} · {occasionLabel} · Clique sur un statut pour
                            le modifier.
                        </p>
                    </div>

                    {cards.length > 0 ? (
                        <div className="mt-6 grid grid-cols-1 items-start gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {cards.map((card) => (
                                <BudgetRecipientCard
                                    key={card.key}
                                    card={card}
                                    year={year}
                                    occasion={occasion}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="mt-6 text-gray-600">
                            Ajoute une personne pour commencer à suivre ton
                            budget.
                        </p>
                    )}
                </section>
            </div>

            <Modal
                show={addingRecipient}
                onClose={() => setAddingRecipient(false)}
                maxWidth="md"
            >
                <div className="p-6">
                    <Modal.Title
                        as="h2"
                        className="font-yeseva text-xl text-gray-900"
                    >
                        Ajouter une personne
                    </Modal.Title>
                    <BudgetRecipientForm
                        onClose={() => setAddingRecipient(false)}
                        className="mt-4"
                    />
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}

Budget.propTypes = {
    auth: PropTypes.object.isRequired,
    ideas: PropTypes.array.isRequired,
    recipients: PropTypes.array.isRequired,
    year: PropTypes.number.isRequired,
    years: PropTypes.arrayOf(PropTypes.number).isRequired,
};
