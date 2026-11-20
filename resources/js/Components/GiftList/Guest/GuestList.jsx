import { useState } from "react";
import PropTypes from "prop-types";
import GuestListLayout from "@/Layouts/GuestListLayout";
import GuestListHeader, {
    DEFAULT_GUEST_NAME,
} from "@/Components/GiftList/Guest/GuestListHeader";
import IdeasToReserve from "@/Components/GiftList/IdeasToReserve";
import { LIST_HEADER_BAND, LIST_WIDTH } from "@/Layouts/Partials/pageContainer";

export default function GuestList({
    list,
    ideas_available,
    ideas_reserved,
    ideas_purchased,
}) {
    const [userName, setUserName] = useState(DEFAULT_GUEST_NAME);

    return (
        <GuestListLayout
            headerWidth={LIST_WIDTH}
            // Continues into the tabs rendered by IdeasToReserve.
            headerClassName={LIST_HEADER_BAND}
            // Lets the active tab panel stretch to the bottom of the screen.
            mainClassName="flex flex-col"
            header={<GuestListHeader list={list} setUserName={setUserName} />}
        >
            <IdeasToReserve
                list={list}
                ideas_available={ideas_available}
                ideas_reserved={ideas_reserved}
                ideas_purchased={ideas_purchased}
                userName={userName}
                canReserve={false}
            />
        </GuestListLayout>
    );
}

GuestList.propTypes = {
    list: PropTypes.object,
    ideas_available: PropTypes.array,
    ideas_reserved: PropTypes.array,
    ideas_purchased: PropTypes.array,
};
