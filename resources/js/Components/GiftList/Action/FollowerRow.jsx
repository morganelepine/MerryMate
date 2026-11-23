import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import InitialsAvatar from "@/Components/Utils/InitialsAvatar";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import CancelButton from "@/Components/Buttons/CancelButton";
import useDisclosure from "@/hooks/useDisclosure";

export default function FollowerRow({ list, follower, onRemoved }) {
    const { isOpen, open, close, triggerRef } = useDisclosure();
    const questionRef = useRef(null);
    const { delete: destroy, processing } = useForm();
    const fullName = [follower.name, follower.last_name]
        .filter(Boolean)
        .join(" ");

    useEffect(() => {
        if (isOpen) {
            questionRef.current?.focus();
        }
    }, [isOpen]);

    const removeFollower = () =>
        destroy(
            route("lists.removeFollower", {
                list: list.id,
                follower: follower.id,
            }),
            {
                only: ["followers"],
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(`${fullName} ne suit plus ta liste`);
                    onRemoved();
                },
                onError: () => toast.error("Oops, une erreur est survenue."),
            },
        );

    return (
        <li className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3">
            <InitialsAvatar
                name={follower.name}
                lastName={follower.last_name}
            />
            {isOpen ? (
                <>
                    <p
                        ref={questionRef}
                        tabIndex={-1}
                        className="min-w-0 flex-1 basis-40 break-words text-sm focus:outline-none"
                    >
                        Retirer{" "}
                        <span className="font-semibold">{fullName}</span> ?
                    </p>
                    <div className="ml-auto flex items-center">
                        <CancelButton onClick={close} disabled={processing} />
                        <PrimaryButton
                            type="button"
                            size="small"
                            onClick={removeFollower}
                            disabled={processing}
                        >
                            Retirer
                        </PrimaryButton>
                    </div>
                </>
            ) : (
                <>
                    <span className="min-w-0 flex-1 break-words text-gray-900">
                        {fullName}
                    </span>
                    <button
                        ref={triggerRef}
                        type="button"
                        onClick={open}
                        aria-label={`Retirer ${fullName}`}
                        className="shrink-0 px-1 py-1 text-sm text-orange-700 hover:text-orange-900 hover:underline underline-offset-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-300"
                    >
                        Retirer
                    </button>
                </>
            )}
        </li>
    );
}

FollowerRow.propTypes = {
    list: PropTypes.shape({
        id: PropTypes.number.isRequired,
    }).isRequired,
    follower: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        last_name: PropTypes.string,
    }).isRequired,
    // Called once the row is gone, to move the focus somewhere else.
    onRemoved: PropTypes.func.isRequired,
};
