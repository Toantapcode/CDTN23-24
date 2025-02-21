import React, { useState, useEffect } from 'react';
import { Input, Button } from 'antd';
import axiosInstance from '../../../request';
import { toast, ToastContainer } from 'react-toastify';

const MyAccount = () => {
    const [profile, setProfile] = useState({
        id:'',
        name: '',
        email: '',
        password: '',
        role: ''
    });

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await axiosInstance.get('http://localhost:8080/adminuser/getProfile');
                console.log('role', response);
                setProfile({
                    id: response.users.id,
                    name: response.users.name,
                    email: response.users.email,
                    password: response.users.password,
                    role: response.users.role 
                });
            } catch (err) {
                console.log("Lỗi hiển thị hồ sơ", err);
            }
        };
        fetch();
    }, []);

    const updateProfile = async () => {
        try {
            const {id, name, email, password, role } = profile;
            await axiosInstance.put(`http://localhost:8080/admin/update/${id}`, {
                name,
                email,
                password,
                role,
            });
            toast.success("Cập nhật thông tin thành công!");
        } catch (error) {
            toast.error("Cập nhật thông tin thất bại!");
            console.log(error);
        }
    };

    return (
        <div>
            <ToastContainer />
            <div className="p-6 max-w-xl mx-auto bg-gray-100 rounded-lg text-orange-700 translate-x-[-50%]">
                <h2 className="text-lg font-semibold mb-2">Hồ Sơ Của Tôi</h2>
                <p className="text-sm text-gray-500 mb-4">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>

                <hr className="border-t border-gray-300 my-4" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tên</label>
                        <Input
                            name="name"
                            className="mt-1"
                            placeholder="Nhập tên"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <Input
                            name="email"
                            className="mt-1"
                            placeholder="Nhập email"
                            value={profile.email} 
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                        <Input.Password
                            name="password"
                            className="mt-1"
                            placeholder="Nhập mật khẩu"
                            value={profile.password} 
                            onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <Input
                            name="role"
                            className="mt-1"
                            placeholder="Vai trò"
                            value={profile.role} 
                            readOnly
                            onChange={(e) => setProfile({ ...profile, role  : e.target.value })}
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <Button
                            type="primary"
                            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                            onClick={updateProfile}
                        >
                            Lưu
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyAccount;
