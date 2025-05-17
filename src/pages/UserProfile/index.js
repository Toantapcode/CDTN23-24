import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../component/header';
import Sidebar from '../component/sidebar';
import ProfileContent from '../component/userprofile/ProfileContent';
import BookingHistory from '../component/userprofile/BookingHistory';
import AccountSecurity from '../component/userprofile/AccountSecurity ';
import Support from '../component/userprofile/Support';

const UserProfile = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const defaultTab = queryParams.get('tab') || 'profile';

  const [currentContent, setCurrentContent] = useState(defaultTab);

  useEffect(() => {
    const tab = queryParams.get('tab');
    if (tab) {
      setCurrentContent(tab);
    }
  }, [location.search]);

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
