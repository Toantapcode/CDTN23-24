import React from 'react';
import Header from '../component/header';
import Footer from '../component/footer';
import imgbg from "../../assets/image/hero3.webp";
import { FaFacebook, FaInstagram, FaTwitter, FaRss, FaLinkedin, FaYoutube } from "react-icons/fa";

const ContactPage = () => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <Header />
            <section className="bg-gray-50 py-12">
                <section
                    className="bg-cover bg-center h-[50vh] flex items-center justify-center mt-[-50px] w-full"
                    style={{ backgroundImage: `url(${imgbg})` }}
                >
                    <div className="container mx-auto px-6 py-16 text-center">
                        <h1 className="text-8xl font-bold text-white mb-4 font-pacifico">Liên hệ</h1>
                    </div>
                </section>

                <div className="container mx-auto px-6">
                    <div className="flex flex-col justify-center gap-8 mt-8">
                        <div className="md:w-2/3 mx-auto">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14901.675978263893!2d105.81728845!3d20.97583515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135acef8ad5350f%3A0x89435a3528118ff5!2zVHLGsOG7nW5nIMSQ4bqhaSho4buNYyBUaMSDbmcgTG9uZw!5e0!3m2!1svi!2s!4v1742799835777!5m2!1svi!2s"
                                width="100%"
                                height="400"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="LuxeStay Location"
                            ></iframe>
                        </div>

                        <div className="md:w-2/3 mx-auto bg-white p-6 rounded-lg shadow-lg">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <form className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Họ và tên"
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="email"
                                                    placeholder="Email"
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Số điện thoại"
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Địa chỉ"
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <textarea
                                                placeholder="Lời nhắn"
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 h-32 resize-none"
                                            ></textarea>
                                        </div>

                                        <div>
                                            <button
                                                type="submit"
                                                className="w-full bg-yellow-600 text-white py-3 rounded-lg uppercase font-bold tracking-widest hover:bg-yellow-700 transition-colors duration-200"
                                            >
                                                Gửi
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                <div className="md:col-span-1 text-gray-600">
                                    <p className="mb-2">📍 Nghiêm Xuân Yêm - Đại Kim - Hoàng Mai - Hà Nội</p>
                                    <p className="mb-2">📞 012 3456 7890</p>
                                    <p className="mb-2">✉ luxstayfivestars@gmail.com</p>
                                    <p className="mb-2">🌐 cdtn</p>
                                    <div className="flex space-x-3 mt-4">
                                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                            <FaFacebook className="text-blue-600 text-2xl" />
                                        </a>
                                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                            <FaInstagram className="text-pink-500 text-2xl" />
                                        </a>
                                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                            <FaTwitter className="text-blue-400 text-2xl" />
                                        </a>
                                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                            <FaLinkedin className="text-blue-700 text-2xl" />
                                        </a>
                                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                                            <FaYoutube className="text-red-600 text-2xl" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default ContactPage;