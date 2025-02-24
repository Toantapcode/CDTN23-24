import React from 'react';
import { Menu } from 'antd';
import {
    DashboardOutlined,
    DesktopOutlined,
    UserOutlined,
    HomeOutlined,
    TagsOutlined,
    DollarCircleOutlined,
} from '@ant-design/icons';

const Sidebar = ({ onMenuClick }) => {
    const menuItems = [
        {
            key: 'dashboard',
            label: 'Dashboard',
            icon: <DashboardOutlined />,
        },
        {
            key: 'front-desk',
            label: 'Front Desk',
            icon: <DesktopOutlined />,
        },
        {
            key: 'guest',
            label: 'Guest',
            icon: <UserOutlined />,
        },
        {
            key: 'rooms',
            label: 'Rooms',
            icon: <HomeOutlined />,
        },
        {
            key: 'deal',
            label: 'Deal',
            icon: <TagsOutlined />,
        },
        {
            key: 'rate',
            label: 'Rate',
            icon: <DollarCircleOutlined />,
        },
    ];
    return (
        <Menu
            mode="inline"
            className="w-[12%] min-h-screen border-r-0"
            onClick={({ key }) => onMenuClick(key)}
        >
            {menuItems.map((item) => (
                <Menu.Item key={item.key} icon={item.icon}>
                    {item.label}
                </Menu.Item>
            ))}
        </Menu>
    );
};

export default Sidebar;