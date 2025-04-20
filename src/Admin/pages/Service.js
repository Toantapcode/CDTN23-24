import React, { useState, useEffect } from "react";
import { Table, Button, Space, Pagination, Input, Modal, Form, message, Popconfirm } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axiosInstance from '../../request';
import { toast, ToastContainer } from 'react-toastify';

const ServicePage = () => {
    const [allServices, setAllServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [selectedService, setSelectedService] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [form] = Form.useForm();

    const columns = [
        { title: 'Mã dịch vụ', dataIndex: 'id', key: 'id' },
        { title: 'Tên dịch vụ', dataIndex: 'name', key: 'name' },
        { title: 'Giá', dataIndex: 'price', key: 'price' },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="dashed" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
                    <Popconfirm
                        title="Bạn có chắc muốn xóa dịch vụ này?"
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
        fetchServices();
    }, []);

    useEffect(() => {
        filterServices();
    }, [searchTerm, allServices]);

    const fetchServices = async (page = 1, size = 10) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/service/all?page=${page}&size=${size}`);
            if (response && response.serviceList) {
                setAllServices(response.serviceList);
                setTotalItems(response.total || response.serviceList.length);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            toast.error('Lỗi khi tải danh sách dịch vụ!');
        } finally {
            setLoading(false);
        }
    };

    const filterServices = () => {
        let filtered = allServices;

        if (searchTerm) {
            filtered = filtered.filter(service =>
                service.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredServices(filtered);
        setTotalItems(filtered.length);
    };

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        fetchServices(page, pageSize);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const showModal = (title, service = null) => {
        setModalTitle(title);
        setSelectedService(service);
        setIsModalVisible(true);
        if (service) {
            form.setFieldsValue({
                name: service.name,
                price: service.price,
            });
        } else {
            form.resetFields();
        }
    };

    const handleAdd = () => {
        showModal('Thêm dịch vụ');
    };

    const handleEdit = (service) => {
        showModal('Sửa dịch vụ', service);
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/service/delete/${id}`);
            toast.success('Xóa dịch vụ thành công');
            fetchServices();
        } catch (error) {
            console.error('Error deleting service:', error);
            toast.error('Lỗi khi xóa dịch vụ!');
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const payload = {
                name: values.name,
                price: Number(values.price),
            };

            if (selectedService) {
                await axiosInstance.put(`/service/update/${selectedService.id}`, payload);
                toast.success('Cập nhật dịch vụ thành công!');
            } else {
                await axiosInstance.post('/service/add', payload);
                toast.success('Thêm dịch vụ thành công!');
            }

            setIsModalVisible(false);
            fetchServices();
        } catch (error) {
            console.error('Lỗi khi lưu dịch vụ:', error);
            toast.error('Lỗi khi lưu dịch vụ, vui lòng kiểm tra lại thông tin.');
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleDeleteMany = async () => {
        if (selectedRowKeys.length === 0) {
            toast.warning("Vui lòng chọn ít nhất một dịch vụ!");
            return;
        }

        try {
            await axiosInstance.delete('/service/deleteMany', { data: selectedRowKeys });
            toast.success("Xóa thành công!");
            setSelectedRowKeys([]);
            fetchServices();
        } catch (error) {
            console.error('Error deleting multiple services:', error);
            toast.error('Lỗi khi xóa nhiều dịch vụ!');
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
            <h2 className="text-lg font-semibold mb-4">Quản lý dịch vụ</h2>
            <Popconfirm
                title="Bạn có chắc chắn muốn xóa các dịch vụ đã chọn?"
                description={`Sẽ xóa ${selectedRowKeys.length} dịch vụ. Hành động này không thể hoàn tác!`}
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
                <Input.Search placeholder="Tìm kiếm theo tên" onSearch={handleSearch} style={{ width: 200 }} />
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm dịch vụ</Button>
            </div>
            <Table
                dataSource={filteredServices}
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
                    <Form.Item
                        label="Tên dịch vụ"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Giá"
                        name="price"
                        rules={[{ required: true, message: 'Vui lòng nhập giá dịch vụ!' }]}
                    >
                        <Input type="number" min={0} step={0.01} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ServicePage;