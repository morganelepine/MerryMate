import PropTypes from "prop-types";

export default function BrandHeading({ brand, count, as: Heading = "h2" }) {
    return (
        <div className="flex items-baseline gap-3">
            <Heading className="font-yeseva text-xl text-orange-600 break-words min-w-0">
                {brand}
            </Heading>
            <p className="shrink-0 text-sm text-gray-500">
                ({count} {count > 1 ? "idées" : "idée"})
            </p>
        </div>
    );
}

BrandHeading.propTypes = {
    brand: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    as: PropTypes.oneOf(["h2", "h3"]),
};
