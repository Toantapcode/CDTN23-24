import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import axiosInstance from '../../../request'

const ChangePassword = () => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
    });
    const [currentPassword, setCurrentPassword] = useState('');

   
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosInstance.get('http://localhost:8080/adminuser/getProfile');
                console.log('Pw:', response.users.password);
                setCurrentPassword(response.users.password); 
            } catch (err) {
                console.log("Error fetching profile", err);
            }
        };
        fetchProfile();
    }, []);

    const checkOldPasswordApi = (oldPassword) => {
        return new Promise((resolve, reject) => {
            if (oldPassword === currentPassword) {
                resolve(true);
            } else {
                reject(new Error('Mật khẩu cũ không chính xác!'));
            }
        });
    };

    const handleFinish = async (values) => {
        try {
            await checkOldPasswordApi(values.oldPassword);
            console.log('New Password:', values.newPassword);
            message.success('Đổi mật khẩu thành công!');
        } catch (error) {
            message.error(error.message);
        }
    };

    const handleVisibility = (field) => {
        setVisible({ ...visible, [field]: !visible[field] });
    };

    return (
        <div className="p-6 max-w-xl mx-auto bg-gray-100 rounded-lg text-orange-700 translate-x-[-50%]">
            <h2 className="text-lg font-semibold mb-2">Đổi Mật Khẩu</h2>
            <p className="text-sm text-gray-500 mb-4">
                Cập nhật mật khẩu để bảo mật tài khoản của bạn
            </p>

            <Form
                form={form}
                onFinish={handleFinish}
                layout="vertical"
                initialValues={{
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                }}
            >
                <Form.Item
                    label="Mật khẩu cũ"
                    name="oldPassword"
                    rules={[
                        {
                            required: true,
                            message: 'Mật khẩu cũ không được để trống!',
                        },
                        {
                            min: 8,
                            message: 'Mật khẩu phải dài hơn 8 kí tự!',
                        },
                        {
                            pattern: /[A-Z]/,
                            message: 'Mật khẩu phải có ít nhất một ký tự in hoa!',
                        },
                    ]}
                >
                    <Input.Password
                        placeholder="Nhập mật khẩu cũ"
                        iconRender={visible.oldPassword ? (visible) => <EyeOutlined /> : (visible) => <EyeInvisibleOutlined />}
                        onClick={() => handleVisibility('oldPassword')}
                    />
                </Form.Item>

                <Form.Item
                    label="Nhập mật khẩu mới"
                    name="newPassword"
                    rules={[
                        {
                            required: true,
                            message: 'Mật khẩu mới không được để trống!',
                        },
                        {
                            min: 8,
                            message: 'Mật khẩu phải dài hơn 8 kí tự!',
                        },
                        {
                            pattern: /[A-Z]/,
                            message: 'Mật khẩu phải có ít nhất một ký tự in hoa!',
                        },
                    ]}
                >
                    <Input.Password
                        placeholder="Nhập mật khẩu mới"
                        iconRender={visible.newPassword ? (visible) => <EyeOutlined /> : (visible) => <EyeInvisibleOutlined />}
                        onClick={() => handleVisibility('newPassword')}
                    />
                </Form.Item>

                <Form.Item
                    label="Nhập lại mật khẩu mới"
                    name="confirmPassword"
                    dependencies={['newPassword']}
                    rules={[
                        {
                            required: true,
                            message: 'Nhập lại mật khẩu không được để trống!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Nhập lại mật khẩu không khớp với mật khẩu mới!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        placeholder="Nhập lại mật khẩu mới"
                        iconRender={visible.confirmPassword ? (visible) => <EyeOutlined /> : (visible) => <EyeInvisibleOutlined />}
                        onClick={() => handleVisibility('confirmPassword')}
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="w-full">
                        Đổi Mật Khẩu
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ChangePassword;
