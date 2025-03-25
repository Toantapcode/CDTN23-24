import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import axiosInstance from '../../../request';
import { toast, ToastContainer } from 'react-toastify';

const AccountSecurity = () => {
    const [form] = Form.useForm();
    const [step, setStep] = useState(1);
    const [passwordData, setPasswordData] = useState({ password: '', rePassword: '' });
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const storedUser = localStorage.getItem('User: ');
    const userData = storedUser ? JSON.parse(storedUser) : null;
    const userEmail = userData?.email || null;

    const handleConfirmPassword = async () => {
        try {
            const values = await form.validateFields();
            setPasswordData({
                password: values.password,
                rePassword: values.rePassword,
            });

            if (!userEmail) {
                setError('Không tìm thấy email người dùng. Vui lòng đăng nhập lại.');
                return;
            }

            setLoading(true);
            setError('');

            const verifyResponse = await axiosInstance.post(`/auth/verifyMail/${userEmail}`);
            console.log('Phản hồi từ API verifyMail:', verifyResponse.data);

            setStep(2);
            toast.success('Mã OTP đã được gửi tới email của bạn!', {
                position: 'top-right',
                autoClose: 3000
            }
            );
        } catch (err) {
            console.error('Lỗi khi xác nhận:', err);
            setError(err.response?.data?.message || 'Không thể gửi mã OTP. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitOtp = async () => {
        if (!otp) {
            setError('Vui lòng nhập OTP');
            return;
        }
        if (!userEmail) {
            setError('Không tìm thấy email người dùng. Vui lòng đăng nhập lại.');
            return;
        }

        setLoading(true);
        setError('');

        const dataToSend = {
            password: passwordData.password,
            rePassword: passwordData.rePassword,
        };

        try {
            const response = await axiosInstance.post(
                `/auth/changePassword/${userEmail}/${otp}`,
                dataToSend
            );
            setStep(1);
            setOtp('');
            form.resetFields();
            toast.success('Đổi mật khẩu thành công!', {
                position: 'top-right',
                autoClose: 3000
            });
        } catch (error) {
            console.error('Lỗi khi gửi OTP:', error);
            setError(error.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <ToastContainer />
            <h2 className="text-3xl font-bold mb-4">Đổi mật khẩu</h2>

            {step === 1 ? (
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleConfirmPassword}
                    className="max-w-md"
                >
                    <Form.Item
                        name="password"
                        label="Mật khẩu mới"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                        ]}
                    >
                        <Input.Password
                            placeholder="Nhập mật khẩu mới"
                            className="rounded-lg"
                        />
                    </Form.Item>

                    <Form.Item
                        name="rePassword"
                        label="Nhập lại mật khẩu"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Vui lòng nhập lại mật khẩu!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu không khớp!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            placeholder="Nhập lại mật khẩu"
                            className="rounded-lg"
                        />
                    </Form.Item>

                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            className=" hover:bg-yellow-700 w-full"
                        >
                            Xác nhận
                        </Button>
                    </Form.Item>
                </Form>
            ) : (
                <div className="max-w-md">
                    <h3 className="text-xl font-semibold mb-4">Nhập mã OTP</h3>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <Input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Nhập mã OTP"
                        className="rounded-lg mb-4"
                    />
                    <Button
                        type="primary"
                        onClick={handleSubmitOtp}
                        loading={loading}
                        className=" hover:bg-yellow-700 w-full"
                    >
                        Gửi
                    </Button>
                    <Button
                        onClick={() => setStep(1)}
                        className="mt-2 w-full"
                    >
                        Quay lại
                    </Button>
                </div>
            )}
        </div>
    );
};

export default AccountSecurity;