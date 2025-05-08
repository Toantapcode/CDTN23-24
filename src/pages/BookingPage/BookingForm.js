import React from 'react';

const BookingForm = ({
    error,
    checkInDate,
    setCheckInDate,
    checkOutDate,
    setCheckOutDate,
    numOfAdults,
    setNumOfAdults,
    numOfChild,
    setNumOfChild,
    services,
    selectedServices,
    setSelectedServices,
    setShowPickupModal,
    paymentMethod,
    setPaymentMethod,
    paymentCompleted,
    setPaymentCompleted,
    isPaymentSuccessful,
    handlePayment,
    handleSubmit,
    today,
    pickupDetails,
}) => {
    const handleServiceChange = (serviceId, serviceName) => {
        if (serviceName === "Đưa đón") {
            setShowPickupModal(true);
        }
        setSelectedServices(prev => {
            if (prev.includes(serviceId)) {
                return prev.filter(id => id !== serviceId);
            } else {
                return [...prev, serviceId];
            }
        });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Thông tin đặt phòng</h3>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="checkInDate">
                        Ngày nhận phòng
                    </label>
                    <input
                        type="date"
                        id="checkInDate"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        min={today}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="checkOutDate">
                        Ngày trả phòng
                    </label>
                    <input
                        type="date"
                        id="checkOutDate"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        min={checkInDate || today}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="numOfAdults">
                        Số lượng người lớn
                    </label>
                    <input
                        type="number"
                        id="numOfAdults"
                        value={numOfAdults}
                        onChange={(e) => setNumOfAdults(Math.max(1, parseInt(e.target.value)))}
                        min="1"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="numOfChild">
                        Số lượng trẻ em
                    </label>
                    <input
                        type="number"
                        id="numOfChild"
                        value={numOfChild}
                        onChange={(e) => setNumOfChild(Math.max(0, parseInt(e.target.value)))}
                        min="0"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">
                        Dịch vụ bổ sung
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-2">
                        {services && services.length > 0 ? (
                            services.map((service) => (
                                <button
                                    key={service.id}
                                    type="button"
                                    onClick={() => handleServiceChange(service.id, service.name)}
                                    className={`p-2 rounded-lg text-sm transition-colors ${selectedServices.includes(service.id)
                                        ? 'bg-yellow-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    {service.name}
                                    {service.name === "Đưa đón" && selectedServices.includes(service.id) && pickupDetails.price
                                        ? ` - ${(pickupDetails.price).toLocaleString('vi-VN')} VND`
                                        : service.name !== "Đưa đón"
                                            ? ` ${(service.price * 1000).toLocaleString('vi-VN')} VND`
                                            : ''}
                                </button>
                            ))
                        ) : (
                            <p className="text-gray-500 col-span-2">Không có dịch vụ nào</p>
                        )}
                    </div>
                </div>
                {!isPaymentSuccessful && (
                    <div className="mb-4">
                        <label className="block text-gray-700 font-bold mb-2" htmlFor="paymentMethod">
                            Phương thức thanh toán
                        </label>
                        <select
                            id="paymentMethod"
                            value={paymentMethod}
                            onChange={(e) => {
                                setPaymentMethod(e.target.value);
                                setPaymentCompleted(false);
                            }}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                            required
                        >
                            <option value="">Chọn phương thức thanh toán</option>
                            <option value="cash">Tiền mặt</option>
                            <option value="vnpay">VN PAY</option>
                        </select>
                    </div>
                )}
                {!isPaymentSuccessful && paymentMethod === "vnpay" && !paymentCompleted && (
                    <button
                        type="button"
                        onClick={handlePayment}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 uppercase font-bold tracking-widest w-full mb-4"
                    >
                        Thanh toán
                    </button>
                )}
                <button
                    type="submit"
                    className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 uppercase font-bold tracking-widest w-full"
                    disabled={paymentMethod === "vnpay" && !paymentCompleted}
                >
                    Xác nhận đặt phòng
                </button>
            </form>
        </div>
    );
};

export default BookingForm;