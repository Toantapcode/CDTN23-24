import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage1 from '../../assets/image/slide1.jpg';
import heroImage2 from '../../assets/image/hero2.jpg';
import heroImage3 from '../../assets/image/hero3.webp';
import Header from '../component/header';
import Rooms from '../component/rooms';
import About from '../component/about';
import ContactPage from '../component/contact.js';
import Footer from '../component/footer';

const HomePage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem('Token: ');

  const handleClick = () => {
    if (token) {
      navigate('/rooms');
    } else {
      navigate('/login');
    }
  };

  const heroImages = [
    heroImage1,
    heroImage2,
    heroImage3,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  },[])
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <section className="relative bg-cover bg-center h-[96vh] flex items-center justify-center mt-[-50px] mb-[100px]"
        style={{ backgroundImage: `url(${heroImages[currentImageIndex]})` }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative container mx-auto px-6 py-16 text-center">
          <h1 className="text-7xl font-bold text-white mb-4 drop-shadow-lg">Chào mừng đến với LuxeStay</h1>
          <p className="text-2xl text-white drop-shadow-md mb-10">Trải nghiệm sự đón tiếp tuyệt vời nhất của Hạ Long</p>
          <button className="mt-10 bg-white text-gray-800 font-semibold py-3 px-8 rounded-full hover:bg-gray-100 
                           transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            onClick={handleClick}>
            Đặt ngay
          </button>
        </div>
      </section>
      <About />
      <Rooms />
      <ContactPage />

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Khách hàng nói gì về chúng tôi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-600 mb-4">
                "LuxeStay là khách sạn tuyệt vời nhất mà tôi từng ở. Dịch vụ hoàn hảo và tầm nhìn tuyệt đẹp!"
              </p>
              <p className="text-gray-800 font-semibold">- Nguyễn Thành Đạt</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-600 mb-4">
                "Các phòng rộng rãi và sang trọng. Tôi không thể chờ đợi để quay lại!"
              </p>
              <p className="text-gray-800 font-semibold">- Trần Phương Thanh</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;