import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaInstagram, FaFacebook, FaTwitter, FaGithub } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import axiosInstance from '../../request';

function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [error, setError] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (!name || name.length < 5) {
            setError('Vui lòng nhập đầy đủ họ và tên!');
            return;
        }
        if (!email) {
            setError('Vui lòng nhập email!');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError('Email không hợp lệ!');
            return;
        }
        if (!phone) {
            setError('Vui lòng nhập số điện thoại!');
            return;
        }
        if (!/^\d+$/.test(phone)) {
            setError('Số điện thoại không hợp lệ!');
            return;
        }
        if (!password) {
            setError('Vui lòng nhập mật khẩu!');
            return;
        }
        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự!');
            return;
        }
        if (!agreeTerms) {
            setError('Vui lòng đồng ý với các điều khoản và điều kiện.');
            return;
        }

        try {
            const response = await axiosInstance.post('/auth/register', {
                email,
                password,
                phone,
                name
            });
            toast.success('Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.');
            await axiosInstance.get(`/auth/send-email-active/${email}`);
            setIsRegistered(true);
        }
        catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Email đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập!');
            }
        }
    }
    if (isRegistered) {
        return (
            <div className="min-h-screen w-full bg-cover bg-center flex items-center justify-center p-4"
                style={{ backgroundImage: `url(${require('../../assets/image/bglogin.jpg')})` }}>
                <div className="w-full max-w-4xl bg-black/20 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl flex">
                    <div className="flex-1 p-8 text-white flex flex-col items-center justify-center text-center">
                        <a href='/'>
                            <h1 className="text-6xl font-bold mb-4">LuxeStay</h1>
                            <h2 className="text-3xl mb-4">Chào mừng quý khách</h2>
                        </a>
                    </div>
                    <div className="flex-1 p-8">
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl">
                            <h2 className="text-3xl font-bold text-white mb-6">Xác minh email</h2>
                            <p className="text-white mb-4">
                                Một email xác minh đã được gửi đến <span className="font-bold">{email}</span>.
                                Vui lòng kiểm tra hộp thư đến (và cả thư mục spam) để kích hoạt tài khoản của bạn.
                            </p>
                            <button
                                onClick={() => (window.location.href = 'https://mail.google.com/')}
                                className="w-full py-3 bg-black text-white rounded-lg hover:bg-black/80 transition-colors"
                            >
                                Tiến tới Gmail
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-cover bg-center flex items-center justify-center p-4"
            style={{ backgroundImage: `url(${require('../../assets/image/bglogin.jpg')})` }}>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggablex
                pauseOnHover
            />
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
                        <h2 className="text-3xl font-bold text-white mb-6">Đăng ký</h2>
                        <form className="space-y-6" onSubmit={handleRegister}>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Họ và tên"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-white/40"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                {error && error.includes('họ và tên') && <p className="text-red-500 text-sm mt-1">{error}</p>}
                            </div>
                            <div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-white/40"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {error && error.includes('email') && <p className="text-red-500 text-sm mt-1">{error}</p>}
                            </div>
                            <div>
                                <input
                                    type="number"
                                    placeholder="Số điện thoại"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-white/40"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                                {error && error.includes('số điện thoại') && <p className="text-red-500 text-sm mt-1">{error}</p>}
                            </div>
                            <div>
                                <input
                                    type="password"
                                    placeholder="Mật khẩu"
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-white/40"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {error && error.includes('mật khẩu') && <p className="text-red-500 text-sm mt-1">{error}</p>}
                            </div>
                            <div className="flex items-center justify-between text-white">
                                <label className="flex items-center">
                                    <input type="checkbox" className="mr-2" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
                                    Tôi đồng ý với các điều khoản và điều kiện
                                </label>
                                {error && error.includes('điều khoản') && <p className="text-red-500 text-sm mt-1">{error}</p>}
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-black text-white rounded-lg hover:bg-black/80 transition-colors"
                            >
                                Đăng ký
                            </button>
                            <p className="text-center text-white">
                                Đã có tài khoản  ? <a href="/login" className="hover:underline">Đăng nhập</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;