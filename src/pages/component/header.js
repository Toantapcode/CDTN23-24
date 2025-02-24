import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/image/logo.png";
import Avatar from "./avatar";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const token = localStorage.getItem('Token: ');
    const navigate = useNavigate();

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

    const handleAvatarClick = () => {
        if (token) {
            navigate('/userprofile');
        } else {
            navigate('/login');
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 w-full ${isScrolled ? "h-12 bg-white/80 backdrop-blur-lg shadow-md" : "h-16 bg-white/60 backdrop-blur-lg shadow-lg"
                } p-4 z-[9999] transition-all duration-300 ease-in-out`}
        >
            <div className="container mx-auto flex items-center justify-between px-6">
                <a href="/">
                    <div className={`relative transform rotate-45 p-2 border-2 border-yellow-600 transition-all duration-300 ${isScrolled ? "scale-75" : "scale-100"}`}>
                        <img src={logo}
                            alt="LuxeStay Logo"
                            className={`transform rotate-[-45deg] border-2 border-yellow-600 transition-all duration-300 ${isScrolled ? "w-[70px]" : "w-[90px]"}`}
                        />
                    </div>
                </a>
                <nav className={`flex space-x-4 uppercase font-bold text-xl transition-all duration-300 ${isScrolled ? "translate-y-[-42px]" : "translate-y-[-37px]"}`}>
                    <a href="/" className="text-yellow-800 hover:text-yellow-600">Trang chủ</a>
                    <a href="introduce" className="text-yellow-800 hover:text-yellow-600">Giới thiệu</a>
                    <a href="rooms" className="text-yellow-800 hover:text-yellow-600">Phòng</a>
                    <a href="" className="text-yellow-800 hover:text-yellow-600">Dịch vụ</a>
                    <a href="#" className="text-yellow-800 hover:text-yellow-600">Liên hệ</a>
                    <a onClick={handleAvatarClick} className="mt-[-4px]"><Avatar /></a>
                </nav>
            </div>
        </header>
    );
}
