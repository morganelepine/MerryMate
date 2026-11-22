import { STATUS_VARIANTS } from "@/Components/Ideas/ideaCard";
import { getPaidPrice } from "@/Components/Ideas/ideaHelpers";

export const BUDGET_ICONS = {
    wallet: "M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3",
    bulb: "M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18",
    calendar:
        "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5",
    userPlus:
        "M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z",
    check: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
    plus: "M12 4.5v15m7.5-7.5h-15",
    bookmark:
        "M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z",
};

export const GIFT_STATUS = {
    purchased: {
        label: "Acheté",
        icon: BUDGET_ICONS.check,
        badge: STATUS_VARIANTS.purchased.badgeMine,
    },
    idea: {
        label: "Idée",
        icon: BUDGET_ICONS.bulb,
        badge: "bg-orange-50 border-orange-100 text-orange-700",
    },
    // MerryMate reservations only: not toggled from the budget.
    reserved: {
        label: STATUS_VARIANTS.reserved.label,
        icon: BUDGET_ICONS.bookmark,
        badge: STATUS_VARIANTS.reserved.badgeMine,
    },
};

// `filter` is the plural used by the occasion filter.
export const OCCASIONS = {
    christmas: { label: "Noël", filter: "Noël" },
    birthday: { label: "Anniversaire", filter: "Anniversaires" },
    other: { label: "Autre", filter: "Autres" },
};
export const ALL_OCCASIONS = "all";
export const DEFAULT_OCCASION = "christmas";

export const matchesOccasion = (occasion, filter) =>
    filter === ALL_OCCASIONS || occasion === filter;

export const otherStatus = (status) =>
    status === "purchased" ? "idea" : "purchased";

// Full class names so Tailwind keeps them; cycled through by card position.
const CARD_ACCENTS = [
    "border-t-amber-400",
    "border-t-teal-600",
    "border-t-slate-700",
    "border-t-orange-500",
    "border-t-lilac-600",
    "border-t-sage-600",
];

export const formatGiftCount = (count) =>
    `${count} ${count > 1 ? "cadeaux" : "cadeau"}`;

// Summed in cents to avoid floating-point drift (0.1 + 0.2).
const toCents = (price) => Math.round((price ?? 0) * 100);

const nameKey = (name) => name.trim().toLocaleLowerCase("fr");

/**
 * One card per budget recipient, then one per person bought for in MerryMate
 * who isn't one of them. MerryMate reservations and purchases count as bought.
 */
export function buildBudget(recipients, ideas, occasion) {
    const cards = recipients.map((recipient) => ({
        key: `recipient-${recipient.id}`,
        name: recipient.name,
        recipient,
        gifts: recipient.gifts.filter((gift) =>
            matchesOccasion(gift.occasion, occasion),
        ),
        ideas: [],
    }));
    const byName = new Map(cards.map((card) => [nameKey(card.name), card]));

    for (const idea of ideas) {
        if (!matchesOccasion(idea.occasion, occasion)) continue;

        const key = nameKey(idea.user_name ?? "");
        if (!byName.has(key)) {
            const card = {
                key: `merrymate-${key}`,
                name: idea.user_name,
                recipient: null,
                gifts: [],
                ideas: [],
            };
            byName.set(key, card);
            cards.push(card);
        }
        byName.get(key).ideas.push(idea);
    }

    const totals = { purchased: 0, purchasedCount: 0, idea: 0, ideaCount: 0 };

    const withTotals = cards.map((card, index) => {
        let cents = 0;
        for (const gift of card.gifts) {
            cents += toCents(gift.price);
            totals[gift.status] += toCents(gift.price);
            totals[`${gift.status}Count`] += 1;
        }
        for (const idea of card.ideas) {
            cents += toCents(getPaidPrice(idea));
            totals.purchased += toCents(getPaidPrice(idea));
            totals.purchasedCount += 1;
        }
        return {
            ...card,
            accent: CARD_ACCENTS[index % CARD_ACCENTS.length],
            count: card.gifts.length + card.ideas.length,
            total: cents / 100,
        };
    });

    return {
        cards: withTotals,
        totals: {
            all: (totals.purchased + totals.idea) / 100,
            purchased: totals.purchased / 100,
            purchasedCount: totals.purchasedCount,
            idea: totals.idea / 100,
            ideaCount: totals.ideaCount,
        },
    };
}

export const BUDGET_FORM = "space-y-3 rounded-xl bg-cream p-3";
export const BUDGET_ROW = "py-3";
export const BUDGET_ROW_PRICE =
    "shrink-0 text-sm font-semibold text-gray-900 tabular-nums";
// Status icon, title, price, centred on one line.
export const BUDGET_ROW_LAYOUT = "flex items-center gap-3";
export const BUDGET_ROW_TEXT = "min-w-0 flex-1";

// Focus targets for when the focused element disappears (deletion, card re-created).
export const BUDGET_CARDS_TITLE_ID = "budget-cards-title";
export const cardAddButtonId = (name) =>
    `budget-add-${nameKey(name).replace(/\s+/g, "-")}`;

// After Inertia re-renders the page with the new props.
export const focusById = (id) =>
    requestAnimationFrame(() => document.getElementById(id)?.focus());
