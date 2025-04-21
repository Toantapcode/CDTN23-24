import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table, Select, Typography, Input, Space, Popconfirm } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axiosInstance from '../../request';
import dayjs from 'dayjs';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const { Option } = Select;
const { Title } = Typography;

const BANKS = ['NCB', 'Vietcombank', 'Techcombank', 'MB Bank', 'VPBank'];

const Invoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/invoice/all');
      console.log('response: ', response);
      if (Array.isArray(response.invoiceList)) {
        setInvoices(response.invoiceList);
      } else {
        setInvoices([]);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast.error('Lỗi khi tải danh sách hóa đơn!');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const invoiceResponse = await axiosInstance.get('/invoice/all');
      const usedBookingIds = Array.isArray(invoiceResponse.invoiceList)
        ? invoiceResponse.invoiceList.map((invoice) => invoice.bookingID)
        : [];

      const response = await axiosInstance.get('/booking/all');
      const bookingList = Array.isArray(response.bookingList) ? response.bookingList : [];

      const filteredBookingList = bookingList.filter(
        (booking) => !usedBookingIds.includes(booking.id)
      );

      const enrichedBookings = await Promise.all(
        filteredBookingList.map(async (booking) => {
          try {
            const detailResponse = await axiosInstance.get(`/booking/getByCode/${booking.bookingCode}`);
            console.log('detailResponse: ', detailResponse.booking.user.name);
            return {
              ...booking,
              userName: detailResponse.booking.user.name || 'N/A',
            };
          } catch (error) {
            console.error(`Error fetching details for booking ${booking.bookingCode}:`, error);
            return {
              ...booking,
              userName: 'N/A',
            };
          }
        })
      );

      setBookings(enrichedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Lỗi khi tải danh sách đặt phòng!');
      setBookings([]);
    }
  };

  const handleCreateInvoice = () => {
    setModalMode('create');
    setIsModalVisible(true);
    fetchBookings();
    form.resetFields();
  };

  const handleEditInvoice = (invoice) => {
    setModalMode('edit');
    setSelectedInvoice(invoice);
    setIsModalVisible(true);
    fetchBookings();
    form.setFieldsValue({
      bookingId: invoice.bookingID,
      bank: invoice.bank,
      orderInfo: invoice.orderInfo,
    });
  };

  const handleDeleteInvoice = async (id) => {
    try {
      await axiosInstance.delete(`/invoice/delete/${id}`);
      toast.success('Xóa hóa đơn thành công!');
      fetchInvoices();
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Lỗi khi xóa hóa đơn!');
    }
  };

  const handleModalSubmit = async (values) => {
    try {
      if (modalMode === 'create') {
        const selectedBooking = bookings.find((booking) => booking.id === values.bookingId);
        if (!selectedBooking) throw new Error('Booking not found');

        const detailResponse = await axiosInstance.get(`/booking/getByCode/${selectedBooking.bookingCode}`);
        const totalAmount = detailResponse.booking.totalAmount || 0;

        const invoiceId = Math.floor(10000000 + Math.random() * 90000000).toString();
        const transactionNo = Math.floor(100000 + Math.random() * 900000).toString();

        const payload = {
          id: invoiceId,
          bank: values.bank,
          orderInfo: values.orderInfo,
          price: totalAmount.toString(),
          status: '00',
          transactionNo: transactionNo,
          userName: selectedBooking.userName,
          createdAt: dayjs().format('YYYY-MM-DD'),
          updatedAt: dayjs().format('YYYY-MM-DD'),
        };

        await axiosInstance.post(`/invoice/createInvoice/${values.bookingId}`, payload);
        toast.success('Thêm hóa đơn thành công!');
      } else {
        const selectedBooking = bookings.find((booking) => booking.id === values.bookingId);
        if (!selectedBooking) throw new Error('Booking not found');

        const detailResponse = await axiosInstance.get(`/booking/getByCode/${selectedBooking.bookingCode}`);
        const totalAmount = detailResponse.booking.totalAmount || 0;

        const payload = {
          bookingId: values.bookingId,
          bank: values.bank,
          orderInfo: values.orderInfo,
          price: totalAmount.toString(),
          userName: selectedBooking.userName,
        };

        await axiosInstance.put(`/invoice/update/${selectedInvoice.id}`, payload);
        toast.success('Cập nhật hóa đơn thành công!');
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchInvoices();
    } catch (error) {
      console.error(`Error ${modalMode === 'create' ? 'creating' : 'updating'} invoice:`, error);
      toast.error(`Lỗi khi ${modalMode === 'create' ? 'thêm' : 'cập nhật'} hóa đơn!`);
    }
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setViewModalVisible(true);
  };

  const columns = [
    {
      title: 'Mã hóa đơn',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Mã đặt phòng',
      dataIndex: 'bookingID',
      key: 'bookingID',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Thông tin đơn hàng',
      dataIndex: 'orderInfo',
      key: 'orderInfo',
    },
    {
      title: 'Số giao dịch',
      dataIndex: 'transactionNo',
      key: 'transactionNo',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'price',
      key: 'price',
      render: (amount) => `${(amount * 1000000).toLocaleString()} VNĐ`,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewInvoice(record)}
          >
            Xem
          </Button>
          {/* <Button
            type="dashed"
            icon={<EditOutlined />}
            onClick={() => handleEditInvoice(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa hóa đơn này?"
            description="Hành động này không thể hoàn tác?"
            onConfirm={() => handleDeleteInvoice(record.id)}
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
          </Popconfirm> */}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
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
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <Title level={3}>Quản lý hóa đơn</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateInvoice}>
            Tạo hóa đơn
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={invoices}
          loading={loading}
          rowKey="id"
          pagination={{ position: ['bottomCenter'] }}
        />
      </div>

      <Modal
        title={modalMode === 'create' ? 'Tạo hóa đơn mới' : 'Sửa hóa đơn'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} onFinish={handleModalSubmit} layout="vertical">
          <Form.Item
            label="Chọn đặt phòng"
            name="bookingId"
            rules={[{ required: true, message: 'Vui lòng chọn đặt phòng' }]}
          >
            <Select placeholder="Chọn mã đặt phòng">
              {bookings.map((booking) => (
                <Option key={booking.id} value={booking.id}>
                  {booking.bookingCode} - {booking.userName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Ngân hàng"
            name="bank"
            rules={[{ required: true, message: 'Vui lòng chọn ngân hàng' }]}
          >
            <Select placeholder="Chọn ngân hàng">
              {BANKS.map((bank) => (
                <Option key={bank} value={bank}>
                  {bank}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Thông tin đơn hàng"
            name="orderInfo"
            rules={[{ required: true, message: 'Vui lòng nhập thông tin đơn hàng' }]}
          >
            <Input placeholder="Nhập thông tin đơn hàng" />
          </Form.Item>
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              {modalMode === 'create' ? 'Tạo hóa đơn' : 'Cập nhật'}
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title={`Hóa đơn ${selectedInvoice?.id}`}
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={<Button onClick={() => setViewModalVisible(false)}>Đóng</Button>}
        width={600}
      >
        {selectedInvoice && (
          <Form layout="vertical">
            <Form.Item label="Mã hóa đơn">
              <Input value={selectedInvoice.id} readOnly />
            </Form.Item>
            <Form.Item label="Mã đặt phòng">
              <Input value={selectedInvoice.bookingID} readOnly />
            </Form.Item>
            <Form.Item label="Khách hàng">
              <Input value={selectedInvoice.userName} readOnly />
            </Form.Item>
            <Form.Item label="Thông tin đơn hàng">
              <Input value={selectedInvoice.orderInfo} readOnly />
            </Form.Item>
            <Form.Item label="Số giao dịch">
              <Input value={selectedInvoice.transactionNo} readOnly />
            </Form.Item>
            <Form.Item label="Ngày tạo">
              <Input value={dayjs(selectedInvoice.createdAt).format('DD/MM/YYYY')} readOnly />
            </Form.Item>
            <Form.Item label="Tổng tiền">
              <Input value={`${(selectedInvoice.price * 1000000).toLocaleString()} VNĐ`} readOnly />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default Invoice;