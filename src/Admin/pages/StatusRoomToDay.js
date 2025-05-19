import { useEffect, useState } from "react";
import axiosInstance from "../../request";
import { Card, Tag, Pagination } from 'antd';
import ModalRoom from "../components/ModalRoom";

function StatusRoomToday() {
    const [rooms, setRooms] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(6);
    const [totalRooms, setTotalRooms] = useState(0);

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [roomSelected, setRoomSelected] = useState(null);
    const [after12, setAfter12] = useState(false);

    useEffect(() => {
        const now = new Date();
        setAfter12(now.getHours() >= 12);
        checkRoomToDay(currentPage);
    }, [currentPage]);

    const checkRoomToDay = async (page) => {
        try {
            const res = await axiosInstance.get(`/room/checkToDay?after12=${after12}&page=${page}&pageSize=${pageSize}`);
            if (res.ec === 0) {
                setRooms(res.roomList);
                setTotalRooms(res.totalElements);
            }
        } catch (err) {
            console.error("Lỗi khi lấy trạng thái phòng:", err);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const showLoading = () => {
        setOpen(true);
        setLoading(true);

        // Simple loading mock. You should add cleanup logic in real world.
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    const handleOnclickRoom = (room) => {
        if (room?.booking) {
            showLoading()
            setRoomSelected(room);
        }
    }

    return (
        <div className="py-10 px-10">
            <h2 className="text-2xl font-semibold mb-6">Trạng thái phòng hôm nay</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {rooms.map((room) => {
                    const isOccupied = !!room.booking;
                    return (
                        <>
                            <Card
                                key={`Phòng-${room.id}`}
                                title={<span className="font-bold text-lg">{room.name}</span>}
                                style={{ width: 350, height: 300 }}
                                cover={
                                    <img
                                        alt={`Ảnh phòng ${room.name}`}
                                        src={room.image}
                                        className="h-40 object-cover"
                                    />
                                }
                                onClick={() => handleOnclickRoom(room)}
                                extra={<span><strong>{room.type.name}</strong></span>}
                                className="shadow-lg rounded-lg overflow-hidden"
                            >
                                <div className="mb-2">
                                    <strong>Trạng thái:</strong>
                                    <Tag color={isOccupied ? "red" : "green"} className="ml-2">
                                        {isOccupied ? "Đang có khách" : "Phòng trống"}
                                    </Tag>
                                </div>
                                {isOccupied && (
                                    <p><strong>Khách:</strong> {room.booking.user.name}</p>
                                )}
                            </Card>
                        </>
                    );
                })}
            </div>
            <ModalRoom open={open} loading={loading} setOpen={setOpen} room={roomSelected} />

            <div className="flex justify-center">
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalRooms}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                />
            </div>
        </div>
    );
}

export default StatusRoomToday;
