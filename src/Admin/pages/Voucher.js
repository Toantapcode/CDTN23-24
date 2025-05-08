import React, { useState, useEffect } from "react";
import { Table, Button, Space, Popconfirm, Select, Input, Modal, Form, DatePicker } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axiosInstance from '../../request';
import { toast, ToastContainer } from 'react-toastify';
import dayjs from 'dayjs';

const Voucher = () => {
    const [allVouchers, setAllVouchers] = useState([]);
    const [filteredVouchers, setFilteredVouchers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(9);
    const [totalItems, setTotalItems] = useState(0);
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm,setSearchTerm] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [form] = Form.useForm();

    const columns = [
        { title: 'Mã Voucher', dataIndex: 'id', key: 'id' },
        { title: 'Mã giảm giá', dataIndex: 'code', key: 'code' },
        { title: 'Giá trị', dataIndex: 'percent', key: 'percent', render: (percent) => `${percent}%` },
        { title: 'Ngày hết hạn', dataIndex: 'expirationTime', key: 'expirationTime' },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa voucher này?"
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
        fetchVouchers();
    }, []);

    useEffect(() => {
        filterVouchers();
    }, [filterStatus, searchTerm, allVouchers]);

    const fetchVouchers = async (page = 1, size = 10) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/voucher/all?page=${page}&size=${size}`);
            if (response && response.voucherList) {
                setAllVouchers(response.voucherList);
                setTotalItems(response.total);
            }
        } catch (error) {
            toast.error('Lỗi khi lấy danh sách voucher!');
        } finally {
            setLoading(false);
        }
    };

    const filterVouchers = () => {
        let filtered = allVouchers;

        if (filterStatus === 'ACTIVE') {
            filtered = allVouchers.filter(voucher => voucher.status === 'ACTIVE');
        } else if (filterStatus === 'INACTIVE') {
            filtered = allVouchers.filter(voucher => voucher.status === 'INACTIVE');
        }

        if (searchTerm) {
            filtered = filtered.filter(voucher =>
                voucher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                voucher.code?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredVouchers(filtered);
        setTotalItems(filtered.length);
    };

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        fetchVouchers(page, pageSize);
    };

    const handleFilterStatus = (status) => {
        setFilterStatus(status);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const showModal = (title, voucher = null) => {
        setModalTitle(title);
        setSelectedVoucher(voucher);
        setIsModalVisible(true);
        if (voucher) {
            form.setFieldsValue({
                ...voucher,
                expirationTime: voucher.expirationTime ? dayjs(voucher.expirationTime) : null,
            });
        } else {
            form.resetFields();
        }
    };

    const handleAdd = () => {
        showModal('Thêm Voucher');
    };

    const handleView = (voucher) => {
        showModal('Xem Voucher', voucher);
    };

    const handleEdit = (voucher) => {
        showModal('Sửa Voucher', voucher);
    };

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/voucher/delete/${id}`);
            toast.success('Xóa voucher thành công!');
            fetchVouchers();
        } catch (error) {
            toast.error('Lỗi khi xóa voucher!');
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const formattedValues = {
                ...values,
                expirationTime: values.expirationTime ? dayjs(values.expirationTime).format('YYYY-MM-DDTHH:mm:ss') : null,
            };
            if (selectedVoucher) {
                await axiosInstance.put(`/voucher/update/${selectedVoucher.id}`, formattedValues);
                toast.success('Cập nhật voucher thành công!');
            } else {
                await axiosInstance.post('/voucher/create', formattedValues);
                toast.success('Thêm voucher thành công!');
            }
            fetchVouchers();
            setIsModalVisible(false);
        } catch (error) {
            toast.error('Lỗi khi cập nhật/thêm voucher!');
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleDeleteMany = async () => {
        if (selectedRowKeys.length === 0) {
            toast.warning("Vui lòng chọn ít nhất một voucher!");
            return;
        }

        try {
            await axiosInstance.delete('/voucher/deleteMany', { data: selectedRowKeys });
            toast.success("Xóa nhiều voucher thành công!");
            setSelectedRowKeys([]);
            fetchVouchers();
        } catch (error) {
            toast.error('Lỗi khi xóa nhiều voucher!');
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
            <h2 className="text-lg font-semibold mb-4">Quản lý Voucher</h2>
            <Popconfirm
                title="Bạn có chắc chắn muốn xóa các voucher đã chọn?"
                description={`Sẽ xóa ${selectedRowKeys.length} voucher. Hành động này không thể hoàn tác!`}
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
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm Voucher</Button>
            </div>
            <Table
                dataSource={filteredVouchers}
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
                    <Form.Item 
                        label="Mã giảm giá" 
                        name="code" 
                        rules={[{ required: true, message: 'Vui lòng nhập mã giảm giá!' }]}
                    >
                        <Input className="max-w-[300px]" readOnly={modalTitle === 'Xem Voucher'} />
                    </Form.Item>
                    <Form.Item 
                        label="Giá trị (%)" 
                        name="percent" 
                        rules={[{ required: true, message: 'Vui lòng nhập giá trị!' }]}
                    >
                        <Input type="number" className="max-w-[300px]" readOnly={modalTitle === 'Xem Voucher'} />
                    </Form.Item>
                    <Form.Item 
                        label="Ngày hết hạn" 
                        name="expirationTime" 
                        rules={[
                            { required: true, message: 'Vui lòng chọn ngày hết hạn!' },
                            {
                                validator: (_, value) => {
                                    if (!value || dayjs(value).isValid()) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Ngày không hợp lệ!'));
                                },
                            },
                        ]}
                    >
                        <DatePicker 
                            showTime 
                            format="YYYY-MM-DD HH:mm:ss" 
                            className="max-w-[300px]" 
                            disabled={modalTitle === 'Xem Voucher'} 
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Voucher;