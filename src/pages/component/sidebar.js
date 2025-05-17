import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import {
    UserOutlined,
    HistoryOutlined,
    LockOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from '../../request';

const Sidebar = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const tabParam = queryParams.get('tab') || 'profile';

    const [selectedKey, setSelectedKey] = useState(tabParam);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    // Cập nhật selectedKey khi URL thay đổi
    useEffect(() => {
        const tab = queryParams.get('tab');
        if (tab) {
            setSelectedKey(tab);
        }
    }, [location.search]);

    const handleClick = ({ key }) => {
        setSelectedKey(key);
        if (key !== 'logout') {
            // Thay đổi tab trên URL (nếu bạn muốn)
            navigate(`/userprofile?tab=${key}`);
            onMenuClick(key);
        }
    };

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

    return (
        <>
            <div className="bg-white h-[70vh] shadow-md p-4 fixed left-0 top-16 w-64 mt-[10vh] ml-[10vw]">
                <Menu
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    onClick={handleClick}
                    className="border-none"
                >
                    <Menu.ItemGroup title="Cá nhân" className="font-bold">
                        <Menu.Item key="profile" icon={<UserOutlined />}>
                            Hồ sơ của tôi
                        </Menu.Item>
                        <Menu.Item key="booking-history" icon={<HistoryOutlined />}>
                            Lịch sử đặt phòng
                        </Menu.Item>
                        <Menu.Item key="account-security" icon={<LockOutlined />}>
                            Tài khoản và bảo mật
                        </Menu.Item>
                    </Menu.ItemGroup>

                    <Menu.ItemGroup title="Khác" className="font-bold mt-4">
                        <Menu.Item
                            key="logout"
                            icon={<LogoutOutlined />}
                            onClick={handleLogoutClick}
                        >
                            Đăng xuất
                        </Menu.Item>
                    </Menu.ItemGroup>
                </Menu>
            </div>

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
