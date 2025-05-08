import React, { useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const LocationModal = ({
    showLocationModal,
    setShowLocationModal,
    locationSearch,
    setLocationSearch,
    pickupDetails,
    setPickupDetails,
    handleLocationSearch,
    getCurrentLocation,
    mapRef,
    markerRef,
    leafletMapRef,
    reverseGeocode,
}) => {
    const initializeMap = () => {
        if (!mapRef.current || leafletMapRef.current) return;

        leafletMapRef.current = L.map(mapRef.current, {
            center: [21.027764, 105.852983],
            zoom: 12,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(leafletMapRef.current);

        markerRef.current = L.marker([21.027764, 105.852983], { draggable: true }).addTo(leafletMapRef.current);

        markerRef.current.on('dragend', () => {
            if (markerRef.current && leafletMapRef.current) {
                const { lat, lng } = markerRef.current.getLatLng();
                setPickupDetails(prev => ({ ...prev, lat, lng }));
                reverseGeocode(lat, lng);
            }
        });

        leafletMapRef.current.on('click', (e) => {
            if (markerRef.current && leafletMapRef.current) {
                const { lat, lng } = e.latlng;
                markerRef.current.setLatLng([lat, lng]);
                setPickupDetails(prev => ({ ...prev, lat, lng }));
                reverseGeocode(lat, lng);
            }
        });
    };

    useEffect(() => {
        if (showLocationModal) {
            initializeMap();
        }

        return () => {
            if (leafletMapRef.current) {
                leafletMapRef.current.off();
                leafletMapRef.current.remove();
                leafletMapRef.current = null;
                markerRef.current = null;
            }
        };
    }, [showLocationModal]);

    return (
        <>
            {showLocationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Chọn điểm đón</h3>
                        <div className="mb-4 flex items-center">
                            <input
                                type="text"
                                value={locationSearch}
                                onChange={(e) => setLocationSearch(e.target.value)}
                                placeholder="Tìm kiếm địa điểm"
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                            />
                            <button
                                type="button"
                                onClick={handleLocationSearch}
                                className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Tìm
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={getCurrentLocation}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mb-4"
                        >
                            Sử dụng vị trí hiện tại
                        </button>
                        <div ref={mapRef} className="w-full h-96 rounded-lg"></div>
                        <div className="flex justify-end mt-4">
                            <button
                                type="button"
                                onClick={() => setShowLocationModal(false)}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
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

export default LocationModal;