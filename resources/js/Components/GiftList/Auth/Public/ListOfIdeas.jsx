import PropTypes from "prop-types";
import Ideas from "@/Components/Ideas/PublicList/Idea";
import BrandMembership from "@/Components/Ideas/BrandMembership";
import BrandHeading from "@/Components/Ideas/BrandHeading";
import { groupByBrand } from "@/Components/Ideas/ideaHelpers";

export default function ListOfIdeas({ ideas }) {
    return (
        <div className="space-y-12">
            {groupByBrand(ideas).map((brandData) => (
                <section key={brandData.brand}>
                    <BrandHeading
                        brand={brandData.brand}
                        count={brandData.ideas.length}
                        color="text-orange-600"
                    />
                    <BrandMembership membership={brandData.membership} />
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
};
