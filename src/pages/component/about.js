import imgAbout from '../../assets/image/about.jpg'

export default function About() {
    return (
        <div className="bg-gray-100  wow animate__animated animate__fadeInLeft">
            <div className="container mx-auto px-6">
                <div className="gap-element" style={{ display: 'block', height: 'auto', paddingTop: '60px' }}></div>
                <div className="flex flex-col items-center text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 flex items-center">
                        <span className="border-r-8 border-yellow-600 pr-4 mr-4 font-pacifico">Luxe Stay</span>
                        <span className="text-yellow-600">Chào mừng đến với chúng tôi</span>
                    </h1>
                </div>
                <div className="flex flex-wrap justify-center -mx-4">
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
                    <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8 flex items-center" data-animate="fadeInRight">
                        <p className="text-lg text-gray-700">
                            Một trong những yếu tố hàng đầu để những chuyến công tác của bạn trở nên nhẹ nhàng, thoải mái chính là việc lựa chọn một khách sạn cao cấp để lưu trú trong suốt thời gian đi công tác. Những khách sạn sang trọng với nhiều dịch vụ cao cấp, gần trung tâm và nơi công tác vừa giúp cho bạn được thư thả, tận hưởng thời gian nghỉ ngơi.
                        </p>
                    </div>
                    <div className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8 flex items-center" data-animate="fadeInRight">
                        <p className="text-lg text-gray-700">
                            Khách sạn chúng tôi tự hào mang đến không gian sang trọng, tiện nghi cùng dịch vụ tận tâm. Tọa lạc tại vị trí đắc địa, bạn sẽ dễ dàng khám phá vẻ đẹp xung quanh. Hãy đến và tận hưởng kỳ nghỉ tuyệt vời với những trải nghiệm khó quên. Chúng tôi luôn sẵn sàng chào đón bạn bằng sự ấm áp và nồng hậu nhất!
                        </p>
                    </div>
                </div>

                <div className="gap-element" style={{ display: 'block', height: 'auto', paddingTop: '50px' }}></div>
            </div>
        </div>
    )
}
