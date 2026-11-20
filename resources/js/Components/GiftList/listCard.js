export const LIST_CARD =
    "flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm";

export const formatListDate = (list) =>
    list.isEmpty
        ? `Créée le ${list.formatted_created_at}`
        : `Mise à jour le ${list.formatted_updated_at}`;
