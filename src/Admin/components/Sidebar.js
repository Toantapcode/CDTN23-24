import React from 'react';
import { Menu } from 'antd';
import {
    DashboardOutlined,
    DesktopOutlined,
    UserOutlined,
    HomeOutlined,
    TagsOutlined,
    DollarCircleOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

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
                    key: 'role',
                    label: 'Quản lý chức danh',
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
        {
            key: 'logout',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
        },
    ];

    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            localStorage.removeItem('Token: ');
            localStorage.removeItem('User: ');
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleMenuClick = ({ key }) => {
        if (key === 'logout') {
            handleLogout();
        } else {
            onMenuClick(key);
        }
    };

    return (
        <Menu
            mode="inline"
            className="w-[12%] min-h-screen rounded-lg shadow-lg mt-5 ml-10 pt-5 space-y-4 font-bold"
            onClick={handleMenuClick}
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