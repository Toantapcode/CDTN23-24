import { Input } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { FaFacebook, FaInstagram, FaTwitter, FaRss, FaLinkedin, FaYoutube } from "react-icons/fa";
import h1 from '../../assets/image/bglogin.jpg'
import h2 from '../../assets/image/hero1.jpg'
import h3 from '../../assets/image/hero2.jpg'
import h4 from '../../assets/image/hero3.webp'
import h5 from '../../assets/image/room1.jpg'
import h6 from '../../assets/image/room2.jpg'

export default function Footer() {
    return (
        <footer className="bg-white py-10 px-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Hình ảnh */}
                <div>
                    <h3 className="font-bold text-lg mb-4 font">HÌNH ẢNH</h3>
                    <div className="grid grid-cols-3 gap-0">
                        <img src={h1} alt="" className="w-full h-full" />
                        <img src={h2} alt="" className="w-full h-auto" />
                        <img src={h3} alt="" className="w-full h-full" />
                        <img src={h4} alt="" className="w-full h-auto" />
                        <img src={h5} alt="" className="w-full h-auto" />
                        <img src={h6} alt="" className="w-full h-auto" />
                    </div>
                </div>

                {/* Đăng ký */}
                <div>
                    <h3 className="font-bold text-lg mb-4">ĐĂNG KÝ</h3>
                    <p className="mb-3">Đăng ký để nhận được thông tin mới nhất từ chúng tôi.</p>
                    <Input placeholder="Email ..." suffix={<MailOutlined className="text-yellow-600" />} />
                    <h3 className="font-bold text-lg mt-6 mb-3">THEO DÕI TRÊN</h3>
                    <div className="flex space-x-3">
                        <a href="https://facebook.com" target="_blank" rel="">
                            <FaFacebook className="text-blue-600 text-2xl" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="">
                            <FaInstagram className="text-pink-500 text-2xl" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="">
                            <FaTwitter className="text-blue-400 text-2xl" />
                        </a>
                        <a href="https://rss.com" target="_blank" rel="">
                            <FaRss className="text-orange-500 text-2xl" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="">
                            <FaLinkedin className="text-blue-700 text-2xl" />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="">
                            <FaYoutube className="text-red-600 text-2xl" />
                        </a>
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-lg mb-4">THÔNG TIN LIÊN HỆ</h3>
                    <p>📍 Nghiêm Xuân Yêm - Đại Kim - Hoàng Mai - Hà Nội</p>
                    <p>📞 012 3456 7890</p>
                    <p>✉ binvacoc@gmail.com</p>
                    <p>🌐 cdtn</p>
                    <div className="mt-4">
                        <a href="" className="text-yellow-600">Trang chủ</a> |
                        <a href="introduce" className="ml-2">Giới thiệu</a> |
                        <a href="rooms" className="ml-2">Phòng</a> |
                        {/* <a href="#" className="ml-2">Tin tức</a> |  */}
                        <a href="#" className="ml-2">Liên hệ</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
