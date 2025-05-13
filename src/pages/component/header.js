import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/image/logo.png";
import Avatar from "./avatar";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const token = localStorage.getItem('Token: ');
    const userData = localStorage.getItem('User: ');
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    let roles = [];
    try {
        if (userData) {
            const parsedData = JSON.parse(userData);
            roles = Array.isArray(parsedData.roles) ? parsedData.roles : [parsedData.roles].filter(Boolean);
        }
    } catch (error) {
        console.error("Error parsing userData:", error);
    }

    const isAdmin = roles.includes('ADMIN') || roles.includes('SUADMIN');

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAvatarClick = () => {
        if (token) {
            setIsDropdownOpen(!isDropdownOpen);
        } else {
            navigate('/login');
        }
    };

    const handleLogout = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem('Token: ');
        localStorage.removeItem('User: ');
        setShowLogoutConfirm(false);
        setIsDropdownOpen(false);
        navigate('/login');
    };

    const cancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full ${isScrolled ? "h-12 bg-white/80 backdrop-blur-lg shadow-md" : "h-16 bg-white/60 backdrop-blur-lg shadow-lg"
                    } p-4 z-[9999] transition-all duration-300 ease-in-out`}
            >
                <div className="container mx-auto flex items-center justify-between px-6">
                    <a href="/">
                        <div className={`relative transform rotate-45 p-2 border-2 border-yellow-600 transition-all duration-300 ${isScrolled ? "scale-75" : "scale-100"}`}>
                            <img
                                src={logo}
                                alt="LuxeStay Logo"
                                className={`transform rotate-[-45deg] border-2 border-yellow-600 transition-all duration-300 ${isScrolled ? "w-[70px]" : "w-[90px]"}`}
                            />
                        </div>
                    </a>
                    <nav className={`flex space-x-4 uppercase font-bold text-xl transition-all duration-300 ${isScrolled ? "translate-y-[-37px]" : "translate-y-[-37px]"}`}>
                        <a href="/" className="text-yellow-800 hover:text-yellow-600">Trang chủ</a>
                        <a href="introduce" className="text-yellow-800 hover:text-yellow-600">Giới thiệu</a>
                        <a href="rooms" className="text-yellow-800 hover:text-yellow-600">Phòng</a>
                        <a href="contact" className="text-yellow-800 hover:text-yellow-600">Liên hệ</a>
                        {token ? (
                            <div className="relative" ref={dropdownRef}>
                                <a onClick={handleAvatarClick} className="mt-[-4px] cursor-pointer"><Avatar /></a>
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                        <a
                                            href="/userprofile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-100 hover:text-yellow-800"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Thông tin tài khoản
                                        </a>
                                        {isAdmin && (
                                            <a
                                                href="/admin"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-100 hover:text-yellow-800"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                Trang quản lý
                                            </a>
                                        )}
                                        <a
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-yellow-100 hover:text-yellow-800"
                                        >
                                            Đăng xuất
                                        </a>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="bg-yellow-800 text-white text-sm px-3 py-1 rounded hover:bg-yellow-700 transition-colors duration-200"
                                >
                                    Đăng nhập
                                </button>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="bg-yellow-800 text-white text-sm px-3 py-1 rounded hover:bg-yellow-700 transition-colors duration-200"
                                >
                                    Đăng ký
                                </button>
                            </div>
                        )}
                    </nav>
                </div>
            </header>

            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-sm">
                        <p className="text-lg mb-4 text-center">Bạn có chắc chắn muốn đăng xuất?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={cancelLogout}
                                className="px-4 py-2 bg-gray-200 text-gray-800 dwarf rounded hover:bg-gray-300"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="px-4 py-2 bg-yellow-800 text-white rounded hover:bg-yellow-700"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}