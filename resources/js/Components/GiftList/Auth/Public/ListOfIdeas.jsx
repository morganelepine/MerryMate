import PropTypes from "prop-types";
import Ideas from "@/Components/Ideas/PublicList/Idea";
import BrandNoteEditor from "@/Components/Ideas/BrandNoteEditor";
import BrandHeading from "@/Components/Ideas/BrandHeading";
import { groupByBrand, NO_BRAND } from "@/Components/Ideas/ideaHelpers";

export default function ListOfIdeas({ ideas, brandNotes = {} }) {
    return (
        <div className="space-y-12">
            {groupByBrand(ideas).map((brandData) => (
                <section key={brandData.brand}>
                    <BrandHeading
                        brand={brandData.brand}
                        count={brandData.ideas.length}
                        color="text-orange-600"
                    />
                    {brandData.brand && brandData.brand !== NO_BRAND && (
                        <BrandNoteEditor
                            brand={brandData.brand}
                            content={brandNotes[brandData.brand]}
                        />
                    )}
                    <div className="mt-4 space-y-3">
                        {brandData.ideas.map((idea) => (
                            <Ideas key={idea.id} idea={idea} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}

ListOfIdeas.propTypes = {
    ideas: PropTypes.array,
    brandNotes: PropTypes.objectOf(PropTypes.string),
};
