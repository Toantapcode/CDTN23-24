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
            label: 'Thông tin',
            icon: <DashboardOutlined />,
        },
        {
            key: 'booking',
            label: 'Quản lý đặt phòng',
            icon: <DesktopOutlined />,
        },
        {
            key: 'user',
            label: 'Tài khoản',
            icon: <UserOutlined />,
            children: [
                {
                    key: 'usermanagement',
                    label: 'Quản lý tài khoản',
                },
                {
                    key: 'rolemanagement',
                    label: 'Quản lý chức vụ',
                },
            ],
        },
        {
            key: 'room',
            label: 'Phòng',
            icon: <HomeOutlined />,
            children: [
                {
                    key: 'rooms',
                    label: 'Quản lý phòng',
                },
                {
                    key: 'roomtypes',
                    label: 'Quản lý loại phòng',
                },
            ],
        },
        {
            key: 'service',
            label: 'Dịch vụ',
            icon: <TagsOutlined />,
        },
        {
            key: 'invoice',
            label: 'Hóa đơn',
            icon: <DollarCircleOutlined />,
        },
    ];

    return (
        <Menu
            mode="inline"
            className="w-[12%] min-h-screen rounded-lg shadow-lg mt-5 ml-10 pt-5 space-y-4 font-bold"
            onClick={({ key }) => onMenuClick(key)}
        >
            {menuItems.map((item) =>
                item.children ? (
                    <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
                        {item.children.map((subItem) => (
                            <Menu.Item key={subItem.key}>{subItem.label}</Menu.Item>
                        ))}
                    </Menu.SubMenu>
                ) : (
                    <Menu.Item key={item.key} icon={item.icon}>
                        {item.label}
                    </Menu.Item>
                )
            )}
        </Menu>
    );
};

export default Sidebar;
