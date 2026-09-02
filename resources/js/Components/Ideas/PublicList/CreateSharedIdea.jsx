import PropTypes from "prop-types";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import IdeaFormFields from "@/Components/Ideas/Form/IdeaFormFields";
import useIdeaForm from "@/hooks/useIdeaForm";

export default function CreateSharedIdea({ auth, list }) {
    const { data, setData, errors, processing, submit } = useIdeaForm({
        auth,
        list,
    });

    return (
        <form onSubmit={submit} className="flex flex-col">
            <IdeaFormFields
                variant="create"
                data={data}
                setData={setData}
                errors={errors}
            />

            <PrimaryButton
                className="mt-8 max-w-max sm:self-auto self-center"
                disabled={processing}
            >
                Ajouter l'idée
            </PrimaryButton>
        </form>
    );
}

CreateSharedIdea.propTypes = {
    auth: PropTypes.object.isRequired,
    list: PropTypes.object,
};
