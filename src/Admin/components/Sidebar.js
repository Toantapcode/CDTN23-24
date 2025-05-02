import React, { useState } from 'react';
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
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const handleConfirmLogout = async () => {
        try {
            localStorage.removeItem('Token: ');
            localStorage.removeItem('User: ');
            navigate('/login');
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
        }
        setIsLogoutModalOpen(false);
    };

    const handleCancelLogout = () => {
        setIsLogoutModalOpen(false);
    };

    const handleMenuClick = ({ key }) => {
        if (key === 'logout') {
            handleLogoutClick();
        } else {
            onMenuClick(key);
        }
    };

    return (
        <>
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

            {isLogoutModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[1000]">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-2xl z-[1001]">
                        <h3 className="text-lg font-semibold mb-4">Xác nhận đăng xuất</h3>
                        <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleCancelLogout}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleConfirmLogout}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;