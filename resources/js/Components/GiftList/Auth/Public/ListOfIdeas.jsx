import { Head } from "@inertiajs/react";
import PropTypes from "prop-types";
import Ideas from "@/Components/Ideas/PublicList/Idea";
import BrandMembership from "@/Components/Ideas/BrandMembership";

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
        <>
            <Head title="Consulter ma liste" />

            <div className="w-full space-y-8">
                {Object.entries(groupedIdeas).map(([brand, brandData]) => (
                    <div key={brand} className="">
                        <div className="inline-flex items-center w-full">
                            <p className="min-w-max py-1 px-3 text-sm bg-orange-500 text-white rounded-full">
                                {brand}
                            </p>
                            <hr className="w-full h-px mt-3 mb-2 bg-orange-100 border-0"></hr>
                        </div>
                        <BrandMembership membership={brandData.membership} />
                        {brandData.ideas.map((idea, index) => (
                            <div key={idea.id}>
                                <Ideas idea={idea} index={index} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
}

ListOfIdeas.propTypes = {
    ideas: PropTypes.array,
};
