import React, { useState, useEffect } from "react";
import { Table, Button, Space, Tag, Select, Input, Modal, Form, Popconfirm } from "antd";
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
    const [filterRoles, setFilterRoles] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [form] = Form.useForm();

    const columns = [
        { title: 'Mã tài khoản', dataIndex: 'id', key: 'id' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Họ và tên', dataIndex: 'name', key: 'name' },
        { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
        {
            title: 'Vai trò',
            dataIndex: 'roles',
            key: 'roles',
            render: (roles) => {
                let color = roles === 'ADMIN' ? 'blue' : 'orange';
                return <Tag color={color}>{roles}</Tag>;
            }
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" icon={<EyeOutlined />} onClick={() => handleView(record)}>Xem</Button>
                    <Button type="dashed" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa tài khoản này?"
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
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [filterRoles, searchTerm, allUsers]);

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

        if (filterRoles === 'ADMIN') {
            filtered = allUsers.filter(user => user.roles === 'ADMIN');
        } else if (filterRoles === 'USER') {
            filtered = allUsers.filter(user => user.roles === 'USER');
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


    const handleFilterRoles = (roles) => {
        setFilterRoles(roles);
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
        showModal('Thêm tài khoản');
    };

    const handleView = (user) => {
        showModal('Xem tài khoản', user);
    };

    const handleEdit = (user) => {
        showModal('Sửa tài khoản', user);
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/user/delete/${id}`);
            toast.success('Xóa tài khoản thành công!');
            fetchUsers();
        } catch (error) {
            console.error('Lỗi khi xóa tài khoản!');
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (selectedUser) {
                await axiosInstance.put(`/user/updateInfo/${selectedUser.id}`, values);
                toast.success('Cập nhật tài khoản thành công!')
            } else {
                await axiosInstance.post('auth/register', values);
                toast.success('Thêm tài khoản thành công!')
            }
            fetchUsers();
            setIsModalVisible(false);
        } catch (error) {
            toast.error('Lỗi khi cập nhật tài khoản:', error);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleDeleteMany = async () => {
        if (selectedRowKeys.length === 0) {
            toast.warning("Vui lòng chọn ít nhất một tài khoản!");
            return;
        }

        try {
            await axiosInstance.delete('user/deleteMany', { data: selectedRowKeys });
            toast.success("Xóa thành công!");
            setSelectedRowKeys([]);
            fetchUsers();
        } catch (error) {
            toast.error('Lỗi khi xóa nhiều tài khoản!');
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
            <h2 className="text-lg font-semibold mb-4">Quản lý tài khoản</h2>
            <Popconfirm
                title="Bạn có chắc chắn muốn xóa các tài khoảnkhoản đã chọn?"
                description={`Sẽ xóa ${selectedRowKeys.length} tài khoản. Hành động này không thể hoàn tác!`}
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
                    <Select defaultValue="all" style={{ width: 120, marginRight: 8 }} onChange={handleFilterRoles}>
                        <Select.Option value="all">Tất cả</Select.Option>
                        <Select.Option value="ADMIN">Quản lý</Select.Option>
                        <Select.Option value="USER">Người dùng</Select.Option>
                    </Select>
                    <Input.Search placeholder="Tìm kiếm" onSearch={handleSearch} style={{ width: 200 }} />
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm tài khoản</Button>
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
                        <Input className="max-w-[300px]" readOnly={modalTitle === 'Xem tài khoản'} />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
                        <Input className="max-w-[300px]" readOnly={modalTitle === 'Xem tài khoản'} />
                    </Form.Item>
                    <Form.Item label="Số điện thoại" name="phone">
                        <Input className="max-w-[300px]" readOnly={modalTitle === 'Xem tài khoản'} />
                    </Form.Item>
                    <Form.Item label="Mật khẩu" name="password">
                        <Input className="max-w-[300px]" readOnly={modalTitle === 'Xem tài khoản'} />
                    </Form.Item>
                    <Form.Item label="Vai trò" name="roles" rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}>
                        <Select disabled={modalTitle === 'Xem tài khoản'}>
                            <Select.Option value={1}>Quản lý</Select.Option>
                            <Select.Option value={0}>Người dùng</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Usermanagement;