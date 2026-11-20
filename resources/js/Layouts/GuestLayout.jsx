import SiteBrand from "@/Layouts/Partials/SiteBrand";
import { PANEL } from "@/Components/Utils/surfaces";

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex justify-center bg-cream px-4 py-10">
            <div className="flex flex-col justify-center items-center w-full">
                <SiteBrand />

                <div className={`${PANEL} w-full sm:max-w-md mt-8`}>
                    {children}
                </div>
            </div>
        </div>
    );
}
