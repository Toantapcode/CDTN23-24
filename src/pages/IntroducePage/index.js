import React from "react";
import Header from "../component/header";
import Footer from "../component/footer";
import imgbg from "../../assets/image/hero3.webp";
import imgAbout from '../../assets/image/about.jpg';
import { Card, Row, Col } from 'antd';
import { FaUtensils, FaBicycle, FaSwimmer, FaGlassCheers, FaSpa, FaGolfBall } from 'react-icons/fa';


const IntroducePage = () => {
    const teamMembers = [
        {
            name: "Victoria",
            role: "Giám đốc điều hành",
            image: "https://via.placeholder.com/200", // Thay ảnh phù hợp
        },
        {
            name: "Man",
            role: "Bếp trưởng",
            image: "https://via.placeholder.com/200", // Thay ảnh phù hợp
        },
        {
            name: "Jennifer",
            role: "Quản lý",
            image: "https://via.placeholder.com/200", // Thay ảnh phù hợp
        },
        {
            name: "Sara",
            role: "Tiếp tân",
            image: "https://via.placeholder.com/200", // Thay ảnh phù hợp
        },
    ];

    const services = [
        { icon: <FaUtensils className="text-gold-500 text-4xl" />, title: "Nhà hàng" },
        { icon: <FaBicycle className="text-gold-500 text-4xl" />, title: "Thuê xe đạp" },
        { icon: <FaSwimmer className="text-gold-500 text-4xl" />, title: "Bơi lội" },
        { icon: <FaGlassCheers className="text-gold-500 text-4xl" />, title: "Tiệc cưới" },
        { icon: <FaSpa className="text-gold-500 text-4xl" />, title: "Spa & Massage" },
        { icon: <FaGolfBall className="text-gold-500 text-4xl" />, title: "Đánh Golf" }
    ];
    return (
        <div className="bg-gray-100 min-h-screen">
            <Header />
            <section className="bg-cover bg-center h-[50vh] flex items-center justify-center mt-[-50px]"
                style={{ backgroundImage: `url(${imgbg})` }}>
                <div className="container mx-auto px-6 py-16 text-center">
                    <h1 className="text-8xl font-bold text-white mb-4 font-pacifico">Giới thiệu</h1>
                </div>
            </section>
            <div className="bg-gray-50 py-12 ">
                <div className="max-w-screen-xl mx-auto wow animate__animated animate__bounce">
                    <div className="flex flex-wrap justify-center mx-auto">
                        <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8" data-animate="bounceIn">
                            <div className="img-inner image-cover dark" style={{ paddingTop: '56.25%', position: 'relative' }}>
                                <img
                                    src={imgAbout}
                                    alt=""
                                    className="absolute top-0 left-0 w-full h-full object-cover"
                                    sizes="(max-width: 768px) 100vw, 768px"
                                />
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 lg:w-2/3 px-4 mb-8">
                            <div className="flex flex-col justify-center h-full">
                                <h1 className="text-5xl font-bold text-gray-900 flex items-center mb-4">
                                    <span className="border-r-8 border-yellow-600 pr-4 mr-4 font-pacifico">Luxe Stay</span>
                                    <span className="text-yellow-600 text-2xl">Chào mừng đến với chúng tôi</span>
                                </h1>
                                <p className="text-lg text-gray-700 max-w-2xl mx-0">
                                    Một trong những yếu tố hàng đầu để những chuyến công tác của bạn trở nên nhẹ nhàng, thoải mái chính là việc lựa chọn một khách sạn cao cấp để lưu trú trong suốt thời gian đi công tác. Những khách sạn sang trọng với nhiều dịch vụ cao cấp, gần trung tâm và nơi công tác vừa giúp cho bạn được thư thả, tận hưởng thời gian nghỉ ngơi.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section className="text-center py-12 bg-white px-[320px]">
                <h1 className="text-5xl font-bold text-gray-900 flex items-center mb-4 ">
                    <span className="border-r-8 border-yellow-600 pr-4 mr-4 font-pacifico">Đội ngũ nhân viên</span>
                    <span className="text-yellow-600 text-2xl">Chào mừng đến với chúng tôi</span>
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 px-6">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="text-center  wow animate__animated animate__fadeInUp" data-wow-delay={`${0.3 + index * 0.2}s`}>
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-48 h-48 mx-auto object-cover rounded-lg shadow-lg"
                            />
                            <h3 className="mt-4 text-xl font-semibold">{member.name}</h3>
                            <p className="text-gray-600">{member.role}</p>
                        </div>
                    ))}
                </div>
            </section>
            <section className="text-center py-12 bg-white px-[320px]">
                <h1 className="text-5xl font-bold text-gray-900 flex items-center mb-4 ">
                    <span className="border-r-8 border-yellow-600 pr-4 mr-4 font-pacifico">Dịch vụ</span>
                    <span className="text-yellow-600 text-2xl">Chào mừng đến với chúng tôi</span>
                </h1>
                <Row gutter={[32, 32]} justify="center">
                    {services.map((service, index) => (
                        <Col key={index} xs={24} sm={12} md={8} lg={8} className="wow animate__animated animate__fadeInUp" data-wow-delay={`${0.2 * index}s`}>
                            <Card bordered={false} className="text-center shadow-lg p-6">
                                <div className="flex justify-center mb-4 text-yellow-600 ">{service.icon}</div>
                                <h3 className="text-xl font-semibold text-yellow-600 ">{service.title}</h3>
                                <p className="text-gray-600">
                                    Một trong những yếu tố hàng đầu để những chuyến công tác của bạn trở nên nhẹ nhàng, thoải mái chính
                                    là việc lựa chọn một khách sạn cao cấp để lưu trú trong suốt thời gian đi công tác.
                                </p>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </section>

            <Footer />
        </div>
    )
}
export default IntroducePage;