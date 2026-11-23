import { toast } from "sonner";

const buildShareMessage = (list) =>
    `Voici le lien vers ma liste : ${route("lists.show", list.id)}\nCode secret : ${list.private_code}`;

export const shareList = async (list) => {
    const text = buildShareMessage(list);

    if (navigator.share) {
        try {
            await navigator.share({ text });
        } catch (error) {
            // The visitor closing the native share sheet isn't an error.
            if (error?.name !== "AbortError") {
                toast.error("Oops, une erreur est survenue.");
            }
        }

        return;
    }

    try {
        await navigator.clipboard.writeText(text);
        toast.success("Lien et code copiés !");
    } catch {
        toast.error("Oops, une erreur est survenue.");
    }
};
