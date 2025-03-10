import { useEffect, useState } from "react";
import axiosInstance from "../../request"


const Overview = () => {
    const [bookings, setBookings] = useState([]);
    const today = new Date().toISOString().split("T")[0];
    const [numOfRoom, setNumOfRoom] = useState(0);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axiosInstance.get("/booking/all");
                setBookings(response.bookingList || []);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
                setBookings([]);
            }
        };

        fetchBookings();
    }, []);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axiosInstance.get("/room/all");
                setNumOfRoom(response.roomList.length || 0);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu phòng:", error);
                setNumOfRoom(0);
            }
        };

        fetchRooms();
    }, []);

    const checkInToday = bookings.filter((b) => b.checkInDate === today).length;
    const checkOutToday = bookings.filter((b) => b.checkOutDate === today).length;
    const totalInHotel = bookings.reduce((total, booking) => total + booking.totalNumOfGuest, 0);
    const totalRooms = numOfRoom;
    const occupiedRooms = bookings.length;
    const availableRooms = totalRooms - occupiedRooms;

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Tổng Quan</h2>
            <div className="grid grid-cols-5 gap-4">
                <div className="text-center">
                    <p className="text-lg font-semibold text-gray-600">Hôm nay</p>
                    <p className="text-4xl font-bold text-green-500">{checkInToday}</p>
                    <p className="text-base text-gray-500">Check-in</p>
                </div>
                <div className="text-center">
                    <p className="text-lg font-semibold text-gray-600">Hôm nay</p>
                    <p className="text-4xl font-bold text-yellow-500">{checkOutToday}</p>
                    <p className="text-base text-gray-500">Check-out</p>
                </div>
                <div className="text-center">
                    <p className="text-lg font-semibold text-gray-600">Tổng</p>
                    <p className="text-4xl font-bold text-blue-500">{totalInHotel}</p>
                    <p className="text-base text-gray-500">Khách trong khách sạn</p>
                </div>
                <div className="text-center">
                    <p className="text-lg font-semibold text-gray-600">Tổng</p>
                    <p className="text-4xl font-bold text-red-500">{availableRooms}</p>
                    <p className="text-base text-gray-500">Phòng trống</p>
                </div>
                <div className="text-center">
                    <p className="text-lg font-semibold text-gray-600">Tổng</p>
                    <p className="text-4xl font-bold text-purple-500">{occupiedRooms}</p>
                    <p className="text-base text-gray-500">Phòng đã đặt</p>
                </div>
            </div>
        </div>
    );
};

export default Overview;
