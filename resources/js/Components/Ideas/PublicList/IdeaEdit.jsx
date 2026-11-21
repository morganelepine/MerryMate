import PropTypes from "prop-types";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import CancelButton from "@/Components/Buttons/CancelButton";
import IdeaFormFields from "@/Components/Ideas/Form/IdeaFormFields";
import DeleteIdeaButton from "@/Components/Ideas/DeleteIdeaButton";
import useIdeaForm from "@/hooks/useIdeaForm";

export default function IdeaEdit({ auth, idea, onClose }) {
    const { data, setData, errors, submit, reset, clearErrors } = useIdeaForm({
        auth,
        idea,
        onSuccess: onClose,
    });

    return (
        <form onSubmit={submit}>
            <IdeaFormFields
                variant="edit"
                data={data}
                setData={setData}
                errors={errors}
            />

            <div className="flex flex-wrap items-center gap-y-2 mt-4">
                <PrimaryButton size="small">Enregistrer</PrimaryButton>
                <CancelButton
                    onClick={() => {
                        reset();
                        clearErrors();
                        onClose();
                    }}
                />
                <DeleteIdeaButton
                    idea={idea}
                    onBlocked={onClose}
                    className="ml-auto"
                />
            </div>
        </form>
    );
}

IdeaEdit.propTypes = {
    auth: PropTypes.object.isRequired,
    idea: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
};
