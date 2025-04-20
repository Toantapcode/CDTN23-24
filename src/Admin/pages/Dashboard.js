import React from "react";
import Overview from "../components/Overview"
import Rooms from "../components/Rooms";
import OccupancyStatistics from "../components/OccupancyStatistics"
import UpcomingGuests from "../components/UpcomingGuests";

const Dashboard = () => {
    return (
        <div className="p-4">
            <Overview />
            <div className="flex gap-4 mt-4">
                <div className="w-1/2">
                    <Rooms />
                    <UpcomingGuests />
                </div>
                <div className="w-1/2">
                    <OccupancyStatistics />
                </div>
            </div>
        </div>
    );
};


export default Dashboard;