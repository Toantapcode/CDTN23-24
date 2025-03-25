import React from 'react';
import Lanyard from '../LanYard';

const Support = () => {
  return (
    <div className="p-6 relative w-full h-screen">
      <h2 className="text-xl font-bold mb-4 relative z-10">Hỗ trợ</h2>
      <p className="relative z-10">Đây là trang hỗ trợ.</p>
      <div className="absolute inset-0 z-0">
        <Lanyard />
      </div>
    </div>
  );
};

export default Support;