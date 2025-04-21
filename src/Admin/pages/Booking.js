import React, { useState, useEffect } from "react";
import { Table, Button, Space, Pagination, Input, Modal, Form, message, Popconfirm } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axiosInstance from '../../request';
import { toast, ToastContainer } from 'react-toastify';

const BookingPage = () => {
    const [allBookings, setAllBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalItems, setTotalItems] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [form] = Form.useForm();

    const columns = [
        { title: 'Mã đặt phòng', dataIndex: 'id', key: 'id' },
        {
            title: 'Ngày nhận phòng',
            dataIndex: 'checkInDate',
            key: 'checkInDate',
            render: (text) => new Date(text).toLocaleDateString()
        },
        {
            title: 'Ngày trả phòng',
            dataIndex: 'checkOutDate',
            key: 'checkOutDate',
            render: (text) => new Date(text).toLocaleDateString()
        },
        { title: 'Số người lớn', dataIndex: 'numOfAdults', key: 'numOfAdults' },
        { title: 'Số trẻ em', dataIndex: 'numOfChild', key: 'numOfChild' },
        { title: 'Mã code đặt phòng', dataIndex: 'bookingCode', key: 'bookingCode' },
        {
            title: 'Số tiền thanh toán',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (text) => `${(text * 1000).toLocaleString()} VND`
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" icon={<EyeOutlined />} onClick={() => handleView(record)}>Xem</Button>
                    <Button type="dashed" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa đặt phòng này?"
                        description="Hành động này không thể hoàn tác!"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            type="danger"
                            className="text-red-500 border border-red-500 hover:bg-red-500 hover:text-white"
                            icon={<DeleteOutlined />}
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        fetchBookings();
    }, []);

    useEffect(() => {
        filterBookings();
    }, [searchTerm, allBookings]);

    const fetchBookings = async (page = 1, size = 10) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/booking/all?page=${page}&size=${size}`);
            if (response && response.bookingList) {
                setAllBookings(response.bookingList);
                setTotalItems(response.total);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            message.error('Lỗi khi tải danh sách đặt phòng');
        } finally {
            setLoading(false);
        }
    };

    const filterBookings = () => {
        let filtered = allBookings;

        if (searchTerm) {
            filtered = filtered.filter(booking =>
                booking.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.id.toString().includes(searchTerm)
            );
        }

        setFilteredBookings(filtered);
        setTotalItems(filtered.length);
    };

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        fetchBookings(page, pageSize);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const fetchBookingDetails = async (bookingCode) => {
        try {
            const response = await axiosInstance.get(`/booking/getByCode/${bookingCode}`);
            console.log('code', response.booking.user.name);
            console.log('code', response.booking);
            return response.booking;
        } catch (error) {
            console.error('Error fetching booking details:', error);
            message.error('Lỗi khi tải chi tiết đặt phòng');
            return null;
        }
    };

    const showModal = async (title, booking = null) => {
        setModalTitle(title);
        setSelectedBooking(booking);
        setIsModalVisible(true);

        if (title === 'Xem đặt phòng' && booking) {
            const detailedBooking = await fetchBookingDetails(booking.bookingCode);
            if (detailedBooking) {
                form.setFieldsValue({
                    checkInDate: detailedBooking.checkInDate.split('T')[0],
                    checkOutDate: detailedBooking.checkOutDate.split('T')[0],
                    numOfAdults: detailedBooking.numOfAdults,
                    numOfChild: detailedBooking.numOfChild,
                    bookingCode: detailedBooking.bookingCode,
                    totalAmount: detailedBooking.totalAmount * 1000,
                    userName: detailedBooking.user.name,
                    roomName: detailedBooking.room.name,
                });
            }
        } else if (booking) {
            form.setFieldsValue({
                ...booking,
                checkInDate: booking.checkInDate.split('T')[0],
                checkOutDate: booking.checkOutDate.split('T')[0],
                totalAmount: booking.totalAmount * 1000
            });
        } else {
            form.resetFields();
        }
    };

    const handleView = (booking) => {
        showModal('Xem đặt phòng', booking);
    };

    const handleEdit = (booking) => {
        showModal('Sửa đặt phòng', booking);
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/booking/cancel/${id}`);
            toast.success('Xóa đặt phòng thành công!');
            fetchBookings();
        } catch (error) {
            console.error('Error deleting booking:', error);
            toast.error('Lỗi khi xóa đặt phòng!');
        }
    };

    const handleOk = async () => {
        if (modalTitle === 'Xem đặt phòng') {
            setIsModalVisible(false);
            return;
        }

        try {
            const values = await form.validateFields();
            const updateValues = {
                ...values,
                newRoomId: Number(values.newRoomId),
            }
            await axiosInstance.put(`/booking/update/${selectedBooking.bookingCode}`, updateValues);
            console.log('gui di: ', selectedBooking.bookingcode);
            toast.success('Cập nhật đặt phòng thành công!');

            setIsModalVisible(false);
            fetchBookings();
        } catch (error) {
            console.error('Error updating booking:', error);
            toast.error('Lỗi khi cập nhật đặt phòng, vui lòng thử lại.');
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleDeleteMany = async () => {
        if (selectedRowKeys.length === 0) {
            toast.warning("Vui lòng chọn ít nhất một đặt phòng!");
            return;
        }

        try {
            await axiosInstance.delete('/booking/cancelMany', { data: selectedRowKeys });
            toast.success("Xóa nhiều đặt phòng thành công!");
            setSelectedRowKeys([]);
            fetchBookings();
        } catch (error) {
            toast.error('Lỗi khi xóa nhiều đặt phòng!');
            console.error(error);
        }
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
            <h2 className="text-lg font-semibold mb-4">Quản lý đặt phòng</h2>
            <Popconfirm
                title="Bạn có chắc chắn muốn xóa các đặt phòng đã chọn?"
                description={`Sẽ xóa ${selectedRowKeys.length} đặt phòng. Hành động này không thể hoàn tác!`}
                onConfirm={handleDeleteMany}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
                disabled={selectedRowKeys.length === 0}
            >
                <Button
                    type="danger"
                    icon={<DeleteOutlined />}
                    disabled={selectedRowKeys.length === 0}
                    className="text-red-500 border border-red-500 hover:bg-red-500 hover:text-white mb-4"
                >
                    Xóa đã chọn ({selectedRowKeys.length})
                </Button>
            </Popconfirm>
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <Input.Search
                        placeholder="Tìm theo mã đặt phòng hoặc ID"
                        onSearch={handleSearch}
                        style={{ width: 250 }}
                    />
                </div>
                {/* <Button type="primary" icon={<PlusOutlined />}>Thêm đặt phòng</Button> */}
            </div>
            <Table
                dataSource={filteredBookings}
                columns={columns}
                loading={loading}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalItems,
                    onChange: handlePageChange,
                    position: ['bottomCenter'],
                }}
                rowSelection={{
                    selectedRowKeys,
                    onChange: setSelectedRowKeys,
                }}
                rowKey="id"
            />
            <Modal
                title={modalTitle}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={modalTitle === 'Xem đặt phòng' ? 'Đóng' : 'Lưu'}
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Ngày nhận phòng"
                        name="checkInDate"
                        rules={[{ required: true, message: 'Vui lòng nhập ngày nhận phòng!' }]}
                    >
                        <Input type="date" disabled={modalTitle === 'Xem đặt phòng'} />
                    </Form.Item>
                    <Form.Item
                        label="Ngày trả phòng"
                        name="checkOutDate"
                        rules={[{ required: true, message: 'Vui lòng nhập ngày trả phòng!' }]}
                    >
                        <Input type="date" disabled={modalTitle === 'Xem đặt phòng'} />
                    </Form.Item>
                    <Form.Item
                        label="Số người lớn"
                        name="numOfAdults"
                        rules={[{ required: true, message: 'Vui lòng nhập số người lớn!' }]}
                    >
                        <Input type="number" disabled={modalTitle === 'Xem đặt phòng'} />
                    </Form.Item>
                    <Form.Item
                        label="Số trẻ em"
                        name="numOfChild"
                        rules={[{ required: true, message: 'Vui lòng nhập số trẻ em!' }]}
                    >
                        <Input type="number" disabled={modalTitle === 'Xem đặt phòng'} />
                    </Form.Item>
                    {modalTitle === 'Sửa đặt phòng' && (
                        <>

                            <Form.Item label="Phòng" name="newRoomId">
                                <Input />
                            </Form.Item>
                        </>
                    )}


                    {modalTitle === 'Xem đặt phòng' && (
                        <>
                            <Form.Item label="Tên khách hàng" name="userName">
                                <Input readOnly />
                            </Form.Item>
                            <Form.Item
                                label="Mã code đặt phòng"
                                name="bookingCode"
                            >
                                <Input readOnly />
                            </Form.Item>
                            <Form.Item label="Phòng" name="roomName">
                                <Input readOnly />
                            </Form.Item>
                            <Form.Item
                                label="Số tiền thanh toán"
                                name="totalAmount"
                                rules={[{ required: true, message: '!' }]}
                            >
                                <Input />
                            </Form.Item>
                        </>
                    )}
                </Form>
            </Modal>
        </div>
    );
};

export default BookingPage;