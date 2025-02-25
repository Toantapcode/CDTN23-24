import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaInstagram, FaFacebook, FaTwitter, FaGithub } from 'react-icons/fa';
import axiosInstance from '../../request';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/auth/login', { email, password });
            const { token, user } = response;

            localStorage.setItem('Token: ', token);
            localStorage.setItem('User: ', JSON.stringify(user));

            if (user.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (error) {
            toast.error('Tài khoản hoặc mật khẩu không đúng!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    };

    return (
        <div className="min-h-screen w-full bg-cover bg-center flex items-center justify-center p-4"
            style={{ backgroundImage: `url(${require('../../assets/image/bglogin.jpg')})` }}>
            <div className="w-full max-w-4xl bg-black/20 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl flex">
                <div className="flex-1 p-8 text-white flex flex-col items-center justify-center text-center">
                    <a href='/'>
                        <h1 className="text-6xl font-bold mb-4">LuxeStay</h1>
                        <h2 className="text-3xl mb-4">Chào mừng quý khách</h2>
                    </a>
                    <div className="flex gap-4">
                        <a href="#" className="text-white hover:text-gray-300 transition-colors">
                            <FaInstagram size={24} />
                        </a>
                        <a href="#" className="text-white hover:text-gray-300 transition-colors">
                            <FaFacebook size={24} />
                        </a>
                        <a href="#" className="text-white hover:text-gray-300 transition-colors">
                            <FaTwitter size={24} />
                        </a>
                        <a href="#" className="text-white hover:text-gray-300 transition-colors">
                            <FaGithub size={24} />
                        </a>
                    </div>
                </div>
                <div className="flex-1 p-8">
                    <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl">
                        <h2 className="text-3xl font-bold text-white mb-6">Đăng nhập</h2>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <input
                                    type="email"
                                    placeholder="Email hoặc Số điện thoại"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-white/40"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    placeholder="Mật khẩu"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-white/40"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center justify-between text-white">
                                <label className="flex items-center">
                                    <input type="checkbox" className="mr-2" />
                                    Ghi nhớ mật khẩu
                                </label>
                                <a href="#" className="hover:underline">Quên mật khẩu?</a>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-black text-white rounded-lg hover:bg-black/80 transition-colors"
                            >
                                Login
                            </button>
                            <p className="text-center text-white">
                                Bạn chưa có tài khoản?{' '}
                                <a href="/register" className="hover:underline">Đăng ký</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default LoginPage;