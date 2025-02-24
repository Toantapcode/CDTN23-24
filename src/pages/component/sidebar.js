import React, { useState } from 'react';
import { Menu } from 'antd';
import {
    UserOutlined,
    HistoryOutlined,
    LockOutlined,
    QuestionCircleOutlined,
    FileTextOutlined,
    StarOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

const Sidebar = ({ onMenuClick }) => {
    const [selectedKey, setSelectedKey] = useState('profile');

    const handleClick = (e) => {
        setSelectedKey(e.key);
        onMenuClick(e.key);
    };
    const navigate = useNavigate();

    return (
        <div className="bg-white h-screen shadow-md p-4 fixed left-0 top-16 w-64">
            <Menu
                mode="inline"
                selectedKeys={[selectedKey]}
                onClick={handleClick}
                className="border-none"
            >
                {/* Phần 1 */}
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

                {/* Phần 2 */}
                <Menu.ItemGroup title="Khác" className="font-bold mt-4">
                    <Menu.Item key="support" icon={<QuestionCircleOutlined />}>
                        Hỗ trợ
                    </Menu.Item>
                    <Menu.Item key="privacy-policy" icon={<QuestionCircleOutlined />}>
                        Chính sách bảo mật
                    </Menu.Item>
                    <Menu.Item key="terms" icon={<FileTextOutlined />}>
                        Điều khoản sử dụng
                    </Menu.Item>
                    <Menu.Item key="review" icon={<StarOutlined />}>
                        Đánh giá ứng dụng
                    </Menu.Item>
                    <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={() => {
                        localStorage.removeItem('Token: ');
                        localStorage.removeItem('User: ');
                        navigate("/login")
                    }}>
                        Đăng xuất
                    </Menu.Item>
                </Menu.ItemGroup>
            </Menu>
        </div>
    );
};

export default Sidebar;