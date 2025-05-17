import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../component/header";
import Footer from "../component/footer";
import imgbg from "../../assets/image/hero3.webp";
import axiosInstance from "../../request";

const RoomCard = ({ room, onBook }) => {
  const displayPrice = room.price
    ? `${(room.price * 1000).toLocaleString("vi-VN")} VND / đêm`
    : "";

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <img
        src={room.image}
        alt={room.name}
        className="rounded-lg mb-4 w-full h-48 object-cover"
      />
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{room.name}</h3>
      <p className="text-gray-600 mb-2">{room.description}</p>
      <p className="text-yellow-600 font-bold text-lg mb-4">{displayPrice}</p>
      <button
        onClick={() => onBook(room)}
        className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 uppercase font-bold tracking-widest"
      >
        Đặt ngay
      </button>
    </div>
  );
};

const token = localStorage.getItem("Token: ");

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [roomTypeId, setRoomTypeId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const navigate = useNavigate();

  const handlePriceInput = (value, setter) => {
    if (value === "" || (parseFloat(value) >= 0 && !isNaN(value))) {
      setter(value);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0]; 
  };

  useEffect(() => {
    if (checkInDate || checkOutDate) {
      const savedFormData = JSON.parse(localStorage.getItem('BookingFormData')) || {};
      const updatedFormData = {
        ...savedFormData,
        checkInDate,
        checkOutDate,
      };
      localStorage.setItem('BookingFormData', JSON.stringify(updatedFormData));
    }
  }, [checkInDate, checkOutDate]);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!checkInDate || !checkOutDate || !roomTypeId) return;

      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/room/availableRoomsByDateAndType?checkInDate=${formatDate(
            checkInDate
          )}&checkOutDate=${formatDate(checkOutDate)}&roomTypeId=${roomTypeId}`
        );
        if (response && response.roomList) {
          setRooms(response.roomList);
          setFilteredRooms(response.roomList);
        } else {
          setRooms([]);
          setFilteredRooms([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu phòng:", error);
        setRooms([]);
        setFilteredRooms([]);
      } finally {
        setLoading(false);
      }
    };

    localStorage.removeItem("SelectedRoomId");
    localStorage.removeItem("SelectedRoom");
    fetchRooms();
  }, [checkInDate, checkOutDate, roomTypeId]);

  useEffect(() => {
    let filtered = rooms;

    if (minPrice !== "") {
      filtered = filtered.filter((room) => room.price >= parseFloat(minPrice));
    }
    if (maxPrice !== "") {
      filtered = filtered.filter((room) => room.price <= parseFloat(maxPrice));
    }

    setFilteredRooms(filtered);
  }, [minPrice, maxPrice, rooms]);

  const handleBook = (room) => {
    localStorage.setItem("SelectedRoomId", room.id);
    localStorage.setItem("SelectedRoom", JSON.stringify(room));
    if (token) {
      navigate("/bookingpage", { state: { room } });
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <section
        className="bg-cover bg-center h-[50vh] flex items-center justify-center mt-[-50px]"
        style={{ backgroundImage: `url(${imgbg})` }}
      >
        <div className="container mx-auto px-6 py-16 text-center">
          <h1 className="text-8xl font-bold text-white mb-4 font-pacifico">Phòng</h1>
        </div>
      </section>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold text-gray-900 flex items-center">
            <span className="border-r-8 border-yellow-600 pr-4 mr-4 font-pacifico">
              Loại phòng
            </span>
            <span className="text-yellow-600 text-3xl">Các phòng của chúng tôi</span>
          </h1>

          <div className="mt-6 flex flex-col md:flex-row gap-4">
            <div>
              <label className="text-gray-700 font-bold mr-2">Ngày nhận phòng:</label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="border rounded-lg px-4 py-2"
                min={formatDate(new Date())}
              />
            </div>
            <div>
              <label className="text-gray-700 font-bold mr-2">Ngày trả phòng:</label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="border rounded-lg px-4 py-2"
                min={checkInDate || formatDate(new Date())}
              />
            </div>
            <div>
              <label className="text-gray-700 font-bold mr-2">Loại phòng:</label>
              <select
                value={roomTypeId}
                onChange={(e) => setRoomTypeId(e.target.value)}
                className="border rounded-lg px-4 py-2"
              >
                <option value="" disabled>
                  Chọn loại phòng
                </option>
                <option value="1">Gia đình</option>
                <option value="2">Cặp đôi</option>
                <option value="3">VIP</option>
              </select>
            </div>
            <div>
              <label className="notifications
                text-gray-700 font-bold mr-2">Giá tối thiểu (nghìn VND):</label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => handlePriceInput(e.target.value, setMinPrice)}
                className="border rounded-lg px-4 py-2"
                placeholder="VD: 1000"
                min="0"
              />
            </div>
            <div>
              <label className="text-gray-700 font-bold mr-2">Giá tối đa (nghìn VND):</label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => handlePriceInput(e.target.value, setMaxPrice)}
                className="border rounded-lg px-4 py-2"
                placeholder="VD: 3000"
                min="0"
              />
            </div>
          </div>

          {loading ? (
            <p className="text-center text-gray-600 mt-8">Đang tải dữ liệu...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {filteredRooms.length > 0 ? (
                filteredRooms.map((room, index) => (
                  <RoomCard key={index} room={room} onBook={handleBook} />
                ))
              ) : (
                <p className="text-center text-gray-600">
                  Không có phòng phù hợp với tiêu chí tìm kiếm.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RoomsPage;