import React, { useState, useEffect } from "react";
import { Table, Button, Space, Tag, Pagination, Select, Input, Modal, Form, message } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axiosInstance from '../../request';
import { toast, ToastContainer } from 'react-toastify';

const Usermanagement = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(9);
    const [totalItems, setTotalItems] = useState(0);
    const [filterRole, setFilterRole] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [form] = Form.useForm();

    const columns = [
        { title: 'Mã người dùng', dataIndex: 'id', key: 'id' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Họ và tên', dataIndex: 'name', key: 'name' },
        { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (role) => {
                let color = role === 'ADMIN' ? 'blue' : 'orange';
                return <Tag color={color}>{role}</Tag>;
            }
        },
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
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [filterRole, searchTerm, allUsers]);

    const fetchUsers = async (page = 1, size = 10) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/user/all?page=${page}&size=${size}`);
            if (response && response.userList) {
                setAllUsers(response.userList);
                setTotalItems(response.total);
            }
        } catch (error) {
            toast.error('Lỗi khi lấy danh sách người dùng!');
        } finally {
            setLoading(false);
        }
    };


    const filterUsers = () => {
        let filtered = allUsers;

        if (filterRole === 'ADMIN') {
            filtered = allUsers.filter(user => user.role === 'ADMIN');
        } else if (filterRole === 'USER') {
            filtered = allUsers.filter(user => user.role === 'USER');
        }

        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredUsers(filtered);
        setTotalItems(filtered.length);
    };

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        fetchUsers(page, pageSize);
    };


    const handleFilterRole = (role) => {
        setFilterRole(role);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const showModal = (title, user = null) => {
        setModalTitle(title);
        setSelectedUser(user);
        setIsModalVisible(true);
        if (user) {
            form.setFieldsValue(user);
        } else {
            form.resetFields();
        }
    };

    const handleAdd = () => {
        showModal('Thêm người dùng');
    };

    const handleView = (user) => {
        showModal('Xem người dùng', user);
    };

    const handleEdit = (user) => {
        showModal('Sửa người dùng', user);
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/user/delete/${id}`);
            toast.success('Xóa người dùng thành công!');
            fetchUsers();
        } catch (error) {
            toast.error('Lỗi khi xóa người dùng!');
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (selectedUser) {
                await axiosInstance.put(`/user/updateInfo/${selectedUser.id}`, values);
                toast.success('Cập nhật người dùng thành công!')
            } else {
                await axiosInstance.post('auth/register', values);
                toast.success('Thêm người dùng thành công!')
            }
            fetchUsers();
            setIsModalVisible(false);
        } catch (error) {
            toast.error('Lỗi khi cập nhật người dùng:', error);
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
            await axiosInstance.delete('user/deleteMany', { data: selectedRowKeys });
            toast.success("Xóa thành công!");
            setSelectedRowKeys([]);
            fetchUsers();
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
            <h2 className="text-lg font-semibold mb-4">Quản lý người dùng</h2>
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
                    <Select defaultValue="all" style={{ width: 120, marginRight: 8 }} onChange={handleFilterRole}>
                        <Select.Option value="all">Tất cả</Select.Option>
                        <Select.Option value="ADMIN">Quản lý</Select.Option>
                        <Select.Option value="USER">Người dùng</Select.Option>
                    </Select>
                    <Input.Search placeholder="Tìm kiếm" onSearch={handleSearch} style={{ width: 200 }} />
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm người dùng</Button>
            </div>
            <Table
                dataSource={filteredUsers}
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
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Họ và tên" name="name" rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}>
                        <Input className="max-w-[300px]" readOnly={modalTitle === 'Xem người dùng'} />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
                        <Input className="max-w-[300px]" readOnly={modalTitle === 'Xem người dùng'} />
                    </Form.Item>
                    <Form.Item label="Số điện thoại" name="phone">
                        <Input className="max-w-[300px]" readOnly={modalTitle === 'Xem người dùng'} />
                    </Form.Item>
                    <Form.Item label="Mật khẩu" name="password">
                        <Input className="max-w-[300px]" readOnly={modalTitle === 'Xem người dùng'} />
                    </Form.Item>
                    <Form.Item label="Vai trò" name="role" rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}>
                        <Select disabled={modalTitle === 'Xem người dùng'}>
                            <Select.Option value="ADMIN">Quản lý</Select.Option>
                            <Select.Option value="USER">Người dùng</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Usermanagement;