import React, { useState, useEffect } from "react";
import { Table, Button, Space, Tag, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axiosInstance from '../../request';
import { toast, ToastContainer } from 'react-toastify';
import RoomTypeForm from './RoomTypeForm';

const RoomTypePage = () => {
    const [roomTypes, setRoomTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [selectedRoomType, setSelectedRoomType] = useState(null);

    const typeColors = {
        'FAMILY': 'blue',
        'COUPLE': 'green',
        'VIP': 'purple',
        'khong biet nưa': 'yellow'
    };

    const columns = [
        { title: 'Mã loại phòng', dataIndex: 'id', key: 'id' },
        { title: 'Tên loại phòng', dataIndex: 'name', key: 'name', render: (text) => <Tag color={typeColors[text] || 'default'}>{text}</Tag> },
        { title: 'Số khách tối đa', dataIndex: 'maxGuests', key: 'maxGuests' },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button type="dashed" icon={<EditOutlined />} onClick={() => showModal('Sửa loại phòng', record)}>Sửa</Button>
                    <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }}>
                        <Button danger icon={<DeleteOutlined />}>Xóa</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    useEffect(() => { fetchRoomTypes(); }, []);

    const fetchRoomTypes = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/roomType/all');
            setRoomTypes(response.roomTypeList || []);
        } catch (error) {
            console.error('Lỗi khi tải danh sách:', error.response || error.message);
            toast.error('Lỗi khi tải danh sách!');
            setRoomTypes([]);
        } finally {
            setLoading(false);
        }
    };

    const showModal = (title, roomType = null) => {
        setModalTitle(title);
        setSelectedRoomType(roomType);
        setIsModalVisible(true);
    };

    const handleAdd = () => {
        showModal('Thêm loại phòng');
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/roomType/delete/${id}`);
            toast.success('Xóa thành công!');
            fetchRoomTypes();
        } catch (error) {
            console.error('Lỗi khi xóa:', error.response?.data || error.message);
            toast.error('Lỗi khi xóa!');
        }
    };

    const handleOk = async (form) => {
        try {
            const values = await form.validateFields();
            const url = selectedRoomType ? `/roomType/update/${selectedRoomType.id}` : '/roomType/add';
            const method = selectedRoomType ? 'put' : 'post';
            await axiosInstance[method](url, values);
            toast.success(selectedRoomType ? 'Cập nhật thành công!' : 'Thêm thành công!');
            setIsModalVisible(false);
            fetchRoomTypes();
        } catch (error) {
            toast.error(error.em);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div className="pt-10 pr-10 pl-10">
            <ToastContainer position="top-right" autoClose={3000} />
            <h2 className="text-lg font-semibold mb-4">Quản lý loại phòng</h2>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal('Thêm loại phòng')} className="mb-4 float-right">
                Thêm loại phòng
            </Button>
            <Table dataSource={roomTypes} columns={columns} loading={loading} rowKey="id" pagination={{ pageSize: 10, position: ["bottomCenter"] }} />
            <RoomTypeForm
                visible={isModalVisible}
                title={modalTitle}
                initialValues={selectedRoomType}
                onOk={handleOk}
                onCancel={() => setIsModalVisible(false)}
            />
        </div>
    );
};

export default RoomTypePage;