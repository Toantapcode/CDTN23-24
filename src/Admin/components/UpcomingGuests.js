import { useEffect, useState } from "react";
import axiosInstance from "../../request";

const UpcomingGuests = () => {
    const [todayGuests, setTodayGuests] = useState([]);
    const [showAllGuests, setShowAllGuests] = useState(false);

    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await axiosInstance.get("/booking/all");
                const bookings = res.bookingList || [];

                const filtered = bookings.filter(b => b.checkInDate === today);

                const guestPromises = filtered.map(b =>
                    axiosInstance.get(`/booking/getByCode/${b.bookingCode}`)
                );
                const results = await Promise.all(guestPromises);

                const todayList = results.map(result => {
                    const booking = result.booking;
                    return {
                        name: booking.user.name,
                        phone: booking.user.phone,
                        room: booking.room.name,
                        type: booking.room.type.name,
                        checkIn: booking.checkInDate,
                        checkOut: booking.checkOutDate,
                    };
                });

                setTodayGuests(todayList);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu khách sắp đến:", error);
            }
        };

        fetchBookings();
    }, []);

    const toggleGuestList = () => {
        setShowAllGuests(!showAllGuests);
    };

    const GuestList = ({ title, guests }) => (
        <div
            className="bg-white  rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={toggleGuestList}
            style={{ maxHeight: '300px', overflowY: 'auto' }}
        >
            <h2
                className="text-2xl font-bold text-gray-800 mb-4 text-center bg-white sticky top-0 z-10 py-2 border-b"
            >
                {title}
            </h2>

            {guests.length === 0 ? (
                <p className="text-center text-gray-500">Không có khách nào.</p>
            ) : (
                <ul>
                    {guests.slice(0, showAllGuests ? guests.length : 1).map((guest, index) => (
                        <li
                            key={index}
                            className="mb-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="text-center">
                                    <span className="text-indigo-600 font-medium">Họ tên:</span>
                                </div>
                                <div className="text-center">
                                    <p className="text-lg text-gray-800">{guest.name}</p>
                                </div>
                                <div className="text-center">
                                    <span className="text-indigo-600 font-medium">SĐT:</span>
                                </div>
                                <div className="text-center">
                                    <p className="text-md text-gray-600">{guest.phone}</p>
                                </div>
                                <div className="text-center">
                                    <span className="text-indigo-600 font-medium">Phòng:</span>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">{guest.room} ({guest.type})</p>
                                </div>
                                <div className="text-center">
                                    <span className="text-indigo-600 font-medium">Check-in:</span>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">{guest.checkIn}</p>
                                </div>
                                <div className="text-center">
                                    <span className="text-indigo-600 font-medium">Check-out:</span>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-600">{guest.checkOut}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                    {!showAllGuests && guests.length > 1 && (
                        <p className="text-center text-indigo-600 font-medium mt-4">
                            Nhấp để xem thêm {guests.length - 1} khách
                        </p>
                    )}
                </ul>
            )}
        </div>
    );


    return (
        <div className="container p-4">
            <GuestList title="Khách sắp đến hôm nay" guests={todayGuests} />
        </div>
    );
};

export default UpcomingGuests;