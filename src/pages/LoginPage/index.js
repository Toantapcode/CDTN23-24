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

    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [otp, setOtp] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.warning('Email không được để trống!', { position: 'top-right', autoClose: 3000 });
            return;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.warning('Email không hợp lệ!', { position: 'top-right', autoClose: 3000 });
            return;
        }
        if (!password) {
            toast.warning('Mật khẩu không được để trống!', { position: 'top-right', autoClose: 3000 });
            return;
        }

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

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!recoveryEmail) {
            toast.warning('Vui lòng nhập email!', { position: 'top-right', autoClose: 3000 });
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recoveryEmail)) {
            toast.warning('Email không hợp lệ!', { position: 'top-right', autoClose: 3000 });
            return;
        }

        try {
            await axiosInstance.post(`/auth/verifyMail/${recoveryEmail}`);
            toast.success('Đã gửi OTP tới email của bạn!', {
                position: 'top-right',
                autoClose: 3000
            });
            setIsOtpSent(true);
        } catch (error) {
            toast.error('Email không tồn tại trong hệ thống!', {
                position: 'top-right',
                autoClose: 3000
            });
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!newPassword || !rePassword || !otp) {
            toast.warning('Vui lòng điền đầy đủ thông tin!', { position: 'top-right', autoClose: 1500 });
            return;
        }
        if (newPassword !== rePassword) {
            toast.warning('Mật khẩu không khớp!', { position: 'top-right', autoClose: 1500 });
            return;
        }

        try {
            console.log(recoveryEmail, otp)
            await axiosInstance.post(`/auth/changePassword/${recoveryEmail}/${otp}`, {
                password: newPassword,
                rePassword: rePassword
            });
            toast.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập.', {
                position: 'top-right',
                autoClose: 3000
            });
            setIsForgotPassword(false);
            setIsOtpSent(false);
            setRecoveryEmail('');
            setNewPassword('');
            setRePassword('');
            setOtp('');
        } catch (error) {
            toast.error('OTP không hợp lệ hoặc có lỗi xảy ra!', {
                position: 'top-right',
                autoClose: 3000
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
                        {!isForgotPassword ? (
                            <>
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
                                        <a href="#" onClick={() => setIsForgotPassword(true)} className="hover:underline">Quên mật khẩu?</a>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-black text-white rounded-lg hover:bg-black/80 transition-colors"
                                    >
                                        Đăng nhập
                                    </button>
                                    <p className="text-center text-white">
                                        Bạn chưa có tài khoản?{' '}
                                        <a href="/register" className="hover:underline">Đăng ký</a>
                                    </p>
                                </form>
                            </>
                        ) : !isOtpSent ? (
                            <>
                                <h2 className="text-3xl font-bold text-white mb-6">Khôi phục mật khẩu</h2>
                                <form className="space-y-6" onSubmit={handleForgotPassword}>
                                    <div>
                                        <input
                                            type="email"
                                            placeholder="Nhập email của bạn"
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-white/40"
                                            value={recoveryEmail}
                                            onChange={(e) => setRecoveryEmail(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-black text-white rounded-lg hover:bg-black/80 transition-colors"
                                    >
                                        Gửi OTP
                                    </button>
                                    <p className="text-center text-white">
                                        <a href="#" onClick={() => setIsForgotPassword(false)} className="hover:underline">Quay lại đăng nhập</a>
                                    </p>
                                </form>
                            </>
                        ) : (
                            <>
                                <h2 className="text-3xl font-bold text-white mb-6">Thay đổi mật khẩu</h2>
                                <form className="space-y-6" onSubmit={handleResetPassword}>
                                    <div>
                                        <input
                                            type="password"
                                            placeholder="Mật khẩu mới"
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-white/40"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="password"
                                            placeholder="Nhập lại mật khẩu"
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-white/40"
                                            value={rePassword}
                                            onChange={(e) => setRePassword(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Nhập mã OTP"
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-white/40"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-black text-white rounded-lg hover:bg-black/80 transition-colors"
                                    >
                                        Thay đổi mật khẩu
                                    </button>
                                    <p className="text-center text-white">
                                        <a href="#" onClick={() => setIsForgotPassword(false)} className="hover:underline">Quay lại đăng nhập</a>
                                    </p>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default LoginPage;