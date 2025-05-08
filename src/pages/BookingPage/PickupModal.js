import React from 'react';

const PickupModal = ({
    showPickupModal,
    setShowPickupModal,
    pickupDetails,
    setPickupDetails,
    setSelectedServices,
    services,
    handlePickupSubmit,
    setShowLocationModal,
}) => {
    return (
        <>
            {showPickupModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Thông tin đưa đón</h3>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="pickupAddress">
                                Điểm đón
                            </label>
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    id="pickupAddress"
                                    value={pickupDetails.address}
                                    readOnly
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                                    placeholder="Chọn điểm đón"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowLocationModal(true)}
                                    className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Chọn
                                </button>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="pickupTime">
                                Thời gian đón
                            </label>
                            <input
                                type="time"
                                id="pickupTime"
                                value={pickupDetails.time}
                                onChange={(e) => setPickupDetails(prev => ({ ...prev, time: e.target.value }))}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="luggageWeight">
                                Trọng lượng hành lý (kg)
                            </label>
                            <input
                                type="number"
                                id="luggageWeight"
                                value={pickupDetails.luggageWeight}
                                onChange={(e) => setPickupDetails(prev => ({ ...prev, luggageWeight: e.target.value }))}
                                min="0"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                                required
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowPickupModal(false);
                                    setSelectedServices(prev => prev.filter(id => id !== services.find(s => s.name === "Đưa đón")?.id));
                                    setPickupDetails({ address: "", lat: null, lng: null, time: "", luggageWeight: "", distance: null, price: null });
                                }}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={handlePickupSubmit}
                                class ZONE="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PickupModal;