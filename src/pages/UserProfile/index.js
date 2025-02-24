import React, { useState } from 'react';
import Header from '../component/header';
import Sidebar from '../component/sidebar';
import ProfileContent from '../component/userprofile/ProfileContent';
import BookingHistory from '../component/userprofile/BookingHistory';
import AccountSecurity from '../component/userprofile/AccountSecurity ';
import Support from '../component/userprofile/Support';

const UserProfile = () => {
    const [currentContent, setCurrentContent] = useState('profile');
  
    const renderContent = () => {
      switch (currentContent) {
        case 'profile':
          return <ProfileContent />;
        case 'booking-history':
          return <BookingHistory />;
        case 'account-security':
          return <AccountSecurity />;
        case 'support':
          return <Support />;
        default:
          return <ProfileContent />;
      }
    };
  
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex">
          <Sidebar onMenuClick={setCurrentContent} />
          <div className="flex-1 p-6 ml-64 mt-16">
            <div className="max-w-4xl w-full rounded-[16px] bg-white mx-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    );
  };

export default UserProfile;