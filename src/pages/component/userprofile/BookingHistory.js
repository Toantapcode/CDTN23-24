import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../request';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [selectedBookingID, setSelectedBookingID] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

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
            return { status: 'Đã đặt phòng', color: 'bg-blue-100 text-blue-800', canCancel: true, canReview: false };
        } else if (today >= checkIn && today <= checkOut) {
            return { status: 'Đang sử dụng', color: 'bg-green-100 text-green-800', canCancel: false, canReview: false };
        } else {
            return { status: 'Đã trả phòng', color: 'bg-gray-100 text-gray-800', canCancel: false, canReview: true };
        }
    };

    const handleCardClick = (bookingID) => {
        setSelectedBookingID(selectedBookingID === bookingID ? null : bookingID);
    };

    const handleCancelBooking = async (bookingId) => {
        const booking = bookings.find(b => b.id === bookingId);
        if (!booking) {
            toast.error('Không tìm thấy thông tin đặt phòng.', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        const today = new Date();
        const checkIn = new Date(booking.checkInDate);
        const diffTime = checkIn.getTime() - today.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        if (diffDays < 2) {
            toast.error('Bạn chỉ được phép hủy phòng trước ít nhất 2 ngày so với ngày nhận phòng.', {
                position: 'top-right',
                autoClose: 4000,
            });
            return;
        }

        try {
            await axiosInstance.delete(`/booking/cancel/${bookingId}`);
            toast.success('Hủy đặt phòng thành công!', {
                position: 'top-right',
                autoClose: 3000,
            });
            const response = await axiosInstance.get(`/user/getUserBooking/${userId}`);
            setBookings(response.user.bookings);
        } catch (error) {
            console.error('Lỗi khi hủy đặt phòng:', error);
            toast.error(error.em || 'Hủy đặt phòng thất bại. Vui lòng thử lại.', {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    const openReviewModal = (booking) => {
        setSelectedBookingForReview(booking);
        setShowReviewModal(true);
        setRating(0);
        setComment('');
    };

    const closeReviewModal = () => {
        setShowReviewModal(false);
        setSelectedBookingForReview(null);
    };

    const handleSubmitReview = async () => {
        if (!rating) {
            toast.error('Vui lòng chọn số sao đánh giá.', {
                position: 'top-right',
                autoClose: 3000,
            });
            return;
        }

        try {
            const reviewData = {
                userId: userId,
                roomId: selectedBookingForReview.room?.id,
                rating: rating,
                comment: comment || '',
            };
            console.log(reviewData)

            await axiosInstance.post('/review/create', reviewData);
            toast.success('Gửi đánh giá thành công!', {
                position: 'top-right',
                autoClose: 3000,
            });
            closeReviewModal();
        } catch (error) {
            console.error('Lỗi khi gửi đánh giá:', error);
            toast.error(error.em || 'Gửi đánh giá thất bại. Vui lòng thử lại.', {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    if (!userId) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Lịch sử đặt phòng</h2>
                <p className="text-gray-600 text-lg">Vui lòng đăng nhập để xem lịch sử đặt phòng.</p>
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Lịch sử đặt phòng</h2>
                <p className="text-gray-600 text-lg">Không có lịch sử đặt phòng nào.</p>
            </div>
        );
    }

    const sortedBookings = [...bookings].sort((a, b) => {
        const getPriority = (booking) => {
            const { status } = getBookingStatus(booking.checkInDate, booking.checkOutDate);
            switch (status) {
                case 'Đang sử dụng':
                    return 0;
                case 'Đã đặt phòng':
                    return 1;
                case 'Đã trả phòng':
                    return 2;
                default:
                    return 3;
            }
        };

        return getPriority(a) - getPriority(b);
    });

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Lịch sử đặt phòng</h2>
            <div className="space-y-6">
                {sortedBookings.map((booking) => {
                    const { status, color, canCancel, canReview } = getBookingStatus(booking.checkInDate, booking.checkOutDate);
                    return (
                        <div
                            key={booking.id}
                            className="bg-white shadow-lg rounded-xl p-6 cursor-pointer hover:shadow-xl transition-shadow duration-200"
                            onClick={() => handleCardClick(booking.id)}
                        >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="space-y-2">
                                    <p className="text-lg font-semibold text-gray-900">
                                        Mã đặt phòng: {booking.bookingCode || 'N/A'}
                                    </p>
                                    <p className="text-gray-600">
                                        Ngày đặt: {booking.checkInDate || 'N/A'}
                                    </p>
                                    <p className="text-gray-600">
                                        Tổng tiền: {(booking.totalAmount * 1000).toLocaleString('vi-VN')} VND
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${color}`}
                                    >
                                        Trạng thái: {status}
                                    </span>
                                    <div className="flex gap-2">
                                        {canCancel && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCancelBooking(booking.id);
                                                }}
                                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-medium transition-colors"
                                            >
                                                Hủy
                                            </button>
                                        )}
                                        {canReview && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openReviewModal(booking);
                                                }}
                                                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 text-sm font-medium transition-colors"
                                            >
                                                Đánh giá
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {selectedBookingID === booking.id && (
                                <div className="mt-4 border-t border-gray-200 pt-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
                                        <p>
                                            <span className="font-medium">Tên phòng:</span>{' '}
                                            {booking.room?.name || 'N/A'}
                                        </p>
                                        <p>
                                            <span className="font-medium">Loại phòng:</span>{' '}
                                            {booking.room?.type.name || 'N/A'}
                                        </p>
                                        <p>
                                            <span className="font-medium">Ngày nhận phòng:</span>{' '}
                                            {booking.checkInDate || 'N/A'}
                                        </p>
                                        <p>
                                            <span className="font-medium">Ngày trả phòng:</span>{' '}
                                            {booking.checkOutDate || 'N/A'}
                                        </p>
                                        <p>
                                            <span className="font-medium">Số khách:</span>{' '}
                                            {booking.totalNumOfGuest || 'N/A'}
                                        </p>
                                        <p>
                                            <span className="font-medium">Ghi chú:</span>{' '}
                                            {booking.notes || 'Không có'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {showReviewModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Đánh giá phòng</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cảm nhận của bạn thế nào về trải nghiệm tại khách sạn?
                            </label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FontAwesomeIcon
                                        key={star}
                                        icon={star <= rating ? faStarSolid : faStarRegular}
                                        className={`h-6 w-6 cursor-pointer ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                        onClick={() => setRating(star)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nhận xét
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="4"
                                placeholder="Nhập nhận xét của bạn..."
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={closeReviewModal}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 text-sm font-medium transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSubmitReview}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                            >
                                Gửi đánh giá
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default BookingHistory;