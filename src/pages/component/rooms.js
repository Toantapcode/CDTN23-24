import { useNavigate } from 'react-router-dom';
import room1 from '../../assets/image/room1.jpg';
import room2 from '../../assets/image/room2.jpg';
import room3 from '../../assets/image/room3.jpg';

export default function Rooms() {
    const nav = useNavigate();

    const handleClick = () => {
        nav('/rooms')
    }
    return (
        <div className="bg-gray-50 py-12">
            <div className="container mx-auto px-6">
                <h1 className="text-5xl font-bold text-gray-900 flex items-center">
                    <span className="border-r-8 border-yellow-600 pr-4 mr-4 font-pacifico">Loại phòng</span>
                    <span className="text-yellow-600 text-3xl ">Các phòng của chúng tôi</span>
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <img
                            src={room1}
                            alt="Phòng 1"
                            className="rounded-lg mb-4"
                        />
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Phòng Deluxe</h3>
                        <p className="text-gray-600 mb-4">Phòng rộng rãi và sang trọng với tầm nhìn ra biển.</p>
                        <button className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 uppercase font-bold tracking-widest">
                            Đặt ngay
                        </button>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <img
                            src={room2}
                            alt="Phòng 2"
                            className="rounded-lg mb-4"
                        />
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Phòng Suite</h3>
                        <p className="text-gray-600 mb-4">Các phòng suite sang trọng với ban công riêng.</p>
                        <button className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 uppercase font-bold tracking-widest">
                            Đặt ngay
                        </button>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <img
                            src={room3}
                            alt="Phòng 3"
                            className="rounded-lg mb-4"
                        />
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Phòng Gia đình</h3>
                        <p className="text-gray-600 mb-4">Các phòng thoải mái, phù hợp cho gia đình.</p>
                        <button className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 uppercase font-bold tracking-widest">
                            Đặt ngay
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex justify-center mt-8">
                <button
                    onClick={handleClick} // Thêm sự kiện onClick để chuyển hướng
                    className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 uppercase font-bold tracking-widest"
                >
                    Xem tất cả
                </button>
            </div>
        </div>
    )
}
