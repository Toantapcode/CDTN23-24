import React, { useState, useEffect } from "react";
import { Table, Button, Space, Input, Modal, Form, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axiosInstance from '../../request';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RolePage = () => {
    const [allRoles, setAllRoles] = useState([]);
    const [filteredRoles, setFilteredRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [form] = Form.useForm();

    const columns = [
        { title: 'Mã chức danh', dataIndex: 'id', key: 'id' },
        { title: 'Tên chức danh', dataIndex: 'name', key: 'name' },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="dashed" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                    <Popconfirm
                        title="Bạn có chắc muốn xóa chức danh này?"
                        description="Hành động này không thể hoàn tác?"
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
        fetchRoles();
    }, []);

    useEffect(() => {
        filterRoles();
    }, [searchTerm, allRoles]);

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/role/all');
            console.log(response);
            const data = Array.isArray(response.roleList) ? response.roleList : [];
            setAllRoles(data);
            setFilteredRoles(data);
        } catch (error) {
            console.error('Error fetching roles:', error);
            toast.error('Lỗi khi tải danh sách chức danh!');
            setAllRoles([]);
            setFilteredRoles([]);
        } finally {
            setLoading(false);
        }
    };

    const filterRoles = () => {
        const filtered = Array.isArray(allRoles) ? allRoles : [];
        if (searchTerm) {
            filtered = filtered.filter(role =>
                role.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredRoles(filtered);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const showModal = (title, role = null) => {
        setModalTitle(title);
        setSelectedRole(role);
        setIsModalVisible(true);
        if (role) {
            form.setFieldsValue({
                name: role.name,
            });
        } else {
            form.resetFields();
        }
    };

    const handleAdd = () => {
        showModal('Thêm chức danh');
    };

    const handleEdit = (role) => {
        showModal('Sửa chức danh', role);
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/role/delete/${id}`);
            toast.success('Xóa chức danh thành công');
            fetchRoles();
        } catch (error) {
            console.error('Error deleting role:', error);
            toast.error('Lỗi khi xóa chức danh!');
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();

            if (selectedRole) {
                await axiosInstance.put(`/role/${selectedRole.id}`, values);
                toast.success('Cập nhật chức danh thành công!');
            } else {
                await axiosInstance.post('/role/create', values);
                toast.success('Thêm chức danh thành công!');
            }

            setIsModalVisible(false);
            fetchRoles();
        } catch (error) {
            console.error('Lỗi khi lưu chức danh:', error);
            toast.error(error.em);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleDeleteMany = async () => {
        if (selectedRowKeys.length === 0) {
            toast.warning("Vui lòng chọn ít nhất một chức danh!");
            return;
        }

        try {
            await Promise.all(selectedRowKeys.map(id => axiosInstance.delete(`/role/delete/${id}`)));
            toast.success("Xóa thành công!");
            setSelectedRowKeys([]);
            fetchRoles();
        } catch (error) {
            console.error('Error deleting multiple roles:', error);
            toast.error('Lỗi khi xóa nhiều chức danh!');
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
            <h2 className="text-lg font-semibold mb-4">Quản lý chức danh</h2>
            <Popconfirm
                title="Bạn có chắc chắn muốn xóa các chức danh đã chọn?"
                description={`Sẽ xóa ${selectedRowKeys.length} chức danh. Hành động này không thể hoàn tác!`}
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
                {/* <Input.Search placeholder="Tìm kiếm theo tên" onSearch={handleSearch} style={{ width: 200 }} /> */}
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm chức danh</Button>
            </div>
            <Table
                dataSource={Array.isArray(filteredRoles) ? filteredRoles : []}
                columns={columns}
                loading={loading}
                rowSelection={{
                    selectedRowKeys,
                    onChange: setSelectedRowKeys,
                }}
                rowKey="id"
            />
            <Modal title={modalTitle} open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên chức danh"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên chức danh!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default RolePage;