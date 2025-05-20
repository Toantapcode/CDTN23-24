import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Modal, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { toast, ToastContainer } from 'react-toastify';
import axiosInstance from '../../../request';
import avtDefault from '../../../assets/image/avatar_default.jpg'

const ProfileContent = () => {
    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState(false);
    const [userData, setUserData] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('User: ');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserData(parsedUser);
            setImageUrl(parsedUser.avatar || ''); // Initialize with user avatar or empty
        }
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
        setImageUrl(userData?.avatar || '');
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    const handleImageUpload = async ({ file }) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axiosInstance.post("/image/upload/User", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setImageUrl(response); // Assuming response contains the image URL
            toast.success("Tải ảnh lên thành công!");
        } catch (error) {
            toast.error("Tải ảnh lên thất bại. Vui lòng thử lại.");
            console.error("Upload error:", error);
        }
    };

    const handleOk = async () => {
        try {
            await form.validateFields();
            const values = form.getFieldsValue();
            const payload = {
                ...values,
                avatar: imageUrl,
            };

            await axiosInstance.put(`/user/updateInfo/${userID}`, payload);
            toast.success('Cập nhật thành công!');

            const updatedUser = { ...userData, ...values, avatar: imageUrl };
            localStorage.setItem('User: ', JSON.stringify(updatedUser));
            setUserData(updatedUser);
            setModalVisible(false);
        } catch (error) {
            toast.error('Tên người dùng tối thiểu 5 ký tự!');
            console.error('Lỗi:', error);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <h2 className="text-3xl font-bold mb-6 text-center">Hồ sơ của tôi</h2>
            <div className="flex flex-col items-center">
                <div className="mb-6">
                    <img
                        src={imageUrl || avtDefault}
                        alt="Avatar"
                        style={{
                            width: 120,
                            height: 120,
                            objectFit: 'cover',
                            borderRadius: '50%',
                            border: '2px solid #e8e8e8',
                        }}
                    />
                </div>
                <Form layout="vertical" className="w-full flex flex-col items-center">
                    <Form.Item label="Họ và tên" className="font-bold">
                        <Input className="max-w-[600px] w-[400px]" value={userData?.name} readOnly />
                    </Form.Item>
                    <Form.Item label="Email" className="font-bold">
                        <Input className="max-w-[600px] w-[400px]" value={userData?.email} readOnly />
                    </Form.Item>
                    <Form.Item label="Số điện thoại" className="font-bold">
                        <Input className="max-w-[600px] w-[400px]" value={userData?.phone} readOnly />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={showModal} className="mt-4">
                            Chỉnh sửa thông tin
                        </Button>
                    </Form.Item>
                </Form>
            </div>

            <Modal
                title="Chỉnh sửa hồ sơ"
                visible={modalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                cancelText="Hủy"
                okText="Lưu"
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Ảnh đại diện">
                        <Upload showUploadList={false} beforeUpload={() => false} onChange={handleImageUpload}>
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>
                        {imageUrl && (
                            <img
                                src={imageUrl}
                                alt="Preview"
                                style={{ width: 100, height: 100, marginTop: 10, borderRadius: '50%' }}
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        label="Họ và tên"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
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