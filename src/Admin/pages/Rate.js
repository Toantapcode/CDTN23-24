import React, { useState, useEffect } from "react";
import { Table, Select, Input } from "antd";
import axiosInstance from '../../request';
import { toast, ToastContainer } from 'react-toastify';

const Rate = () => {
    const [allReviews, setAllReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(9);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedRoomId, setSelectedRoomId] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const columns = [
        { title: 'Mã đánh giá', dataIndex: 'id', key: 'id' },
        { title: 'Mã phòng', dataIndex: 'roomId', key: 'roomId' },
        { 
            title: 'Người đánh giá', 
            dataIndex: ['user', 'name'], 
            key: 'userName',
            render: (name) => name || 'N/A'
        },
        { title: 'Điểm', dataIndex: 'rating', key: 'rating', render: (rating) => `${rating}/5` },
        { title: 'Nội dung', dataIndex: 'comment', key: 'comment' },
        // { 
        //     title: 'Ngày đánh giá', 
        //     dataIndex: 'createdAt', 
        //     key: 'createdAt',
        //     render: (date) => date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A'
        // },
    ];

    useEffect(() => {
        fetchRooms();
        fetchReviews();
    }, []);

    useEffect(() => {
        if (selectedRoomId !== 'all') {
            fetchReviewsByRoom(selectedRoomId);
        } else {
            fetchReviews();
        }
    }, [selectedRoomId]);

    useEffect(() => {
        filterReviews();
    }, [searchTerm, allReviews]);

    const fetchRooms = async () => {
        try {
            const response = await axiosInstance.get('/room/all');
            if (response && response.roomList) {
                setRooms(response.roomList);
            }
        } catch (error) {
            toast.error('Lỗi khi lấy danh sách phòng!');
        }
    };

    const fetchReviews = async (page = 1, size = 10) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/review/all?page=${page}&size=${size}`);
            if (response && response.reviewList) {
                setAllReviews(response.reviewList);
                setFilteredReviews(response.reviewList);
                setTotalItems(response.total);
            }
        } catch (error) {
            toast.error('Lỗi khi lấy danh sách đánh giá!');
        } finally {
            setLoading(false);
        }
    };

    const fetchReviewsByRoom = async (roomId, page = 1, size = 10) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/review/room/${roomId}?page=${page}&size=${size}`);
            if (response.reviewList) {
                setAllReviews(response.reviewList);
                setFilteredReviews(response.reviewList);
                setTotalItems(response.total);
            }
        } catch (error) {
            toast.error('Lỗi khi lấy đánh giá theo phòng!');
        } finally {
            setLoading(false);
        }
    };

    const filterReviews = () => {
        let filtered = allReviews;

        if (searchTerm) {
            filtered = allReviews.filter(review => {
                const userNameMatch = review.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
                const commentMatch = review.comment?.toLowerCase().includes(searchTerm.toLowerCase());
                return userNameMatch || commentMatch;
            });
        }

        setFilteredReviews(filtered);
        setTotalItems(filtered.length);
    };

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        if (selectedRoomId === 'all') {
            fetchReviews(page, pageSize);
        } else {
            fetchReviewsByRoom(selectedRoomId, page, pageSize);
        }
    };

    const handleFilterRoom = (roomId) => {
        setSelectedRoomId(roomId);
        setCurrentPage(1);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    return (
        <div className="pt-10 pr-10 pl-10">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <h2 className="text-lg font-semibold mb-4">Quản lý Đánh giá</h2>
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <Select 
                        defaultValue="all" 
                        style={{ width: 200, marginRight: 8 }} 
                        onChange={handleFilterRoom}
                    >
                        <Select.Option value="all">Tất cả phòng</Select.Option>
                        {rooms.map(room => (
                            <Select.Option key={room.id} value={room.id}>{room.name}</Select.Option>
                        ))}
                    </Select>
                </div>
            </div>
            <Table
                dataSource={filteredReviews}
                columns={columns}
                loading={loading}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalItems,
                    onChange: handlePageChange,
                    position: ['bottomCenter'],
                }}
                rowKey="id"
            />
        </div>
    );
};

export default Rate;