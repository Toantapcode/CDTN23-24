import React, { useState, useEffect } from "react";
import { Table, Button, Space, Tag, Select, Input, Modal, Form, Popconfirm, Menu } from "antd";
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
    const [roles, setRoles] = useState([]);
    const [form] = Form.useForm();
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [selectedRoleId, setSelectedRoleId] = useState(null);
    const [isRemoveRoleModalVisible, setIsRemoveRoleModalVisible] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);

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
                if (!roles) return null;
                const renderRole = (role) => {
                    const color = role === 'ADMIN' ? 'blue' : role === 'SUADMIN' ? 'orange' : 'green';
                    return <Tag key={role} color={color}>{role}</Tag>;
                };
                return Array.isArray(roles) ? roles.map(renderRole) : renderRole(roles);
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" icon={<EyeOutlined />} onClick={() => handleView(record)}>Xem</Button>
                    <Button type="dashed" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Phân quyền</Button>
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
        fetchRoles();
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

    const fetchRoles = async () => {
        try {
            const response = await axiosInstance.get('/role/all');
            if (response && response.roleList) {
                setRoles(response.roleList);
            }
        } catch (error) {
            toast.error('Lỗi khi lấy danh sách vai trò!');
        }
    };

    const filterUsers = () => {
        let filtered = allUsers;

        if (filterRoles !== 'all') {
            filtered = allUsers.filter(user =>
                Array.isArray(user.roles) ? user.roles.includes(filterRoles) : user.roles === filterRoles
            );
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
            form.setFieldsValue({
                email: user.email,
                name: user.name,
                phone: user.phone,
                roleId: Array.isArray(user.roles)
                    ? user.roles.map(role => roles.find(r => r.name === role)?.id).filter(id => id)
                    : roles.find(role => role.name === user.roles)?.id,
            });
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
        showModal('Phân quyền tài khoản', user);
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/user/delete/${id}`);
            toast.success('Xóa tài khoản thành công!');
            fetchUsers();
        } catch (error) {
            toast.error('Lỗi khi xóa tài khoản!');
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (selectedUser) {
                // For role assignment, assuming single role assignment per request
                if (values.roleId) {
                    await axiosInstance.post(`/role/assign/${selectedUser.id}/${values.roleId}`);
                    toast.success('Cập nhật vai trò thành công!');
                }
            } else {
                await axiosInstance.post('auth/register', {
                    email: values.email,
                    name: values.name,
                    phone: values.phone,
                    roleId: values.roleId,
                });
                toast.success('Thêm tài khoản thành công!');
            }
            fetchUsers();
            setIsModalVisible(false);
        } catch (error) {
            toast.error('Lỗi khi xử lý tài khoản!');
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

    const handleContextMenu = (roleId, e) => {
        e.preventDefault();
        const roleName = roles.find(role => role.id === roleId)?.name;
        const userRoles = Array.isArray(selectedUser?.roles) ? selectedUser.roles : [selectedUser?.roles];

        // Prevent removing SUADMIN or if only one role exists
        if (roleName === 'SUADMIN' || userRoles.length <= 1) {
            return;
        }

        setSelectedRoleId(roleId);
        setContextMenuPosition({ x: e.clientX, y: e.clientY });
        setContextMenuVisible(true);
    };

    const handleRemoveRole = async () => {
        if (!selectedUser || !selectedRoleId) return;

        try {
            await axiosInstance.delete(`/role/remove/${selectedUser.id}/${selectedRoleId}`);
            toast.success('Gỡ vai trò thành công!');
            fetchUsers();
            setIsRemoveRoleModalVisible(false);
            setContextMenuVisible(false);
        } catch (error) {
            toast.error('Lỗi khi gỡ vai trò!');
        }
    };

    const handleCloseContextMenu = () => {
        setContextMenuVisible(false);
        setSelectedRoleId(null);
    };

    const isViewMode = modalTitle === 'Xem tài khoản';
    const isEditMode = modalTitle === 'Phân quyền tài khoản';

    const contextMenu = (
        <Menu style={{ position: 'absolute', left: contextMenuPosition.x, top: contextMenuPosition.y }}>
            <Menu.Item
                key="remove"
                onClick={() => setIsRemoveRoleModalVisible(true)}
            >
                Gỡ quyền
            </Menu.Item>
        </Menu>
    );

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
                title="Bạn có chắc chắn muốn xóa các tài khoản đã chọn?"
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
                        {roles.map(role => (
                            <Select.Option key={role.id} value={role.name}>
                                {role.name}
                            </Select.Option>
                        ))}
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
                okButtonProps={{ disabled: isViewMode }}
            >
                <Form form={form} layout="vertical">
                    {(modalTitle === 'Thêm tài khoản' || isViewMode) && (
                        <>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[{ required: !isViewMode, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
                            >
                                <Input className="max-w-[300px]" disabled={isViewMode} />
                            </Form.Item>
                            <Form.Item
                                label="Họ và tên"
                                name="name"
                                rules={[{ required: !isViewMode, message: 'Vui lòng nhập họ và tên!' }]}
                            >
                                <Input className="max-w-[300px]" disabled={isViewMode} />
                            </Form.Item>
                            <Form.Item
                                label="Số điện thoại"
                                name="phone"
                                rules={[{ required: !isViewMode, message: 'Vui lòng nhập số điện thoại!' }, { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }]}
                            >
                                <Input className="max-w-[300px]" disabled={isViewMode} />
                            </Form.Item>
                        </>
                    )}
                    <Form.Item
                        label="Phân quyền"
                        name="roleId"
                        rules={[{ required: !isViewMode, message: 'Vui lòng chọn một vai trò!' }]}
                    >
                        <Select
                            className="max-w-[300px]"
                            disabled={isViewMode}
                            placeholder="Chọn vai trò"
                            onDropdownVisibleChange={(visible) => setDropdownVisible(visible)} // Track dropdown visibility
                        >
                            {roles.map(role => {
                                const isAssigned = selectedUser && Array.isArray(selectedUser.roles) && selectedUser.roles.includes(role.name);
                                const isRemovable = isEditMode && isAssigned && role.name !== 'SUADMIN' && selectedUser.roles.length > 1 && dropdownVisible;
                                return (
                                    <Select.Option
                                        key={role.id}
                                        value={role.id}
                                        style={{
                                            backgroundColor: isAssigned ? '#e6f7ff' : 'white',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span>{role.name}</span>
                                            {isRemovable && (
                                                <DeleteOutlined
                                                    style={{ color: 'red', cursor: 'pointer' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedRoleId(role.id);
                                                        setIsRemoveRoleModalVisible(true);
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </Select.Option>

                                );
                            })}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
            {contextMenuVisible && (
                <div onClick={handleCloseContextMenu}>
                    {contextMenu}
                </div>
            )}
            <Modal
                title="Xác nhận gỡ quyền"
                visible={isRemoveRoleModalVisible}
                onOk={handleRemoveRole}
                onCancel={() => setIsRemoveRoleModalVisible(false)}
                okText="Gỡ quyền"
                cancelText="Hủy"
                okButtonProps={{ danger: true }}
            >
                <p>Bạn có chắc chắn muốn gỡ vai trò này khỏi tài khoản?</p>
            </Modal>
        </div>
    );
};

export default Usermanagement;