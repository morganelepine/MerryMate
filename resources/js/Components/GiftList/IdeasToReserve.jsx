import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Head } from "@inertiajs/react";
import IdeasAvailable from "@/Components/Ideas/UserList/Ideas_available";
import IdeasReserved from "@/Components/Ideas/UserList/Ideas_reserved";
import IdeasPurchased from "@/Components/Ideas/UserList/Ideas_purchased";
import BrandNote from "@/Components/Ideas/BrandNote";
import BrandHeading from "@/Components/Ideas/BrandHeading";
import { groupByBrand } from "@/Components/Ideas/ideaHelpers";
import { STATUS_ICONS } from "@/Components/Ideas/statusIcons";
import { NAV_ICONS } from "@/Components/Utils/navIcons";
import CountBadge from "@/Components/Utils/CountBadge";
import {
    LIST_HEADER_BAND,
    LIST_WIDTH,
    PAGE_BOTTOM,
    PAGE_GUTTER,
} from "@/Layouts/Partials/pageContainer";

const ICONS = { ...STATUS_ICONS, gift: NAV_ICONS.gifts };

const TABS = {
    available: {
        label: "Dispo",
        title: "Idées disponibles",
        icon: "gift",
        empty: "Toutes les idées ont trouvé preneur pour le moment. Reviens plus tard !",
        text: "text-orange-600",
        band: "",
        activeTab: "bg-orange-50 border-orange-300 text-orange-700",
    },
    reserved: {
        label: "Réservé",
        title: "Cadeaux réservés",
        icon: "reserve",
        empty: "Aucun cadeau réservé pour le moment.",
        text: "text-lilac-600",
        band: "bg-lilac-50",
        activeTab: "bg-lilac-50 border-lilac-300 text-lilac-800",
    },
    purchased: {
        label: "Acheté",
        title: "Cadeaux achetés",
        icon: "purchase",
        empty: "Aucun cadeau acheté pour le moment.",
        text: "text-sage-600",
        band: "bg-sage-50",
        activeTab: "bg-sage-50 border-sage-300 text-sage-800",
    },
};

const TAB_KEYS = Object.keys(TABS);

function Icon({ name, className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={className}
            aria-hidden="true"
        >
            <path d={ICONS[name]} />
        </svg>
    );
}

Icon.propTypes = {
    name: PropTypes.oneOf(Object.keys(ICONS)).isRequired,
    className: PropTypes.string,
};

// Explains the action icons next to the cards; hidden on mobile where buttons show their label.
function Hints({ items }) {
    return (
        <ul className="hidden sm:flex flex-wrap items-center justify-end gap-x-6 gap-y-1 ml-auto text-sm text-gray-500">
            {items.map(([icon, label]) => (
                <li key={label} className="inline-flex items-center gap-1.5">
                    <Icon name={icon} className="w-4 h-4" />
                    {label}
                </li>
            ))}
        </ul>
    );
}

Hints.propTypes = {
    items: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string).isRequired)
        .isRequired,
};

// The gift-list content
export default function IdeasToReserve({
    list,
    ideas_available,
    ideas_reserved,
    ideas_purchased,
    brandNotes = {},
    userName,
    canReserve = true,
}) {
    const [activeTab, setActiveTab] = useState("available");
    const tabRefs = useRef({});

    const ideasByTab = {
        available: ideas_available,
        reserved: ideas_reserved,
        purchased: ideas_purchased,
    };

    const hintsByTab = {
        available: [
            ...(canReserve ? [["reserve", "Réserve une idée"]] : []),
            ["purchase", "Indique ton achat"],
        ],
        reserved: canReserve
            ? [
                  ["purchase", "Confirme ton achat"],
                  ["cancel", "Annule ta réservation"],
              ]
            : [],
        purchased: [["cancel", "Annule ton achat"]],
    };

    const renderIdea = (idea) => {
        if (activeTab === "available") {
            return (
                <IdeasAvailable
                    key={idea.id}
                    idea={idea}
                    userName={userName}
                    canReserve={canReserve}
                />
            );
        }
        const Component =
            activeTab === "reserved" ? IdeasReserved : IdeasPurchased;
        return <Component key={idea.id} idea={idea} userName={userName} />;
    };

    // WAI-ARIA tabs pattern: arrow keys move between tabs.
    const onTabKeyDown = (e) => {
        const index = TAB_KEYS.indexOf(activeTab);
        const moves = {
            ArrowRight: index + 1,
            ArrowLeft: index - 1,
            Home: 0,
            End: TAB_KEYS.length - 1,
        };
        if (!(e.key in moves)) return;
        e.preventDefault();
        const next =
            TAB_KEYS[(moves[e.key] + TAB_KEYS.length) % TAB_KEYS.length];
        setActiveTab(next);
        tabRefs.current[next]?.focus();
    };

    const tab = TABS[activeTab];
    const ideas = ideasByTab[activeTab];
    const isEmptyList = TAB_KEYS.every((key) => ideasByTab[key].length === 0);

    return (
        <>
            <Head title={`${list.name} de ${list.user_name}`} />

            {isEmptyList ? (
                <p
                    className={`w-full ${LIST_WIDTH} ${PAGE_GUTTER} py-10 text-center`}
                >
                    Cette liste est vide pour le moment. Reviens plus tard !
                </p>
            ) : (
                <>
                    <div
                        className={`${LIST_HEADER_BAND} border-b border-gray-200`}
                    >
                        <div
                            role="tablist"
                            aria-label="Statut des idées"
                            className={`${LIST_WIDTH} ${PAGE_GUTTER} grid grid-cols-3 gap-1.5 sm:gap-3 pt-4 pb-6 sm:pt-6 sm:pb-8`}
                        >
                            {TAB_KEYS.map((key) => {
                                const selected = key === activeTab;
                                return (
                                    <button
                                        key={key}
                                        ref={(el) =>
                                            (tabRefs.current[key] = el)
                                        }
                                        type="button"
                                        role="tab"
                                        id={`tab-${key}`}
                                        aria-selected={selected}
                                        aria-controls="tab-panel"
                                        tabIndex={selected ? 0 : -1}
                                        onClick={() => setActiveTab(key)}
                                        onKeyDown={onTabKeyDown}
                                        className={`flex min-w-0 items-center justify-center gap-1 sm:gap-2 rounded-full border px-1.5 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 ${
                                            selected
                                                ? TABS[key].activeTab
                                                : "bg-white border-gray-200 text-gray-600 hover:text-gray-900"
                                        }`}
                                    >
                                        <span className="truncate">
                                            {TABS[key].label}
                                        </span>
                                        <CountBadge
                                            count={ideasByTab[key].length}
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <section
                        id="tab-panel"
                        role="tabpanel"
                        aria-labelledby={`tab-${activeTab}`}
                        className={`flex-1 ${tab.band}`}
                    >
                        <div
                            className={`${LIST_WIDTH} ${PAGE_GUTTER} pt-8 sm:pt-10 ${PAGE_BOTTOM}`}
                        >
                            <div className="flex items-center gap-3 sm:gap-4">
                                <span
                                    className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full bg-white shadow-sm ${tab.text}`}
                                >
                                    <Icon
                                        name={tab.icon}
                                        className="w-5 h-5 sm:w-6 sm:h-6"
                                    />
                                </span>
                                <h2
                                    className={`font-yeseva text-2xl ${tab.text}`}
                                >
                                    {tab.title}
                                </h2>
                                {ideas.length > 0 &&
                                    hintsByTab[activeTab].length > 0 && (
                                        <Hints items={hintsByTab[activeTab]} />
                                    )}
                            </div>

                            {activeTab === "reserved" && !canReserve && (
                                <p className="mt-3 text-sm text-gray-500">
                                    La réservation d'un cadeau n'est possible
                                    qu'en étant connecté·e.
                                </p>
                            )}

                            {ideas.length === 0 ? (
                                <p className="mt-8 text-gray-600">
                                    {tab.empty}
                                </p>
                            ) : (
                                <div className="mt-8 space-y-10">
                                    {groupByBrand(ideas).map((group) => (
                                        <div key={group.brand}>
                                            <BrandHeading
                                                as="h3"
                                                brand={group.brand}
                                                color={TABS[activeTab].text}
                                            />
                                            {activeTab === "available" && (
                                                <BrandNote
                                                    content={
                                                        brandNotes[group.brand]
                                                    }
                                                />
                                            )}
                                            <div className="mt-4 space-y-3">
                                                {group.ideas.map(renderIdea)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </>
            )}
        </>
    );
}

IdeasToReserve.propTypes = {
    list: PropTypes.shape({
        name: PropTypes.string.isRequired,
        user_name: PropTypes.string.isRequired,
    }).isRequired,
    ideas_available: PropTypes.array,
    ideas_reserved: PropTypes.array,
    ideas_purchased: PropTypes.array,
    brandNotes: PropTypes.objectOf(PropTypes.string),
    userName: PropTypes.string,
    canReserve: PropTypes.bool,
};
