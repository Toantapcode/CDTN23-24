import React from 'react';
import { Input   } from 'antd';
import logo from '../../assets/image/logo.png'
import Avatar from '../../pages/component/avatar';

const Header = () => {
    return (
        <div className="flex items-center justify-between p-4 bg-white shadow">
            <div className="flex items-center">
                <img src={logo} alt="Logo" className="w-[90px] h-[50px] ml-10" />
            </div>
            <Avatar />
        </div>
    );
};

export default Header;