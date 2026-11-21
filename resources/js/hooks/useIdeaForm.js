import { useForm } from "@inertiajs/react";
import { NO_BRAND, priceToInput } from "@/Components/Ideas/ideaHelpers";

const EMPTY_IDEA = {
    idea: "",
    brand: "",
    link: "",
    details: "",
    price: "",
    favorite: 0,
    is_multiple: 0,
    promo: 0,
    promo_details: "",
};

export default function useIdeaForm({ auth, list, idea = null, onSuccess }) {
    const isEditing = Boolean(idea);

    const form = useForm(
        isEditing
            ? {
                  user_name: auth.user.name,
                  // Empty columns come back as null, which React inputs refuse as a value.
                  ...Object.fromEntries(
                      Object.entries(EMPTY_IDEA).map(([key, empty]) => [
                          key,
                          idea[key] ?? empty,
                      ]),
                  ),
                  price: priceToInput(idea.price),
              }
            : {
                  list_id: list.id,
                  user_name: auth.user.name,
                  ...EMPTY_IDEA,
                  status: "available",
                  status_user: "",
                  status_user_id: null,
              },
    );

    const { data, post, patch, reset } = form;

    const submit = (e) => {
        e.preventDefault();

        if (!data.brand) {
            data.brand = NO_BRAND;
        }

        if (isEditing) {
            patch(route("ideas.update", idea.id), {
                onSuccess: () => onSuccess?.(),
            });
            return;
        }

        post(route("ideas.store"), {
            onSuccess: () => reset(),
            onError: (errors) => console.error(errors),
        });
    };

    return { ...form, isEditing, submit };
}
