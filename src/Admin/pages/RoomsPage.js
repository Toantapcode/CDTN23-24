import React, { useState, useEffect } from "react";
import { Table, Button, Space, Tag, Pagination } from "antd";

const RoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const columns = [
        { title: 'Số phòng', dataIndex: 'roomNumber', key: 'roomNumber' },
        { title: 'Kiểu phòng', dataIndex: 'bedType', key: 'bedType' },
        { title: 'Tầng', dataIndex: 'roomFloor', key: 'roomFloor' },
        { title: 'Tiện ích', dataIndex: 'roomFacility', key: 'roomFacility' },
        {
            title: 'Trạng thái',
            dataindex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'gray';
                if (status = ' Availible') color = 'green';
                return <Tag color={color}>{status}</Tag>
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: () => <Space size="middle">...</Space>,
        },
    ];

    useEffect(() => {
        fetchRooms();
    }, [currentPage, pageSize]);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            // const response = await axios.get(
            //     `YOUR_API_ENDPOINT?page=${currentPage}&pageSize=${pageSize}`
            // );
            // setRooms(response.data.rooms); // Thay đổi theo cấu trúc dữ liệu API 
            // setTotalItems(response.data.total); // Thay đổi theo cấu trúc dữ liệu API 
        } catch (error) {
            console.error('Error fetching rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };
    return (
        <div className="p-10">
            <h2 className="text-lg font-semibold mb-4">Rooms</h2>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <Button className="mr-2">All rooms (100)</Button>
                    <Button className="mr-2">Available room (20)</Button>
                    <Button className="mr-2">Booked (80)</Button>
                </div>
                <Button type="primary">Add room</Button>
            </div>
            <Table
                dataSource={rooms}
                columns={columns}
                loading={loading}
                pagination={false}
            />
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalItems}
                onChange={handlePageChange}
                className="mt-4"
            />
        </div>
    )
}

export default RoomsPage;