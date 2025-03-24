import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">Oops! Trang không tìm thấy</h2>
                <p className="text-gray-500 mb-6">
                    Xin lỗi, trang bạn đang tìm không tồn tại hoặc bạn không có quyền truy cập.
                </p>
                <Link
                    to="/"
                    className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300"
                >
                    Quay về trang chủ
                </Link>
            </div>
        </div>
    );
};

export default NotFound;