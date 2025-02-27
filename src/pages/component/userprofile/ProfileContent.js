import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Modal, message } from 'antd';
import axiosInstance from '../../../request';
import { toast } from 'react-toastify';

const ProfileContent = () => {
    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState(false);
    const storedUser = localStorage.getItem('User: ');
    const userData = JSON.parse(storedUser);
    const userID = userData.id;

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
            console.log(values);
            console.log(userID);
            await axiosInstance.put(`/user/updateInfo/${userID}`, values);
            console.log(values);
            console.log(userID);
            console.log(typeof (userID));
            message.success('Cập nhật thành công!');
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
                <Form.Item className='font-bold' label="Họ và tên">
                    <Input className="max-w-[300px]" value={userData?.name} readOnly />
                </Form.Item>
                <Form.Item className='font-bold' label="Email">
                    <Input className="max-w-[300px]" value={userData?.email} readOnly />
                </Form.Item>
                <Form.Item className='font-bold' label="Số điện thoại">
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
                        <Input className="max-w-[300px]"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                    >
                        <Input className="max-w-[300px]"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                    >
                        <Input className="max-w-[300px]"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProfileContent;