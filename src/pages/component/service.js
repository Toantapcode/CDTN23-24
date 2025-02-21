import { Card } from "antd";
import { WifiOutlined } from "@ant-design/icons";
import { FaSwimmingPool, FaBicycle } from "react-icons/fa";
import { GiCook } from "react-icons/gi";

export default function Service() {
    const features = [
        {
            icon: <FaSwimmingPool className="text-6xl text-yellow-600" />,
            title: "Bể bơi rộng",
            description: "Một trong những yếu tố hàng đầu để những chuyến công tác của bạn trở nên nhẹ nhàng, thoải mái chính là việc lựa chọn một khách sạn cao cấp để lưu trú trong suốt thời gian đi công tác."
        },
        {
            icon: <WifiOutlined className="text-6xl text-yellow-600" />,
            title: "Wifi miễn phí",
            description: "Một trong những yếu tố hàng đầu để những chuyến công tác của bạn trở nên nhẹ nhàng, thoải mái chính là việc lựa chọn một khách sạn cao cấp để lưu trú trong suốt thời gian đi công tác."
        },
        {
            icon: <GiCook className="text-6xl text-yellow-600" />,
            title: "Nhà hàng",
            description: "Một trong những yếu tố hàng đầu để những chuyến công tác của bạn trở nên nhẹ nhàng, thoải mái chính là việc lựa chọn một khách sạn cao cấp để lưu trú trong suốt thời gian đi công tác."
        },
        {
            icon: <FaBicycle className="text-6xl text-yellow-600" />,
            title: "Thuê xe đạp",
            description: "Một trong những yếu tố hàng đầu để những chuyến công tác của bạn trở nên nhẹ nhàng, thoải mái chính là việc lựa chọn một khách sạn cao cấp để lưu trú trong suốt thời gian đi công tác."
        }
    ];

    return (
        <div className="bg-gray-50 py-12">
            <div className="container mx-auto px-6">
                <h1 className="text-5xl font-bold text-gray-900 flex items-center wow animate__animated animate__zoomInLeft">
                    <span className="border-r-8 border-yellow-600 pr-4 mr-4 font-pacifico">Dịch vụ sẵn có</span>
                    <span className="text-yellow-600 text-3xl ">Chào mừng đến với chúng tôi</span>
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-10 py-10 wow animate__animated animate__fadeInUp">
                    {features.map((feature, index) => (
                        <Card key={index} className="shadow-md border border-gray-200 p-4 text-center">
                            <div className="flex justify-center mb-3">{feature.icon}</div>
                            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
