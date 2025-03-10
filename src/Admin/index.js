import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/RoomsPage'
import UserManagement from './pages/UserManagement';
import BookingPage from './pages/Booking';

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
            case 'rooms':
                return <Rooms />;
            // case 'deal':
            //     return <Deal />;
            // case 'rate':
            //     return <Rate />;
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
