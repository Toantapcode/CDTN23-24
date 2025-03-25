import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../request';

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [selectedBookingID, setSelectedBookingID] = useState(null);

    const storedUser = localStorage.getItem('User: ');
    const userData = storedUser ? JSON.parse(storedUser) : null;
    const userId = userData?.id || null;

    useEffect(() => {
        if (userId) {
            const fetchBookings = async () => {
                try {
                    const response = await axiosInstance.get(`/user/getUserBooking/${userId}`);

                    setBookings(response.user.bookings);
                } catch (error) {
                    console.error('Lỗi khi lấy lịch sử đặt phòng:', error);
                    setBookings([]);
                }
            };
            fetchBookings();
        }
    }, [userId]);

    const getBookingStatus = (checkInDate, checkOutDate) => {
        const today = new Date();
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        if (today < checkIn) {
            return { status: 'Đã đặt phòng', color: 'bg-blue-100 text-blue-800' };
        } else if (today >= checkIn && today <= checkOut) {
            return { status: 'Đang sử dụng', color: 'bg-green-100 text-green-800' };
        } else {
            return { status: 'Đã trả phòng', color: 'bg-gray-100 text-gray-800' };
        }
    };

    const handleCardClick = (bookingID) => {
        setSelectedBookingID(selectedBookingID === bookingID ? null : bookingID); 
    };

    if (!userId) {
        return (
            <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Lịch sử đặt phòng</h2>
                <p>Vui lòng đăng nhập để xem lịch sử đặt phòng.</p>
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Lịch sử đặt phòng</h2>
                <p>Không có lịch sử đặt phòng nào.</p>
            </div>
        );
    }
    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Lịch sử đặt phòng</h2>
            <div className="space-y-4">
                {bookings.map((booking) => {
                    const { status, color } = getBookingStatus(booking.checkInDate, booking.checkOutDate);
                    return (
                        <div
                            key={booking.id}
                            className="bg-white shadow-md p-4 rounded-lg cursor-pointer hover:bg-gray-50"
                            onClick={() => handleCardClick(booking)}
                        >
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-bold">Mã đặt phòng: {booking.bookingCode || 'N/A'}</p>
                                    <p>Ngày đặt: {booking.checkInDate || 'N/A'}</p>
                                    <p>Tổng tiền: {booking.totalAmount *1000 || 'N/A'} VND</p>
                                </div>
                                <div>
                                    <p className={`font-semibold px-2 py-1 rounded ${color}`}>
                                        Trạng thái: {status}
                                    </p>
                                </div>
                            </div>
                            {selectedBookingID === booking && (
                                <div className="mt-4 border-t pt-2">
                                    <p>Tên phòng: {booking.room?.name || 'N/A'}</p>
                                    <p>Loại phòng: {booking.room?.type.name || 'N/A'}</p>
                                    <p>Ngày nhận phòng: {booking.checkInDate || 'N/A'}</p>
                                    <p>Ngày trả phòng: {booking.checkOutDate || 'N/A'}</p>
                                    <p>Số khách: {booking.totalNumOfGuest || 'N/A'}</p>
                                    <p>Ghi chú: {booking.notes || 'Không có'}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BookingHistory;