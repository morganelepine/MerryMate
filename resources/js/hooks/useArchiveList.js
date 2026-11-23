import { useForm } from "@inertiajs/react";
import { toast } from "sonner";

export default function useArchiveList(list, onArchived) {
    const { patch, processing } = useForm();

    const archiveList = () =>
        patch(route("lists.archive", list.id), {
            onSuccess: () => {
                onArchived();
                toast.success("Liste archivée !");
            },
            onError: (errors) => {
                console.error(
                    "Erreur lors de l'archivage de la liste :",
                    errors,
                );
                toast.error(
                    "Oops, une erreur est survenue lors de l'archivage.",
                );
            },
        });

    return { archiveList, processing };
}
