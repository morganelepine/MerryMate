import { useForm } from "@inertiajs/react";

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
    membership: "",
    membership_reduction: "",
};

export default function useIdeaForm({ auth, list, idea = null, onSuccess }) {
    const isEditing = Boolean(idea);

    const form = useForm(
        isEditing
            ? {
                  user_name: auth.user.name,
                  idea: idea.idea,
                  brand: idea.brand,
                  link: idea.link,
                  details: idea.details,
                  price: idea.price,
                  favorite: idea.favorite,
                  is_multiple: idea.is_multiple,
                  membership: idea.membership,
                  membership_reduction: idea.membership_reduction,
                  promo: idea.promo,
                  promo_details: idea.promo_details,
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

        if (isEditing) {
            patch(route("ideas.update", idea.id), {
                onSuccess: () => onSuccess?.(),
            });
            return;
        }

        if (!data.brand) {
            data.brand = "Sans marque";
        }

        post(route("ideas.store"), {
            onSuccess: () => reset(),
            onError: (errors) => console.error(errors),
        });
    };

    return { ...form, isEditing, submit };
}
