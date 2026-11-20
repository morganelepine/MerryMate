import { CARD_SURFACE } from "@/Components/Utils/surfaces";

export const LIST_CARD = `flex items-center gap-3 p-4 ${CARD_SURFACE}`;

export const formatListDate = (list) =>
    list.isEmpty
        ? `Créée le ${list.formatted_created_at}`
        : `Mise à jour le ${list.formatted_updated_at}`;

export const formatOwner = (list) =>
    [list.user_name, list.user_lastname].filter(Boolean).join(" ");
