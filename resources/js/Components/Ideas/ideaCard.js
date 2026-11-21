export const IDEA_CARD_BASE =
    "p-4 flex flex-1 flex-col min-w-0 bg-white border rounded-2xl shadow-sm";

export const IDEA_CARD = `${IDEA_CARD_BASE} border-gray-200`;

// Filled when it's the viewer's own action, outlined when someone else's.
export const STATUS_VARIANTS = {
    reserved: {
        label: "Réservé",
        card: "border-lilac-300",
        badgeMine: "bg-lilac-100 border-lilac-100 text-lilac-800",
        badgeOther: "bg-white border-lilac-300 text-lilac-800",
    },
    purchased: {
        label: "Acheté",
        card: "border-sage-300",
        badgeMine: "bg-sage-100 border-sage-100 text-sage-800",
        badgeOther: "bg-white border-sage-300 text-sage-800",
    },
};

// Fixed width so cards line up whether or not the viewer can act on them.
export const IDEA_ACTIONS =
    "flex sm:flex-col sm:w-6 shrink-0 mr-2 mb-1 sm:mb-0";
