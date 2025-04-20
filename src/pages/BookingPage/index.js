import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Header from "../component/header";
import Footer from "../component/footer";
import imgbg from "../../assets/image/hero3.webp";
import axiosInstance from "../../request";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingPage = () => {
    const { state } = useLocation();
    const [searchParams] = useSearchParams();
    const [room, setRoom] = useState(() => {
        return state?.room || JSON.parse(localStorage.getItem('SelectedRoom')) || {
            name: "Không xác định",
            description: "",
            image: "path/to/default_image.jpg",
            price: null,
            type: "",
        };
    });

    const savedFormData = JSON.parse(localStorage.getItem('BookingFormData')) || {};
    const [checkInDate, setCheckInDate] = useState(savedFormData.checkInDate || "");
    const [checkOutDate, setCheckOutDate] = useState(savedFormData.checkOutDate || "");
    const [numOfAdults, setNumOfAdults] = useState(savedFormData.numOfAdults || 1);
    const [numOfChild, setNumOfChild] = useState(savedFormData.numOfChild || 0);
    const [paymentMethod, setPaymentMethod] = useState(savedFormData.paymentMethod || "");
    const [error, setError] = useState("");
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState(savedFormData.selectedServices || []);
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

    const today = new Date().toISOString().split("T")[0];
    const selectedRoomId = localStorage.getItem('SelectedRoomId');
    const storedUser = localStorage.getItem('User: ');
    const userData = storedUser ? JSON.parse(storedUser) : null;
    const userId = userData?.id || null;

    // Kiểm tra trạng thái thanh toán khi tải trang
    useEffect(() => {
        if (searchParams.get('status') === '00') {
            setIsPaymentSuccessful(true);
            setPaymentCompleted(true);
            setPaymentMethod("vnpay");
            toast.success("Thanh toán VN PAY thành công!", {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    }, [searchParams]);

    // Lấy danh sách dịch vụ
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axiosInstance.get('/service/all');
                setServices(response.serviceList || []);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách dịch vụ:", error);
                toast.error("Không thể tải danh sách dịch vụ.");
                setServices([]);
            }
        };
        fetchServices();
    }, []);

    // Lưu dữ liệu biểu mẫu vào localStorage khi thay đổi
    useEffect(() => {
        const formData = {
            checkInDate,
            checkOutDate,
            numOfAdults,
            numOfChild,
            paymentMethod,
            selectedServices,
        };
        localStorage.setItem('BookingFormData', JSON.stringify(formData));
    }, [checkInDate, checkOutDate, numOfAdults, numOfChild, paymentMethod, selectedServices]);

    const calculateDays = () => {
        if (checkInDate && checkOutDate) {
            const checkIn = new Date(checkInDate);
            const checkOut = new Date(checkOutDate);
            const diffTime = checkOut - checkIn;
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }
        return 0;
    };

    const calculateServiceTotal = () => {
        return selectedServices.reduce((total, serviceId) => {
            const service = services.find(s => s.id === serviceId);
            return total + (service?.price || 0);
        }, 0);
    };

    const totalPrice = room.price && calculateDays() > 0
        ? (room.price * 1000 * calculateDays()) + calculateServiceTotal() * 1000
        : calculateServiceTotal() * 1000;

    const displayPrice = totalPrice > 0 && !isNaN(totalPrice)
        ? `${totalPrice.toLocaleString('vi-VN')} VND (${calculateDays()} đêm${selectedServices.length > 0 ? ' + dịch vụ' : ''})`
        : room.price !== null && room.price !== undefined
            ? `${(room.price * 1000).toLocaleString('vi-VN')} VND / đêm`
            : "Giá không xác định";

    const handleServiceChange = (serviceId) => {
        setSelectedServices(prev => {
            if (prev.includes(serviceId)) {
                return prev.filter(id => id !== serviceId);
            } else {
                return [...prev, serviceId];
            }
        });
    };

    // Hàm kiểm tra hợp lệ các trường
    const validateForm = () => {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const now = new Date(today);

        if (checkIn < now) {
            toast.error("Ngày nhận phòng phải là hôm nay hoặc trong tương lai.");
            return false;
        }

        if (checkOut <= checkIn) {
            toast.error("Ngày trả phòng phải sau ngày nhận phòng.");
            return false;
        }

        if (checkOut <= now) {
            toast.error("Ngày trả phòng phải là một ngày trong tương lai.");
            return false;
        }

        if (!paymentMethod) {
            toast.error("Vui lòng chọn phương thức thanh toán.");
            return false;
        }

        return true;
    };

    const handlePayment = async () => {
        // Kiểm tra hợp lệ trước khi gọi API
        if (!validateForm()) {
            return;
        }

        if (paymentMethod !== "vnpay") {
            toast.error("Phương thức thanh toán phải là VN PAY.");
            return;
        }

        try {
            const vnpayResponse = await axiosInstance.get(
                `/payment/vn-pay?amount=${totalPrice}&bankCode=NCB`
            );
            if (vnpayResponse.data?.paymentUrl) {
                window.location.href = vnpayResponse.data.paymentUrl;
            } else {
                throw new Error("Không nhận được URL thanh toán từ VN PAY");
            }
        } catch (error) {
            console.error("Lỗi khi khởi tạo thanh toán VN PAY:", error);
            toast.error(error.em || "Khởi tạo thanh toán VN PAY thất bại. Vui lòng thử lại.", {
                position: 'top-right',
                autoClose: 3000,
            });
            setError("Khởi tạo thanh toán VN PAY thất bại. Vui lòng thử lại.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra hợp lệ trước khi gửi POST
        if (!validateForm()) {
            return;
        }

        if (paymentMethod === "vnpay" && !paymentCompleted) {
            toast.error("Vui lòng hoàn tất thanh toán VN PAY trước khi xác nhận đặt phòng.");
            return;
        }

        setError("");
        const bookingData = {
            checkInDate,
            checkOutDate,
            numOfAdults,
            numOfChild,
            serviceIds: selectedServices,
        };

        try {
            const response = await axiosInstance.post(
                `/booking/bookRoom/${selectedRoomId}/${userId}`,
                bookingData
            );
            toast.success('Đặt phòng thành công!', {
                position: 'top-right',
                autoClose: 3000,
            });

            localStorage.removeItem('SelectedRoomId');
            localStorage.removeItem('SelectedRoom');
            localStorage.removeItem('SelectedServices');
            localStorage.removeItem('BookingFormData');
        } catch (error) {
            console.error("Lỗi khi đặt phòng:", error);
            toast.error(error.em || "Đặt phòng thất bại. Vui lòng thử lại.", {
                position: 'top-right',
                autoClose: 3000,
            });
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
                                    <label className="block text-gray-700 font-bold mb-2">
                                        Dịch vụ bổ sung
                                    </label>
                                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-2">
                                        {services && services.length > 0 ? (
                                            services.map((service) => (
                                                <button
                                                    key={service.id}
                                                    type="button"
                                                    onClick={() => handleServiceChange(service.id)}
                                                    className={`p-2 rounded-lg text-sm transition-colors ${selectedServices.includes(service.id)
                                                        ? 'bg-yellow-600 text-white'
                                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                        }`}
                                                >
                                                    {service.name} {(service.price * 1000).toLocaleString('vi-VN')} VND
                                                </button>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 col-span-2">Không có dịch vụ nào</p>
                                        )}
                                    </div>
                                </div>
                                {!isPaymentSuccessful && (
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-bold mb-2" htmlFor="paymentMethod">
                                            Phương thức thanh toán
                                        </label>
                                        <select
                                            id="paymentMethod"
                                            value={paymentMethod}
                                            onChange={(e) => {
                                                setPaymentMethod(e.target.value);
                                                setPaymentCompleted(false);
                                            }}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                                            required
                                        >
                                            <option value="">Chọn phương thức thanh toán</option>
                                            <option value="cash">Tiền mặt</option>
                                            <option value="vnpay">VN PAY</option>
                                        </select>
                                    </div>
                                )}
                                {!isPaymentSuccessful && paymentMethod === "vnpay" && !paymentCompleted && (
                                    <button
                                        type="button"
                                        onClick={handlePayment}
                                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 uppercase font-bold tracking-widest w-full mb-4"
                                    >
                                        Thanh toán
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 uppercase font-bold tracking-widest w-full"
                                    disabled={paymentMethod === "vnpay" && !paymentCompleted}
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