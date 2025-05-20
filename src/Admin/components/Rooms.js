import { useEffect, useState } from "react";
import axiosInstance from "../../request";
import { Card } from "antd";

const Rooms = () => {
    const [rooms, setRooms] = useState({});
    const [revenues, setRevenues] = useState({});

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axiosInstance.get("/room/bookingStatus");
                setRooms(response.roomTypeBooking || {});
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu phòng:", error);
                setRooms({});
            }
        };

        fetchRooms();
    }, []);

    useEffect(() => {
        const fetchRevenues = async () => {
            try {
                const response = await axiosInstance.get("/invoice/revenu/room-type/today");
                if (response && response.roomTypeRevenueList) {
                    const revenueMap = response.roomTypeRevenueList.reduce((acc, item) => ({
                        ...acc,
                        [item.roomTypeName]: item.totalRevenue,
                    }), {});
                    setRevenues(revenueMap);
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu doanh thu:", error);
                setRevenues({});
            }
        };

        fetchRevenues();
    }, []);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl mt-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Phòng</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(rooms).map(([type, status]) => (
                    <div
                        key={type}
                        className="bg-gray-50 rounded-xl shadow hover:shadow-lg transition-shadow duration-300 p-5 flex flex-col justify-between"
                    >
                        <div className="mb-4">
                            <h1 className="text-sm uppercase text-blue-500 font-semibold tracking-wide">Hôm nay</h1>
                            <h3 className="text-xl font-bold text-gray-800 mt-1">{type}</h3>
                            <p className="text-gray-600 mt-1">{status} phòng</p>
                        </div>
                        <p className="text-lg font-semibold text-green-600">
                            Tổng thu: {revenues[type] * 1000
                                ? (revenues[type] * 1000).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                                : '0 VNĐ'}
                        </p>
                    </div>
                ))}
            </div>
        </div>


    );
};

export default Rooms;
