import { useEffect, useState } from "react";
import axiosInstance from "../../request";
import { Card } from "antd";

const roomTypes = ["FAMILY", "COUPLE", "VIP"];

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axiosInstance.get("/room/all");
                setRooms(response.roomList || []);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu phòng:", error);
                setRooms([]);
            }
        };

        const fetchBookings = async () => {
            try {
                const response = await axiosInstance.get("/booking/all");
                setBookings(response.bookingList || []);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu đặt phòng:", error);
                setBookings([]);
            }
        };

        fetchRooms();
        fetchBookings();
    }, []);

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Rooms</h2>
            <div className="flex gap-4">
                {roomTypes.map((type) => {
                    const roomsOfType = rooms.filter(room => room.type.name === type);
                    const totalRooms = roomsOfType.length;
                    console.log('bookings: ', bookings)
                    const bookedRooms = bookings.filter(booking =>
                        roomsOfType.some(room => room.id === booking.id)
                    ).length;
                    console.log('bookedRooms: ', bookedRooms)

                    const pricePerDay = roomsOfType[0]?.pricePerDay || 0;

                    return (
                        <Card key={type} className="w-64 shadow-md rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-700">{type}</h3>
                            <p className="text-gray-500">{bookedRooms}/{totalRooms}</p>
                            <p className="text-xl font-bold text-blue-500">${pricePerDay}/day</p>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default Rooms;
