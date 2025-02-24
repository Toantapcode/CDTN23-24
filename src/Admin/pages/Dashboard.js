import React from "react";
import Overview from "../components/Overview"

import OccupancyStatistics from "../components/OccupancyStatistics"
import CustomersFeedback from "../components/CustomersFeedback"

const Dashboard = () => {
    return (
        <div className="p-4">
            <Overview />
            <div className="grid grid-cols-2 gap-4 mt-4">
                {/* <Rooms /> */}
            </div>
            <OccupancyStatistics />
            <CustomersFeedback />
        </div>
    )
}

export default Dashboard;