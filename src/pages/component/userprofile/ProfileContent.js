import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Modal, message } from 'antd';
import axiosInstance from '../../../request';

const ProfileContent = () => {
    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('User: ');
        setUserData(storedUser ? JSON.parse(storedUser) : null);
    }, []);

    const userID = userData?.id || null;

    if (!userData || !userID) {
        return <div className="p-6">Vui lòng đăng nhập để xem hồ sơ</div>;
    }

    const showModal = () => {
        setModalVisible(true);
        form.setFieldsValue({
            name: userData?.name,
            email: userData?.email,
            phone: userData?.phone,
        });
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    const handleOk = async () => {
        try {
            await form.validateFields();
            const values = form.getFieldsValue();
            await axiosInstance.put(`/user/updateInfo/${userID}`, values);
            message.success('Cập nhật thành công!');

            const updatedUser = { ...userData, ...values };
            localStorage.setItem('User: ', JSON.stringify(updatedUser));
            setUserData(updatedUser);
            setModalVisible(false);
        } catch (error) {
            message.error('Cập nhật thất bại!');
            console.error('Lỗi:', error);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-4">Hồ sơ của tôi</h2>
            <Form layout="vertical">
                <Form.Item className="font-bold" label="Họ và tên">
                    <Input className="max-w-[300px]" value={userData?.name} readOnly />
                </Form.Item>
                <Form.Item className="font-bold" label="Email">
                    <Input className="max-w-[300px]" value={userData?.email} readOnly />
                </Form.Item>
                <Form.Item className="font-bold" label="Số điện thoại">
                    <Input className="max-w-[300px]" value={userData?.phone} readOnly />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={showModal}>
                        Chỉnh sửa thông tin
                    </Button>
                </Form.Item>
            </Form>

            <Modal
                title="Chỉnh sửa hồ sơ"
                visible={modalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                cancelText="Hủy"
                okText="Lưu"
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Họ và tên"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                    >
                        <Input className="max-w-[300px]" />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                    >
                        <Input className="max-w-[300px]" />
                    </Form.Item>
                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                    >
                        <Input className="max-w-[300px]" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProfileContent;