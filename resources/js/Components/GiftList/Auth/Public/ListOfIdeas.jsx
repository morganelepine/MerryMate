import PropTypes from "prop-types";
import Ideas from "@/Components/Ideas/PublicList/Idea";
import BrandMembership from "@/Components/Ideas/BrandMembership";
import BrandHeading from "@/Components/Ideas/BrandHeading";

export default function ListOfIdeas({ ideas }) {
    // Regrouper les idées par marque
    const groupedIdeas = ideas.reduce((ideasByBrand, idea) => {
        const { brand, ...rest } = idea;

        if (!ideasByBrand[brand]) {
            ideasByBrand[brand] = { brand, ideas: [rest] };
        } else {
            ideasByBrand[brand].ideas.push(rest);
        }

        return ideasByBrand;
    }, {});

    // An idea with a membership link already entered applies to the entire brand
    Object.values(groupedIdeas).forEach((brandData) => {
        brandData.membership = brandData.ideas.find((idea) => idea.membership);
    });

    return (
        <div className="space-y-12">
            {Object.entries(groupedIdeas).map(([brand, brandData]) => (
                <section key={brand}>
                    <BrandHeading
                        brand={brand}
                        count={brandData.ideas.length}
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
