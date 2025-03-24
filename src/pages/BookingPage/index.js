import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../component/header";
import Footer from "../component/footer";
import imgbg from "../../assets/image/hero3.webp";
import axiosInstance from "../../request";
import { ToastContainer, toast } from 'react-toastify';

const BookingPage = () => {
    const [searchParams] = useSearchParams();

    const room = {
        name: searchParams.get("name") || "Không xác định",
        description: searchParams.get("description") || "",
        image: searchParams.get("image") || "path/to/default_image.jpg",
        price: searchParams.get("price") ? parseInt(searchParams.get("price")) : null,
        type: searchParams.get("type") || "",
    };

    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");
    const [numOfAdults, setNumOfAdults] = useState(1);
    const [numOfChild, setNumOfChild] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [error, setError] = useState("");

    const today = new Date().toISOString().split("T")[0];

    const selectedRoomId = localStorage.getItem('SelectedRoomId');
    const storedUser = localStorage.getItem('User: ');
    const userData = storedUser ? JSON.parse(storedUser) : null;
    const userId = userData?.id || null;

    const calculateDays = () => {
        if (checkInDate && checkOutDate) {
            const checkIn = new Date(checkInDate);
            const checkOut = new Date(checkOutDate);
            const diffTime = checkOut - checkIn;
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
        return 0;
    };

    const totalPrice = room.price && calculateDays() > 0
        ? room.price * 1000 * calculateDays()
        : 0;

    const displayPrice = totalPrice > 0
        ? `${totalPrice.toLocaleString('vi-VN')} VND (${calculateDays()} đêm)`
        : room.price !== null && room.price !== undefined
            ? `${(room.price * 1000).toLocaleString('vi-VN')} VND / đêm`
            : "";

    const handleSubmit = async (e) => {
        e.preventDefault();

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const now = new Date(today);

        if (checkIn < now) {
            toast.error("Ngày nhận phòng phải là hôm nay hoặc trong tương lai.");
            return;
        }

        if (checkOut <= checkIn) {
            toast.error("Ngày trả phòng phải sau ngày nhận phòng.");
            return;
        }

        if (checkOut <= now) {
            toast.error("Ngày trả phòng phải là một ngày trong tương lai.");
            return;
        }

        if (!paymentMethod) {
            toast.error("Vui lòng chọn phương thức thanh toán.");
            return;
        }

        setError("");
        const bookingData = {
            checkInDate,
            checkOutDate,
            numOfAdults,
            numOfChild,
        };
        try {
            const response = await axiosInstance.post(
                `/booking/bookRoom/${selectedRoomId}/${userId}`,
                bookingData
            );
            toast.success('Đặt phòng thành công!', {
                position: 'top-right',
                autoClose: 3000
            })

            localStorage.removeItem('SelectedRoomId');
        } catch (error) {
            console.error("Lỗi khi đặt phòng:", error);
            setError("Đặt phòng thất bại. Vui lòng thử lại.");
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
                    <h1 className="text-8xl font-bold text-white mb-4 font-pacifico">Đặt Phòng</h1>
                </div>
            </section>
            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-6">
                    <h1 className="text-5xl font-bold text-gray-900 flex items-center mb-8">
                        <span className="border-r-8 border-yellow-600 pr-4 mr-4 font-pacifico">
                            Đặt phòng
                        </span>
                        <span className="text-yellow-600 text-3xl">{room.name}</span>
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <img
                                src={room.image}
                                alt={room.name}
                                className="rounded-lg w-full h-96 object-cover"
                            />
                            <h3 className="text-2xl font-bold text-gray-800 mt-4">{room.name}</h3>
                            <p className="text-gray-600 mt-2">{room.description}</p>
                            <p className="text-yellow-600 font-bold text-lg mt-2">{displayPrice}</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Thông tin đặt phòng</h3>
                            {error && <p className="text-red-500 mb-4">{error}</p>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="checkInDate">
                                        Ngày nhận phòng
                                    </label>
                                    <input
                                        type="date"
                                        id="checkInDate"
                                        value={checkInDate}
                                        onChange={(e) => setCheckInDate(e.target.value)}
                                        min={today}
                                        dateFormat="yyyy/MM/dd"
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="checkOutDate">
                                        Ngày trả phòng
                                    </label>
                                    <input
                                        type="date"
                                        id="checkOutDate"
                                        value={checkOutDate}
                                        onChange={(e) => setCheckOutDate(e.target.value)}
                                        min={checkInDate || today}
                                        dateFormat="yyyy/MM/dd"
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="numOfAdults">
                                        Số lượng người lớn
                                    </label>
                                    <input
                                        type="number"
                                        id="numOfAdults"
                                        value={numOfAdults}
                                        onChange={(e) => setNumOfAdults(Math.max(1, parseInt(e.target.value)))}
                                        min="1"
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="numOfChild">
                                        Số lượng trẻ em
                                    </label>
                                    <input
                                        type="number"
                                        id="numOfChild"
                                        value={numOfChild}
                                        onChange={(e) => setNumOfChild(Math.max(0, parseInt(e.target.value)))}
                                        min="0"
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2" htmlFor="paymentMethod">
                                        Phương thức thanh toán
                                    </label>
                                    <select
                                        id="paymentMethod"
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                                        required
                                    >
                                        <option value="">Chọn phương thức thanh toán</option>
                                        <option value="cash">Tiền mặt</option>
                                        <option value="credit_card">Thẻ tín dụng</option>
                                        <option value="bank_transfer">Chuyển khoản ngân hàng</option>
                                        <option value="momo">Ví MoMo</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 uppercase font-bold tracking-widest w-full"
                                >
                                    Xác nhận đặt phòng
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
            <Footer />
        </div>
    );
};

export default BookingPage;