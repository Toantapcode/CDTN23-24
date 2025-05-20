import React, { useState, useEffect } from 'react';
import axiosInstance from '../../request';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import avtDefault from '../../assets/image/avatar_default.jpg'

const ReviewModal = ({ showReviewModal, setShowReviewModal, reviews }) => {
    const [starFilter, setStarFilter] = useState(0); // 0 means no filter

    const filteredReviews = starFilter === 0
        ? reviews
        : reviews.filter(review => review.rating === starFilter);

    return (
        showReviewModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Tất cả đánh giá cho phòng này</h3>
                    <div className="mb-4">
                        <label className="mr-2 font-semibold">Lọc theo số sao:</label>
                        <select
                            value={starFilter}
                            onChange={(e) => setStarFilter(Number(e.target.value))}
                            className="p-2 border rounded-lg"
                        >
                            <option value={0}>Tất cả</option>
                            {[1, 2, 3, 4, 5].map(star => (
                                <option key={star} value={star}>{star} sao</option>
                            ))}
                        </select>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {filteredReviews && filteredReviews.length > 0 ? (
                            filteredReviews.map((review) => (
                                <div key={review.id} className="p-4 mb-2 border-b border-gray-200">
                                    <div className="flex items-center mb-2">
                                        <img
                                            src={review.user.avatar || avtDefault}
                                            alt="avatar"
                                            className="w-8 h-8 rounded-full object-cover mr-2 border"
                                        />
                                        <p className="font-bold text-gray-800 mr-2">{review.user.name}</p>
                                        <div className="flex">
                                            {[...Array(review.rating)].map((_, i) => (
                                                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600">{review.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">Không có đánh giá nào {starFilter > 0 ? `với ${starFilter} sao` : ''}.</p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowReviewModal(false)}
                        className="mt-4 w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        )
    );
};

const RoomInfo = ({ room, displayPrice }) => {
    const [randomReview, setRandomReview] = useState(null);
    const [allReviews, setAllReviews] = useState([]);
    const [showReviewModal, setShowReviewModal] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axiosInstance.get(`/review/room/${room.id}`);
                if (response.ec === 0 && response.reviewList?.length > 0) {
                    const reviews = response.reviewList;
                    setAllReviews(reviews);
                    // Select a random review
                    const randomIndex = Math.floor(Math.random() * reviews.length);
                    setRandomReview(reviews[randomIndex]);
                } else {
                    setAllReviews([]);
                    setRandomReview(null);
                }
            } catch (error) {
                console.error("Lỗi khi lấy đánh giá:", error);
                toast.error("Không thể tải đánh giá.");
            }
        };

        if (room.id) {
            fetchReviews();
        }
    }, [room.id]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <img
                src={room.image}
                alt={room.name}
                className="rounded-lg w-full h-96 object-cover"
            />
            <h3 className="text-2xl font-bold text-gray-800 mt-4">{room.name}</h3>
            <p className="text-gray-600 mt-2">{room.description}</p>
            <p className="text-yellow-600 font-bold text-lg mt-2">{displayPrice}</p>
            {randomReview && (
                <div
                    className="mt-4 p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => setShowReviewModal(true)}
                >
                    <div className="flex items-center mb-2">
                        <img
                            src={randomReview.user.avatar || avtDefault}
                            alt="avatar"
                            className="w-8 h-8 rounded-full object-cover mr-2 border"
                        />
                        <p className="font-bold text-gray-800 mr-2">{randomReview.user.name}</p>
                        <div className="flex">
                            {[...Array(randomReview.rating)].map((_, i) => (
                                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                    </div>
                    <p className="text-gray-600">{randomReview.comment}</p>
                    <p className="text-sm text-blue-600 mt-2">Nhấn để xem tất cả đánh giá</p>
                </div>
            )}
            <ReviewModal
                showReviewModal={showReviewModal}
                setShowReviewModal={setShowReviewModal}
                reviews={allReviews}
                roomId={room.id}
            />
            <ToastContainer />
        </div>
    );
};

export default RoomInfo;