import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../component/header";
import Footer from "../component/footer";
import imgbg from "../../assets/image/hero3.webp";
import axiosInstance from "../../request";

const RoomCard = ({ room, onBook }) => {
    const displayPrice = room.price
        ? `${(room.price * 1000).toLocaleString('vi-VN')} VND / đêm`
        : "";

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <img
                src={room.image}
                alt={room.name}
                className="rounded-lg mb-4 w-full h-48 object-cover"
            />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{room.name}</h3>
            <p className="text-gray-600 mb-2">{room.description}</p>
            <p className="text-yellow-600 font-bold text-lg mb-4">{displayPrice}</p>
            <button
                onClick={() => onBook(room)}
                className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 uppercase font-bold tracking-widest"
            >
                Đặt ngay
            </button>
        </div>
    );
};
const token = localStorage.getItem('Token: ')

const RoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get('/room/all');
                console.log(response.roomList)
                if (response && response.roomList) {
                    const data = response.roomList;
                    const familyRooms = data.filter(room => room.type.name === "FAMILY").sort(() => 0.5 - Math.random()).slice(0, Math.min(2, data.filter(room => room.type.name === "FAMILY").length));
                    const coupleRooms = data.filter(room => room.type.name === "COUPLE").sort(() => 0.5 - Math.random()).slice(0, Math.min(2, data.filter(room => room.type.name === "COUPLE").length));
                    const vipRooms = data.filter(room => room.type.name === "VIP").sort(() => 0.5 - Math.random()).slice(0, Math.min(2, data.filter(room => room.type.name === "VIP").length));
                    const selectedRooms = [...familyRooms, ...coupleRooms, ...vipRooms].filter(room => room);
                    setRooms(selectedRooms);
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu phòng:', error);
                setRooms([
                    {
                        name: "Phòng Gia đình 1",
                        description: "Thoải mái cho gia đình.",
                        image: "path/to/family_image1.jpg",
                        type: "FAMILY",
                        price: 1500
                    },
                    {
                        name: "Phòng Gia đình 2",
                        description: "Thoải mái cho gia đình lớn.",
                        image: "path/to/family_image2.jpg",
                        type: "FAMILY",
                        price: 1800
                    },
                    {
                        name: "Phòng Cặp đôi 1",
                        description: "Lãng mạn dành cho các cặp đôi.",
                        image: "path/to/couple_image1.jpg",
                        type: "COUPLE",
                        price: 1200
                    },
                    {
                        name: "Phòng Cặp đôi 2",
                        description: "Không gian ấm cúng cho hai người.",
                        image: "path/to/couple_image2.jpg",
                        type: "COUPLE",
                        price: 1300
                    },
                    {
                        name: "Phòng VIP 1",
                        description: "Sang trọng với tiện nghi cao cấp.",
                        image: "path/to/vip_image1.jpg",
                        type: "VIP",
                        price: 2500
                    },
                    {
                        name: "Phòng VIP 2",
                        description: "Đẳng cấp với view đẹp.",
                        image: "path/to/vip_image2.jpg",
                        type: "VIP",
                        price: 3000
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    const handleBook = (room) => {
        if (token) {
            const query = new URLSearchParams({
                name: room.name,
                description: room.description,
                image: room.image,
                price: room.price.toString(),
                type: room.type.name
            }).toString();
            navigate(`/bookingpage?${query}`);
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header />
            <section
                className="bg-cover bg-center h-[50vh] flex items-center justify-center mt-[-50px]"
                style={{ backgroundImage: `url(${imgbg})` }}
            >
                <div className="container mx-auto px-6 py-16 text-center">
                    <h1 className="text-8xl font-bold text-white mb-4 font-pacifico">Phòng</h1>
                </div>
            </section>
            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-6">
                    <h1 className="text-5xl font-bold text-gray-900 flex items-center">
                        <span className="border-r-8 border-yellow-600 pr-4 mr-4 font-pacifico">
                            Loại phòng
                        </span>
                        <span className="text-yellow-600 text-3xl">Các phòng của chúng tôi</span>
                    </h1>
                    {loading ? (
                        <p className="text-center text-gray-600 mt-8">Đang tải dữ liệu...</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                            {rooms.map((room, index) => (
                                <RoomCard key={index} room={room} onBook={handleBook} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default RoomsPage;