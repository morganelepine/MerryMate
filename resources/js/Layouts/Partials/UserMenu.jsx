import PropTypes from "prop-types";
import { Link } from "@inertiajs/react";
import { Menu } from "@headlessui/react";
import OutlineIcon from "@/Components/Utils/OutlineIcon";
import { CHEVRON_DOWN, MENU_ITEM, MENU_PANEL } from "@/Components/Utils/menu";

const ITEM = `block py-2 ${MENU_ITEM}`;

export default function UserMenu({ user }) {
    return (
        <div className="hidden lg:flex lg:items-center lg:ml-6">
            <Menu as="div" className="ml-3 relative">
                <Menu.Button className="inline-flex items-center pl-3 py-2 text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 transition ease-in-out duration-150">
                    {user.name}
                    <OutlineIcon
                        path={CHEVRON_DOWN}
                        className="ml-2 -mr-0.5 h-4 w-4"
                    />
                </Menu.Button>

                <Menu.Items className={`${MENU_PANEL} right-0 w-36`}>
                    <Menu.Item>
                        <Link href={route("profile.edit")} className={ITEM}>
                            Mon profil
                        </Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link href={route("profile.purchase")} className={ITEM}>
                            Budget
                        </Link>
                    </Menu.Item>
                    <Menu.Item>
                        <Link href={route("profile.gifts")} className={ITEM}>
                            Cadeaux reçus
                        </Link>
                    </Menu.Item>
                    <hr className="my-1 border-gray-100" />
                    <Menu.Item>
                        <Link
                            href={route("logout")}
                            method="post"
                            as="button"
                            className={ITEM}
                        >
                            Déconnexion
                        </Link>
                    </Menu.Item>
                </Menu.Items>
            </Menu>
        </div>
    );
}

UserMenu.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }).isRequired,
};
