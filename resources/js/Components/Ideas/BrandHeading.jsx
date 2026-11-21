import PropTypes from "prop-types";
import { formatIdeaCount } from "@/Components/Ideas/ideaHelpers";

export default function BrandHeading({
    brand,
    count,
    as: Heading = "h2",
    color,
}) {
    return (
        <div className="flex items-baseline gap-2">
            <Heading
                className={`font-semibold text-lg break-words min-w-0 ${color}`}
            >
                {brand}
            </Heading>
            <p className="shrink-0 text-sm text-gray-500">
                ({formatIdeaCount(count)})
            </p>
        </div>
    );
}

BrandHeading.propTypes = {
    brand: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    as: PropTypes.oneOf(["h2", "h3"]),
};
