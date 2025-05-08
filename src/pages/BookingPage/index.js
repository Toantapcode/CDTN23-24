import React, { useState, useEffect, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Header from "../component/header";
import Footer from "../component/footer";
import imgbg from "../../assets/image/hero3.webp";
import axiosInstance from "../../request";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import RoomInfo from "./RoomInfo";
import BookingForm from "./BookingForm";
import PickupModal from "./PickupModal";
import LocationModal from "./LocationModal";

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

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
    const [showPickupModal, setShowPickupModal] = useState(false);
    const [pickupDetails, setPickupDetails] = useState(savedFormData.pickupDetails || {
        address: "",
        lat: null,
        lng: null,
        time: "",
        luggageWeight: "",
        distance: null,
        price: null,
    });
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [locationSearch, setLocationSearch] = useState("");
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const leafletMapRef = useRef(null);

    const today = new Date().toISOString().split("T")[0];
    const selectedRoomId = localStorage.getItem('SelectedRoomId');
    const storedUser = localStorage.getItem('User: ');
    const userData = storedUser ? JSON.parse(storedUser) : null;
    const userId = userData?.id || null;

    // Nominatim search
    const handleLocationSearch = async () => {
        if (!locationSearch) {
            toast.error("Vui lòng nhập địa điểm để tìm kiếm.");
            return;
        }
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationSearch)}`
            );
            const data = await response.json();
            if (data.length > 0) {
                const { lat, lon, display_name } = data[0];
                const latitude = parseFloat(lat);
                const longitude = parseFloat(lon);
                setPickupDetails(prev => ({
                    ...prev,
                    address: display_name,
                    lat: latitude,
                    lng: longitude,
                }));
                setLocationSearch(display_name);
                if (leafletMapRef.current && markerRef.current) {
                    leafletMapRef.current.setView([latitude, longitude], 12);
                    markerRef.current.setLatLng([latitude, longitude]);
                }
            } else {
                toast.error("Không tìm thấy địa điểm.");
            }
        } catch (error) {
            console.error("Lỗi khi tìm kiếm địa điểm:", error);
            toast.error("Lỗi khi tìm kiếm địa điểm.");
        }
    };

    const reverseGeocode = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();
            if (data.display_name) {
                setPickupDetails(prev => ({
                    ...prev,
                    address: data.display_name,
                }));
                setLocationSearch(data.display_name);
            } else {
                toast.error("Không thể tìm địa chỉ cho tọa độ này.");
            }
        } catch (error) {
            console.error("Lỗi khi reverse geocode:", error);
            toast.error("Lỗi khi lấy địa chỉ.");
        }
    };

    // Calculate distance and price when pickup details change
    useEffect(() => {
        const calculateDistanceAndPrice = async () => {
            if (pickupDetails.lat && pickupDetails.lng) {
                try {
                    const response = await fetch(
                        `https://router.project-osrm.org/route/v1/driving/${pickupDetails.lng},${pickupDetails.lat};105.8122971279769,20.97541654877395?overview=false`
                    );
                    const data = await response.json();
                    if (data.routes && data.routes.length > 0) {
                        const distanceMeters = data.routes[0].distance;
                        const distanceKm = distanceMeters / 1000; // Convert to kilometers
                        let price = 0;

                        if (distanceKm <= 50) {
                            price = distanceKm * 10000;
                        } else if (distanceKm <= 100) {
                            price = (50 * 10000) + ((distanceKm - 50) * 8000);
                        } else {
                            price = (50 * 10000) + (50 * 8000) + ((distanceKm - 100) * 6000);
                        }

                        setPickupDetails(prev => ({
                            ...prev,
                            distance: distanceKm,
                            price: price,
                        }));
                    } else {
                        toast.error("Không thể tính khoảng cách.");
                        setPickupDetails(prev => ({
                            ...prev,
                            distance: null,
                            price: null,
                        }));
                    }
                } catch (error) {
                    console.error("Lỗi khi tính khoảng cách:", error);
                    toast.error("Lỗi khi tính khoảng cách.");
                    setPickupDetails(prev => ({
                        ...prev,
                        distance: null,
                        price: null,
                    }));
                }
            }
        };

        calculateDistanceAndPrice();
    }, [pickupDetails.lat, pickupDetails.lng]);

    // Check payment status
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

    // Fetch services
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

    // Save form data to localStorage
    useEffect(() => {
        const formData = {
            checkInDate,
            checkOutDate,
            numOfAdults,
            numOfChild,
            paymentMethod,
            selectedServices,
            pickupDetails,
        };
        localStorage.setItem('BookingFormData', JSON.stringify(formData));
    }, [checkInDate, checkOutDate, numOfAdults, numOfChild, paymentMethod, selectedServices, pickupDetails]);

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
            if (service?.name === "Đưa đón" && pickupDetails.price) {
                return total + pickupDetails.price;
            }
            return total + (service?.price * 1000 || 0);
        }, 0);
    };

    const totalPrice = room.price && calculateDays() > 0
        ? (room.price * 1000 * calculateDays()) + calculateServiceTotal()
        : calculateServiceTotal();

    const displayPrice = totalPrice > 0 && !isNaN(totalPrice)
        ? `${totalPrice.toLocaleString('vi-VN')} VND (${calculateDays()} đêm${selectedServices.length > 0 ? ' + dịch vụ' : ''})`
        : room.price !== null && room.price !== undefined
            ? `${(room.price * 1000).toLocaleString('vi-VN')} VND / đêm`
            : "Giá không xác định";

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

        if (selectedServices.some(id => services.find(s => s.id === id)?.name === "Đưa đón")) {
            if (!pickupDetails.address || !pickupDetails.lat || !pickupDetails.lng || !pickupDetails.time || !pickupDetails.luggageWeight || !pickupDetails.price) {
                toast.error("Vui lòng điền đầy đủ thông tin đón khách.");
                return false;
            }
        }

        return true;
    };

    const handlePickupSubmit = () => {
        if (!pickupDetails.address || !pickupDetails.lat || !pickupDetails.lng || !pickupDetails.time || !pickupDetails.luggageWeight || !pickupDetails.price) {
            toast.error("Vui lòng điền đầy đủ thông tin đón khách.");
            return;
        }
        setShowPickupModal(false);
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setPickupDetails(prev => ({
                        ...prev,
                        lat: latitude,
                        lng: longitude,
                    }));
                    reverseGeocode(latitude, longitude);
                    if (leafletMapRef.current && markerRef.current) {
                        leafletMapRef.current.setView([latitude, longitude], 12);
                        markerRef.current.setLatLng([latitude, longitude]);
                    }
                    toast.success("Đã lấy vị trí hiện tại.");
                },
                (err) => {
                    console.error("Geolocation error:", err);
                    toast.error("Không thể lấy vị trí hiện tại. Vui lòng cấp quyền hoặc chọn thủ công.");
                },
                { enableHighAccuracy: true }
            );
        } else {
            toast.error("Trình duyệt không hỗ trợ định vị.");
        }
    };

    const handlePayment = async () => {
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

        if (!validateForm()) {
            return;
        }

        if (paymentMethod === "vnpay" && !paymentCompleted) {
            toast.error("Vui lòng hoàn tất thanh toán VN PAY trước khi xác nhận đặt phòng.");
            return;
        }

        setError("");
        const pickupService = services.find(s => s.name === "Đưa đón" && selectedServices.includes(s.id));
        const bookingData = {
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            numOfAdults: numOfAdults,
            numOfChild: numOfChild,
            services: pickupService ? [
                {
                    id: pickupService.id,
                    pickupAddress: pickupDetails.address,
                    pickupLat: pickupDetails.lat,
                    pickupLng: pickupDetails.lng,
                    pickupTime: `${checkInDate}T${pickupDetails.time}:00`
                }
            ] : []
        };

        try {
            console.log("bookingData: ", bookingData, selectedRoomId, userId);
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
                        <RoomInfo room={room} displayPrice={displayPrice} />
                        <BookingForm
                            error={error}
                            checkInDate={checkInDate}
                            setCheckInDate={setCheckInDate}
                            checkOutDate={checkOutDate}
                            setCheckOutDate={setCheckOutDate}
                            numOfAdults={numOfAdults}
                            setNumOfAdults={setNumOfAdults}
                            numOfChild={numOfChild}
                            setNumOfChild={setNumOfChild}
                            services={services}
                            selectedServices={selectedServices}
                            setSelectedServices={setSelectedServices}
                            setShowPickupModal={setShowPickupModal}
                            paymentMethod={paymentMethod}
                            setPaymentMethod={setPaymentMethod}
                            paymentCompleted={paymentCompleted}
                            setPaymentCompleted={setPaymentCompleted}
                            isPaymentSuccessful={isPaymentSuccessful}
                            handlePayment={handlePayment}
                            handleSubmit={handleSubmit}
                            today={today}
                            pickupDetails={pickupDetails}
                        />
                    </div>
                </div>
            </div>
            <PickupModal
                showPickupModal={showPickupModal}
                setShowPickupModal={setShowPickupModal}
                pickupDetails={pickupDetails}
                setPickupDetails={setPickupDetails}
                setSelectedServices={setSelectedServices}
                services={services}
                handlePickupSubmit={handlePickupSubmit}
                setShowLocationModal={setShowLocationModal}
            />
            <LocationModal
                showLocationModal={showLocationModal}
                setShowLocationModal={setShowLocationModal}
                locationSearch={locationSearch}
                setLocationSearch={setLocationSearch}
                pickupDetails={pickupDetails}
                setPickupDetails={setPickupDetails}
                handleLocationSearch={handleLocationSearch}
                getCurrentLocation={getCurrentLocation}
                mapRef={mapRef}
                markerRef={markerRef}
                leafletMapRef={leafletMapRef}
                reverseGeocode={reverseGeocode}
            />
            <ToastContainer />
            <Footer />
        </div>
    );
};

export default BookingPage;