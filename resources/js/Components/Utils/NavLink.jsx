import { Link } from "@inertiajs/react";

const navItemClasses = (active) =>
    "relative inline-flex items-center gap-1.5 self-center px-3 py-2 rounded-full text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 " +
    (active
        ? "bg-orange-100 text-orange-700"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50");

export default function NavLink({
    active = false,
    className = "",
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            aria-current={active ? "page" : undefined}
            className={`${navItemClasses(active)} ${className}`}
        >
            {children}
        </Link>
    );
}
