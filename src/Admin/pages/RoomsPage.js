import React, { useState, useEffect } from "react";
import { Table, Button, Space, Tag, Pagination, Select, Input, Modal, Form, Upload, message } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import axiosInstance from '../../request';
import { toast, ToastContainer } from 'react-toastify';

const RoomsPage = () => {
    const [allRooms, setAllRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalItems, setTotalItems] = useState(0);
    const [filterType, setFilterType] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [form] = Form.useForm();

    const typeColors = {
        'FAMILY': 'blue',
        'COUPLE': 'green',
        'Suite': 'volcano',
        'VIP': 'purple',
    };

    const columns = [
        { title: 'Số phòng', dataIndex: 'id', key: 'id' },
        { title: 'Tên phòng', dataIndex: 'name', key: 'name' },
        {
            title: 'Kiểu phòng',
            dataIndex: 'type',
            key: 'type',
            render: (text) => <Tag color={typeColors[text] || 'default'}>{text}</Tag>,
        },
        { title: 'Giá', dataIndex: 'price', key: 'price' },
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (text, record) => (
                <img src={record.image} alt="Room" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
            ),
        },
        { title: 'Mô tả', dataIndex: 'description', key: 'description' },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" icon={<EyeOutlined />} onClick={() => handleView(record)}>Xem</Button>
                    <Button type="dashed" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                    <Button
                        type="danger"
                        className="text-red-500 border border-red-500 hover:bg-red-500 hover:text-white"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}>Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        fetchRooms();
    }, []);

    useEffect(() => {
        filterRooms();
    }, [filterType, searchTerm, allRooms]);

    const fetchRooms = async (page = 1, size = 10) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/room/all?page=${page}&size=${size}`);
            if (response && response.roomList) {
                setAllRooms(response.roomList);
                setTotalItems(response.total);
            }
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterRooms = () => {
        let filtered = allRooms;

        if (filterType !== 'all') {
            filtered = filtered.filter(room => room.type === filterType);
        }

        if (searchTerm) {
            filtered = filtered.filter(room =>
                room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                room.type.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredRooms(filtered);
        setTotalItems(filtered.length);
    };

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        fetchRooms(page, pageSize);
    };

    const handleFilterType = (type) => {
        setFilterType(type);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const handleImageUpload = async ({ file }) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axiosInstance.post("/image/upload/Room", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setImageUrl(response);
            toast.success("Tải ảnh lên thành công!");
        } catch (error) {
            toast.error("Tải ảnh lên thất bại. Vui lòng thử lại.");
            toast.error("Upload error:", error);
        }
    };


    const showModal = (title, room = null) => {
        setModalTitle(title);
        setSelectedRoom(room);
        setIsModalVisible(true);
        if (room) {
            form.setFieldsValue(room);
            setImageUrl(room.image);
        } else {
            form.resetFields();
            setImageUrl('');
        }
    };

    const handleAdd = () => {
        showModal('Thêm phòng');
    };

    const handleView = (room) => {
        showModal('Xem phòng', room);
    };

    const handleEdit = (room) => {
        showModal('Sửa phòng', room);
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/room/delete/${id}`);
            fetchRooms();
        } catch (error) {
            console.error('Error deleting room:', error);
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                ...values,
                image: imageUrl,
                price: Number(values.price),
            };
            await axiosInstance.post('/room/add', payload);
            message.success('Thêm phòng thành công!');

            setIsModalVisible(false);
            fetchRooms();
        } catch (error) {
            console.error('Error adding room:', error);
            message.error('Lỗi khi thêm phòng, vui lòng thử lại.');
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleDeleteMany = async () => {
        if (selectedRowKeys.length === 0) {
            toast.warning("Vui lòng chọn ít nhất một người dùng!");
            return;
        }

        try {
            await axiosInstance.delete('room/deleteMany', { data: selectedRowKeys });
            toast.success("Xóa thành công!");
            setSelectedRowKeys([]);
            fetchRooms();
        } catch (error) {
            toast.error('Lỗi khi xóa nhiều người dùng!');
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
            <h2 className="text-lg font-semibold mb-4">Quản lý phòng</h2>
            <Button
                type="danger"
                icon={<DeleteOutlined />}
                onClick={handleDeleteMany}
                disabled={selectedRowKeys.length === 0}
                className="text-red-500 border border-red-500 hover:bg-red-500 hover:text-white mb-4"
            >
                Xóa đã chọn ({selectedRowKeys.length})
            </Button>
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <Select defaultValue="all" style={{ width: 150, marginRight: 8 }} onChange={handleFilterType}>
                        <Select.Option value="all">Tất cả kiểu phòng</Select.Option>
                        {[...new Set(allRooms.map(room => room.type))].map(type => (
                            <Select.Option key={type} value={type}>{type}</Select.Option>
                        ))}
                    </Select>
                    <Input.Search placeholder="Tìm kiếm" onSearch={handleSearch} style={{ width: 200 }} />
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm phòng</Button>
            </div>
            <Table
                dataSource={filteredRooms}
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
            <Modal title={modalTitle} open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} layout="vertical">
                    <Form.Item label="Tên phòng" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên phòng!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Kiểu phòng" name="type" rules={[{ required: true, message: 'Vui lòng chọn kiểu phòng!' }]}>
                        <Select>
                            <Select.Option value="FAMILY">Gia đình</Select.Option>
                            <Select.Option value="COUPLE">Đôi</Select.Option>
                            <Select.Option value="VIP">VIP</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Giá" name="price">
                        <Input type="number" />
                    </Form.Item>
                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item label="Ảnh" >
                        <Upload showUploadList={false} beforeUpload={() => false} onChange={handleImageUpload}>
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>
                        {imageUrl && <img src={imageUrl} alt="Preview" style={{ width: 100, height: 100, marginTop: 10 }} />}
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default RoomsPage;
