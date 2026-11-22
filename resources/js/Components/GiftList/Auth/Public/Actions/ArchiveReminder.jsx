import { useState } from "react";
import PropTypes from "prop-types";
import ArchiveReminderModal from "@/Components/GiftList/Auth/Public/Actions/ArchiveReminderModal";

// The server decides when to show it: once per login after more than 30 days away.
export default function ArchiveReminder({ list, show = false }) {
    const [archiveReminderVisible, setArchiveReminderVisible] = useState(show);

    return (
        <ArchiveReminderModal
            list={list}
            modalVisible={archiveReminderVisible}
            closeModal={() => setArchiveReminderVisible(false)}
        />
    );
}

ArchiveReminder.propTypes = {
    list: PropTypes.object,
    show: PropTypes.bool,
};
