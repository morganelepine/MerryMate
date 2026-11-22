import { useState } from "react";
import PropTypes from "prop-types";
import Modal from "@/Components/Utils/Modal";
import OutlineIcon from "@/Components/Utils/OutlineIcon";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import CancelButton from "@/Components/Buttons/CancelButton";

const TRASH_PATH =
    "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0";

// Trash link that asks for confirmation in a modal before calling `onConfirm(close)`.
export default function DeleteButton({
    label,
    question,
    onConfirm,
    processing = false,
    className = "",
}) {
    const [confirming, setConfirming] = useState(false);
    const close = () => setConfirming(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setConfirming(true)}
                className={`inline-flex items-center gap-1.5 py-1 text-sm text-orange-700 hover:text-orange-900 hover:underline underline-offset-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 ${className}`}
            >
                <OutlineIcon path={TRASH_PATH} className="h-4 w-4" />
                {label}
            </button>

            <Modal show={confirming} onClose={close}>
                <div className="flex flex-col items-center p-6">
                    <Modal.Title
                        as="h2"
                        className="text-lg text-center font-medium"
                    >
                        {question}
                    </Modal.Title>

                    <div className="mt-4">
                        <PrimaryButton
                            size="small"
                            onClick={(e) => {
                                e.preventDefault();
                                onConfirm(close);
                            }}
                            disabled={processing}
                        >
                            Supprimer
                        </PrimaryButton>
                        <CancelButton onClick={close} />
                    </div>
                </div>
            </Modal>
        </>
    );
}

DeleteButton.propTypes = {
    label: PropTypes.node.isRequired,
    question: PropTypes.node.isRequired,
    // Receives `close`, to call when the deletion can't go through.
    onConfirm: PropTypes.func.isRequired,
    processing: PropTypes.bool,
    className: PropTypes.string,
};
