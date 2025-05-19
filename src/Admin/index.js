import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/RoomsPage'
import RoomTypePage from './pages/RoomTypePage';
import UserManagement from './pages/UserManagement';
import BookingPage from './pages/Booking';
import ServicePage from './pages/Service';
import RolePage from './pages/RolePage'
import Invoice from './pages/Invoice';
import Voucher from './pages/Voucher'
import Rate from './pages/Rate'
import StatusRoomToday from './pages/StatusRoomToDay';

export default function Admin() {
    const [content, setContent] = useState('dashboard');

    const renderContent = () => {
        switch (content) {
            case 'dashboard':
                return <Dashboard />;
            case 'booking':
                return <BookingPage />;
            case 'usermanagement':
                return <UserManagement />;
            case 'role':
                return <RolePage />;
            case 'rooms':
                return <Rooms />;
            case 'checkRoomToDay':
                return <StatusRoomToday />;
            case 'roomtypes':
                return <RoomTypePage />;
            case 'service':
                return <ServicePage />;
            case 'invoice':
                return <Invoice />;
            case 'voucher':
                return <Voucher />;
            case 'rate':
                return <Rate />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            <Header />
            <div className="flex ">
                <Sidebar onMenuClick={setContent} />
                <div className=" w-4/5 flex-1 ">
                    {renderContent()}
                </div>
            </div>
        </div>
    )
};
