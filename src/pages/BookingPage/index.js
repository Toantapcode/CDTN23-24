import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Header from "../component/header";
import Footer from "../component/footer";
import imgbg from "../../assets/image/hero3.webp";
import axiosInstance from "../../request";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";
import {
    Box,
    Button,
    Typography,
    Menu,
    MenuItem,
    TextField,
    ListItemIcon,
    ListItemText,
    CircularProgress,
    Divider,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Sửa lỗi icon mặc định của Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Bind modal to app element for accessibility
Modal.setAppElement("#root");

// Hàm tiện ích để lấy danh sách địa điểm từ Nominatim
const fetchLocationsFromNominatim = async (query) => {
    if (!query || query.trim().length < 3) return [];
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
                query
            )}&format=json&addressdetails=1&limit=5`
        );
        const data = await response.json();
        return data.map((item) => ({
            name: item.display_name,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
        }));
    } catch (error) {
        console.error("Error fetching locations from Nominatim:", error);
        return [];
    }
};

// Component phụ để bắt sự kiện click trên bản đồ
const MapEvents = ({ onMapClick }) => {
    useMapEvents({
        click: onMapClick,
    });
    return null;
};

// Component LocationModal để chọn vị trí trên bản đồ
const LocationModal = ({ open, onClose, onSelectLocation }) => {
    const [draggedLocation, setDraggedLocation] = useState(null);

    const locationIcon = new L.Icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -41],
    });

    const handleMapClick = (e) => {
        const { lat, lng } = e.latlng;
        setDraggedLocation({ lat, lng });
    };

    const handleMarkerDrag = (e) => {
        const { lat, lng } = e.target.getLatLng();
        setDraggedLocation({ lat, lng });
    };

    const handleSaveLocation = async () => {
        if (draggedLocation) {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${draggedLocation.lat
                    }&lon=${draggedLocation.lng}&format=json`
                );
                const data = await response.json();
                const location = {
                    name: data.display_name || "Vị trí đã chọn",
                    lat: draggedLocation.lat,
                    lng: draggedLocation.lng,
                };
                onSelectLocation(location);
                onClose();
            } catch (error) {
                console.error("Error reverse geocoding:", error);
                toast.error("Không thể lấy thông tin vị trí. Vui lòng thử lại.");
            }
        } else {
            toast.error("Vui lòng chọn một vị trí trên bản đồ.");
        }
    };

    return (
        <Modal
            isOpen={open}
            onRequestClose={onClose}
            style={{
                overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 1000,
                },
                content: {
                    top: "50%",
                    left: "50%",
                    right: "auto",
                    bottom: "auto",
                    marginRight: "-50%",
                    transform: "translate(-50%, -50%)",
                    width: "700px",
                    height: "600px",
                    padding: 0,
                    borderRadius: "8px",
                },
            }}
        >
            <Box
                sx={{
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 2,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography variant="h6" mb={2}>
                    Chọn vị trí trên bản đồ
                </Typography>
                <MapContainer
                    center={[21.0285, 105.8542]}
                    zoom={13}
                    style={{ width: "100%", height: "100%", zIndex: 1 }}
                    key={open ? "map-open" : "map-closed"}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <MapEvents onMapClick={handleMapClick} />
                    {draggedLocation && (
                        <Marker
                            position={[draggedLocation.lat, draggedLocation.lng]}
                            draggable={true}
                            eventHandlers={{ dragend: handleMarkerDrag }}
                            icon={locationIcon}
                        >
                            <Popup>Vị trí bạn đã chọn</Popup>
                        </Marker>
                    )}
                </MapContainer>
                <Box sx={{ mt: 2, width: "100%", display: "flex", gap: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        color="secondary"
                        fullWidth
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveLocation}
                        color="primary"
                        fullWidth
                    >
                        Chọn vị trí
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

// Component LocationSearch để tìm kiếm và chọn vị trí
const LocationSearch = ({ onLocationSelect }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [locationAnchorEl, setLocationAnchorEl] = useState(null);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [mapModalOpen, setMapModalOpen] = useState(false);

    useEffect(() => {
        const savedUserLocation = localStorage.getItem("userLocation");
        if (savedUserLocation) {
            setUserLocation(JSON.parse(savedUserLocation));
        }

        const savedSelectedLocation = localStorage.getItem("selectedLocation");
        if (savedSelectedLocation) {
            setSelectedLocation(JSON.parse(savedSelectedLocation));
        }

        if (navigator.geolocation && !savedUserLocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    if (!latitude || !longitude) {
                        console.error("Invalid coordinates:", { latitude, longitude });
                        toast.error("Không thể lấy tọa độ hiện tại.");
                        return;
                    }
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                        );
                        const data = await response.json();
                        const location = {
                            name: data.display_name || "Vị trí hiện tại",
                            lat: latitude,
                            lng: longitude,
                        };
                        setUserLocation(location);
                        localStorage.setItem(
                            "userLocation",
                            JSON.stringify(location)
                        );
                        console.log("User location set:", location);
                    } catch (error) {
                        console.error("Error reverse geocoding:", error);
                        toast.error("Không thể lấy thông tin vị trí hiện tại.");
                    }
                },
                (error) => {
                    console.error("Error getting location:", error);
                    toast.error("Vui lòng cấp quyền truy cập vị trí để sử dụng tính năng này.");
                }
            );
        }
    }, []);

    const handleLocationClick = (event) => {
        setLocationAnchorEl(event.currentTarget);
    };

    const handleLocationClose = () => {
        setLocationAnchorEl(null);
        setSearchQuery("");
        setLocations([]);
    };

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        localStorage.setItem("selectedLocation", JSON.stringify(location));
        onLocationSelect(location);
        handleLocationClose();
    };

    const handleCurrentLocation = () => {
        if (userLocation && userLocation.lat && userLocation.lng) {
            setSelectedLocation(userLocation);
            localStorage.setItem(
                "selectedLocation",
                JSON.stringify(userLocation)
            );
            onLocationSelect(userLocation);
            handleLocationClose();
        } else {
            toast.error("Không thể lấy vị trí hiện tại. Vui lòng thử lại hoặc chọn vị trí khác.");
        }
    };

    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    };

    const searchLocations = async (query) => {
        if (query.trim().length < 3) {
            setLocations([]);
            return;
        }
        setLoading(true);
        try {
            const fetched = await fetchLocationsFromNominatim(query);
            setLocations(fetched);
            if (fetched.length === 0) {
                toast.warn("Không tìm thấy địa điểm phù hợp.");
            }
        } catch (error) {
            toast.error("Lỗi khi tìm kiếm địa điểm.");
        } finally {
            setLoading(false);
        }
    };

    const debouncedSearchLocations = useCallback(debounce(searchLocations, 500), []);

    useEffect(() => {
        debouncedSearchLocations(searchQuery);
    }, [searchQuery, debouncedSearchLocations]);

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ mb: 2 }}>
                <Button
                    variant="outlined"
                    startIcon={<LocationOnIcon />}
                    onClick={handleLocationClick}
                    sx={{
                        width: "100%",
                        borderColor: "grey.300",
                        textTransform: "none",
                        color: "text.primary",
                        bgcolor: "background.paper",
                        justifyContent: "flex-start",
                        py: 1,
                        borderRadius: 1,
                    }}
                >
                    <Typography variant="body1" sx={{ flex: 1 }}>
                        {selectedLocation
                            ? selectedLocation.name
                            : userLocation
                                ? userLocation.name
                                : "Chọn vị trí"}
                    </Typography>
                </Button>
                <Menu
                    anchorEl={locationAnchorEl}
                    open={Boolean(locationAnchorEl)}
                    onClose={handleLocationClose}
                    PaperProps={{
                        sx: {
                            maxHeight: "400px",
                            width: "100%",
                            maxWidth: 400,
                            mt: 1,
                            boxShadow: 3,
                            borderRadius: 2,
                        },
                    }}
                >
                    <Box sx={{ p: 1 }}>
                        <TextField
                            variant="outlined"
                            placeholder="Tìm kiếm địa chỉ..."
                            fullWidth
                            size="small"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 1,
                                },
                            }}
                        />
                    </Box>
                    <MenuItem
                        onClick={handleCurrentLocation}
                        disabled={loading || !userLocation}
                    >
                        <ListItemIcon>
                            {loading ? (
                                <CircularProgress size={20} />
                            ) : (
                                <MyLocationIcon fontSize="small" color="primary" />
                            )}
                        </ListItemIcon>
                        <ListItemText primary="Vị trí hiện tại" />
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            setMapModalOpen(true);
                            setLocationAnchorEl(null);
                        }}
                    >
                        <ListItemIcon>
                            <LocationOnIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Chọn trên bản đồ" />
                    </MenuItem>
                    <Divider />
                    {loading ? (
                        <Box
                            sx={{ display: "flex", justifyContent: "center", p: 2 }}
                        >
                            <CircularProgress size={24} />
                        </Box>
                    ) : searchQuery && locations.length === 0 ? (
                        <MenuItem disabled>
                            <ListItemText primary="Không tìm thấy địa điểm" />
                        </MenuItem>
                    ) : (
                        locations.map((location, index) => (
                            <MenuItem
                                key={index}
                                onClick={() => handleLocationSelect(location)}
                            >
                                <ListItemText primary={location.name} />
                            </MenuItem>
                        ))
                    )}
                </Menu>
            </Box>
            <LocationModal
                open={mapModalOpen}
                onClose={() => setMapModalOpen(false)}
                onSelectLocation={handleLocationSelect}
            />
        </Box>
    );
};

// Component chính BookingPage
const BookingPage = () => {
    const { state } = useLocation();
    const [searchParams] = useSearchParams();
    const [room, setRoom] = useState(() => {
        return (
            state?.room ||
            JSON.parse(localStorage.getItem("SelectedRoom")) || {
                name: "Không xác định",
                description: "",
                image: "path/to/default_image.jpg",
                price: null,
                type: "",
            }
        );
    });

    const savedFormData = JSON.parse(localStorage.getItem("BookingFormData")) || {};
    const [checkInDate, setCheckInDate] = useState(savedFormData.checkInDate || "");
    const [checkOutDate, setCheckOutDate] = useState(
        savedFormData.checkOutDate || ""
    );
    const [numOfAdults, setNumOfAdults] = useState(savedFormData.numOfAdults || 1);
    const [numOfChild, setNumOfChild] = useState(savedFormData.numOfChild || 0);
    const [paymentMethod, setPaymentMethod] = useState(
        savedFormData.paymentMethod || ""
    );
    const [error, setError] = useState("");
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState(
        savedFormData.selectedServices || []
    );
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
    const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
    const [pickupData, setPickupData] = useState({
        location: { lat: 21.0285, lng: 105.8542 },
        address: savedFormData.pickupData?.address || "",
        time: savedFormData.pickupData?.time || "",
        luggage: savedFormData.pickupData?.luggage || 0,
        distance: savedFormData.pickupData?.distance || 0,
        cost: savedFormData.pickupData?.cost || 0,
    });

    const today = new Date().toISOString().split("T")[0];
    const selectedRoomId = localStorage.getItem("SelectedRoomId");
    const storedUser = localStorage.getItem("User: ");
    const userData = storedUser ? JSON.parse(storedUser) : null;
    const userId = userData?.id || null;

    // Tọa độ khách sạn (giả sử cố định)
    const hotelLocation = { lat: 21.0285, lng: 105.8542 };

    useEffect(() => {
        if (searchParams.get("status") === "00") {
            setIsPaymentSuccessful(true);
            setPaymentCompleted(true);
            setPaymentMethod("vnpay");
            toast.success("Thanh toán VN PAY thành công!", {
                position: "top-right",
                autoClose: 3000,
            });
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axiosInstance.get("/service/all");
                setServices(response.serviceList || []);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách dịch vụ:", error);
                toast.error("Không thể tải danh sách dịch vụ.");
                setServices([]);
            }
        };
        fetchServices();
    }, []);

    useEffect(() => {
        const formData = {
            checkInDate,
            checkOutDate,
            numOfAdults,
            numOfChild,
            paymentMethod,
            selectedServices,
            pickupData,
        };
        localStorage.setItem("BookingFormData", JSON.stringify(formData));
    }, [
        checkInDate,
        checkOutDate,
        numOfAdults,
        numOfChild,
        paymentMethod,
        selectedServices,
        pickupData,
    ]);

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
        let total = selectedServices.reduce((total, serviceId) => {
            const service = services.find((s) => s.id === serviceId);
            return total + (service?.price || 0);
        }, 0);
        if (
            selectedServices.includes(
                services.find((s) => s.name === "Đưa đón")?.id
            )
        ) {
            total += pickupData.cost / 1000;
        }
        return total;
    };

    const totalPrice =
        room.price && calculateDays() > 0
            ? room.price * 1000 * calculateDays() + calculateServiceTotal() * 1000
            : calculateServiceTotal() * 1000;

    const displayPrice =
        totalPrice > 0 && !isNaN(totalPrice)
            ? `${totalPrice.toLocaleString("vi-VN")} VND (${calculateDays()
            } đêm${selectedServices.length > 0 ? " + dịch vụ" : ""})`
            : room.price !== null && room.price !== undefined
                ? `${(room.price * 1000).toLocaleString("vi-VN")} VND / đêm`
                : "Giá không xác định";

    const handleServiceChange = (serviceId) => {
        const service = services.find((s) => s.id === serviceId);
        if (service.name === "Đưa đón") {
            if (selectedServices.includes(serviceId)) {
                setSelectedServices((prev) => prev.filter((id) => id !== serviceId));
                setPickupData({
                    location: { lat: 21.0285, lng: 105.8542 },
                    address: "",
                    time: "",
                    luggage: 0,
                    distance: 0,
                    cost: 0,
                });
            } else {
                setIsPickupModalOpen(true);
                setSelectedServices((prev) => [...prev, serviceId]);
            }
        } else {
            setSelectedServices((prev) => {
                if (prev.includes(serviceId)) {
                    return prev.filter((id) => id !== serviceId);
                } else {
                    return [...prev, serviceId];
                }
            });
        }
    };

    const calculateDistanceAndCost = async () => {
        try {
            // Kiểm tra tọa độ hợp lệ
            const lat1 = pickupData.location?.lat;
            const lon1 = pickupData.location?.lng;
            const lat2 = hotelLocation.lat;
            const lon2 = hotelLocation.lng;

            if (!lat1 || !lon1 || isNaN(lat1) || isNaN(lon1)) {
                console.error("Tọa độ người dùng không hợp lệ:", { lat1, lon1 });
                toast.error("Tọa độ không hợp lệ. Vui lòng chọn lại vị trí.");
                return 0;
            }
            if (!lat2 || !lon2 || isNaN(lat2) || isNaN(lon2)) {
                console.error("Tọa độ khách sạn không hợp lệ:", { lat2, lon2 });
                toast.error("Tọa độ khách sạn không hợp lệ.");
                return 0;
            }

            console.log("Tọa độ người dùng:", { lat1, lon1 });
            console.log("Tọa độ khách sạn:", { lat2, lon2 });

            // Công thức Haversine để tính khoảng cách (km)
            const toRad = (value) => (value * Math.PI) / 180;
            const R = 6371; // Bán kính trái đất (km)
            const dLat = toRad(lat2 - lat1);
            const dLon = toRad(lon2 - lon1);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(lat1)) *
                Math.cos(toRad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const distanceInKm = R * c;

            // Kiểm tra khoảng cách vượt quá 200km
            if (distanceInKm > 200) {
                toast.error("Không thuộc phạm vi đưa đón của khách sạn (tối đa 200km).");
                setPickupData((prev) => ({
                    ...prev,
                    distance: distanceInKm,
                    cost: 0,
                }));
                return 0;
            }

            const cost = distanceInKm * 10000; // 10.000 VNĐ/km
            console.log("Khoảng cách:", distanceInKm, "km");
            console.log("Chi phí:", cost, "VND");

            setPickupData((prev) => ({
                ...prev,
                distance: distanceInKm,
                cost: cost,
            }));
            return cost;
        } catch (error) {
            console.error("Lỗi khi tính khoảng cách:", error);
            toast.error("Không thể tính khoảng cách. Vui lòng thử lại.");
            return 0;
        }
    };

    const handleLocationSelect = async (location) => {
        console.log("Selected location:", location);
        if (!location || !location.lat || !location.lng) {
            toast.error("Vị trí không hợp lệ. Vui lòng chọn lại.");
            return;
        }
        setPickupData((prev) => ({
            ...prev,
            location: { lat: location.lat, lng: location.lng },
            address: location.name,
        }));
        // Tính chi phí ngay sau khi chọn vị trí
        const cost = await calculateDistanceAndCost();
        if (cost === 0 && pickupData.distance <= 200) {
            toast.error("Không thể tính chi phí đưa đón. Vui lòng chọn lại vị trí.");
        }
    };

    const handlePickupSubmit = async () => {
        console.log("Pickup Data:", pickupData);

        // Kiểm tra từng trường
        if (!pickupData.address) {
            toast.error("Vui lòng chọn điểm đón.");
            return;
        }
        if (!pickupData.time) {
            toast.error("Vui lòng chọn thời gian đón.");
            return;
        }
        if (pickupData.luggage === undefined || pickupData.luggage < 0) {
            toast.error("Vui lòng nhập khối lượng hành lý hợp lệ.");
            return;
        }
        if (pickupData.distance > 200) {
            toast.error("Không thuộc phạm vi đưa đón của khách sạn (tối đa 200km).");
            return;
        }

        try {
            const cost = await calculateDistanceAndCost();
            if (cost === 0) {
                toast.error("Không thể tính chi phí đưa đón. Vui lòng chọn lại vị trí.");
                return;
            }
            setIsPickupModalOpen(false);
            toast.success("Thông tin đưa đón đã được lưu!");
        } catch (error) {
            console.error("Error in handlePickupSubmit:", error);
            toast.error("Lỗi khi lưu thông tin đưa đón. Vui lòng thử lại.");
        }
    };

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

        if (
            selectedServices.includes(
                services.find((s) => s.name === "Đưa đón")?.id
            ) &&
            (!pickupData.cost || pickupData.cost === 0)
        ) {
            toast.error("Vui lòng hoàn tất thông tin dịch vụ đưa đón.");
            return false;
        }

        return true;
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
            toast.error(
                error.em || "Khởi tạo thanh toán VN PAY thất bại. Vui lòng thử lại.",
                {
                    position: "top-right",
                    autoClose: 3000,
                }
            );
            setError("Khởi tạo thanh toán VN PAY thất bại. Vui lòng thử lại.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (paymentMethod === "vnpay" && !paymentCompleted) {
            toast.error(
                "Vui lòng hoàn tất thanh toán VN PAY trước khi xác nhận đặt phòng."
            );
            return;
        }

        setError("");
        const bookingData = {
            checkInDate,
            checkOutDate,
            numOfAdults,
            numOfChild,
            serviceIds: selectedServices,
            pickupData: selectedServices.includes(
                services.find((s) => s.name === "Đưa đón")?.id
            )
                ? pickupData
                : null,
        };

        try {
            const response = await axiosInstance.post(
                `/booking/bookRoom/${selectedRoomId}/${userId}`,
                bookingData
            );
            toast.success("Đặt phòng thành công!", {
                position: "top-right",
                autoClose: 3000,
            });

            localStorage.removeItem("SelectedRoomId");
            localStorage.removeItem("SelectedRoom");
            localStorage.removeItem("SelectedServices");
            localStorage.removeItem("BookingFormData");
        } catch (error) {
            console.error("Lỗi khi đặt phòng:", error);
            toast.error(
                error.em || "Đặt phòng thất bại. Vui lòng thử lại.",
                {
                    position: "top-right",
                    autoClose: 3000,
                }
            );
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
                    <h1 className="text-8xl font-bold text-white mb-4 font-pacifico">
                        Đặt Phòng
                    </h1>
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
                            <h3 className="text-2xl font-bold text-gray-800 mt-4">
                                {room.name}
                            </h3>
                            <p className="text-gray-600 mt-2">{room.description}</p>
                            <p className="text-yellow-600 font-bold text-lg mt-2">
                                {displayPrice}
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                Thông tin đặt phòng
                            </h3>
                            {error && <p className="text-red-500 mb-4">{error}</p>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700 font-bold mb-2"
                                        htmlFor="checkInDate"
                                    >
                                        Ngày nhận phòng
                                    </label>
                                    <input
                                        type="date"
                                        id="checkInDate"
                                        value={checkInDate}
                                        onChange={(e) => setCheckInDate(e.target.value)}
                                        min={today}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700 font-bold mb-2"
                                        htmlFor="checkOutDate"
                                    >
                                        Ngày trả phòng
                                    </label>
                                    <input
                                        type="date"
                                        id="checkOutDate"
                                        value={checkOutDate}
                                        onChange={(e) => setCheckOutDate(e.target.value)}
                                        min={checkInDate || today}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700 font-bold mb-2"
                                        htmlFor="numOfAdults"
                                    >
                                        Số lượng người lớn
                                    </label>
                                    <input
                                        type="number"
                                        id="numOfAdults"
                                        value={numOfAdults}
                                        onChange={(e) =>
                                            setNumOfAdults(
                                                Math.max(1, parseInt(e.target.value))
                                            )
                                        }
                                        min="1"
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        className="block text-gray-700 font-bold mb-2"
                                        htmlFor="numOfChild"
                                    >
                                        Số lượng trẻ em
                                    </label>
                                    <input
                                        type="number"
                                        id="numOfChild"
                                        value={numOfChild}
                                        onChange={(e) =>
                                            setNumOfChild(
                                                Math.max(0, parseInt(e.target.value))
                                            )
                                        }
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
                                                    onClick={() =>
                                                        handleServiceChange(service.id)
                                                    }
                                                    className={`p-2 rounded-lg text-sm transition-colors ${selectedServices.includes(
                                                        service.id
                                                    )
                                                        ? "bg-yellow-600 text-white"
                                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                        }`}
                                                >
                                                    {service.name}{" "}
                                                    {(service.price * 1000).toLocaleString(
                                                        "vi-VN"
                                                    )}{" "}
                                                    VND
                                                </button>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 col-span-2">
                                                Không có dịch vụ nào
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {!isPaymentSuccessful && (
                                    <div className="mb-4">
                                        <label
                                            className="block text-gray-700 font-bold mb-2"
                                            htmlFor="paymentMethod"
                                        >
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
                                            <option value="">
                                                Chọn phương thức thanh toán
                                            </option>
                                            <option value="cash">Tiền mặt</option>
                                            <option value="vnpay">VN PAY</option>
                                        </select>
                                    </div>
                                )}
                                {!isPaymentSuccessful &&
                                    paymentMethod === "vnpay" &&
                                    !paymentCompleted && (
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
                                    disabled={
                                        paymentMethod === "vnpay" && !paymentCompleted
                                    }
                                >
                                    Xác nhận đặt phòng
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isPickupModalOpen}
                onRequestClose={() => setIsPickupModalOpen(false)}
                className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto mt-20"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <h2 className="text-2xl font-bold mb-4">
                    Thông tin dịch vụ đưa đón
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">
                            Điểm đón
                        </label>
                        <LocationSearch onLocationSelect={handleLocationSelect} />
                        {pickupData.address && (
                            <p className="text-sm text-gray-600 mt-1">
                                Đã chọn: {pickupData.address}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-bold mb-2">
                            Thời gian đón (giờ)
                        </label>
                        <input
                            type="time"
                            value={pickupData.time}
                            onChange={(e) =>
                                setPickupData((prev) => ({
                                    ...prev,
                                    time: e.target.value,
                                }))
                            }
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-bold mb-2">
                            Khối lượng hành lý (kg)
                        </label>
                        <input
                            type="number"
                            value={pickupData.luggage}
                            onChange={(e) =>
                                setPickupData((prev) => ({
                                    ...prev,
                                    luggage: Math.max(0, parseInt(e.target.value) || 0),
                                }))
                            }
                            min="0"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                            required
                        />
                    </div>

                    <div>
                        <p className="text-lg font-semibold">
                            Chi phí dự tính:{" "}
                            {pickupData.cost > 0
                                ? `${pickupData.cost.toLocaleString("vi-VN")} VND`
                                : pickupData.distance > 200
                                    ? "Không thuộc phạm vi đưa đón (tối đa 200km)"
                                    : "Đang tính toán..."}
                            {pickupData.distance > 0 &&
                                pickupData.distance <= 200 &&
                                ` (${pickupData.distance.toFixed(2)} km)`}
                        </p>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={() => setIsPickupModalOpen(false)}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handlePickupSubmit}
                            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
                        >
                            Xác nhận
                        </button>
                    </div>
                </div>
            </Modal>

            <ToastContainer />
            <Footer />
        </div>
    );
};

export default BookingPage;