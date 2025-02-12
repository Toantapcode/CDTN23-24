import logo from '../../assets/image/logo.png';

export default function Header() {
    return (
        <header className="bg-white shadow h-16">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="relative transform rotate-45 origin-center bg-white p-2 border-2 border-yellow-600">
                        <img
                            src={logo}
                            alt="LuxeStay Logo"
                            className="w-[120px] transform rotate-[-45deg] border-2 border-yellow-600"
                        />
                    </div>
                    <nav className="flex space-x-4 transform translate-y-[-55px] uppercase font-bold text-xl ">
                        <a href="" className="text-yellow-800 hover:text-yellow-600">Trang chủ</a>
                        <a href="introduce" className="text-yellow-800 hover:text-yellow-600">Giới thiệu</a>
                        <a href="rooms" className="text-yellow-800 hover:text-yellow-600">Phòng</a>
                        <a href="" className="text-yellow-800 hover:text-yellow-600">Dịch vụ</a>
                        <a href="#" className="text-yellow-800 hover:text-yellow-600">Liên hệ</a>
                    </nav>
                </div>
            </div>
        </header>
    )
}
