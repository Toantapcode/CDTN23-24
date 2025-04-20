import { useState, useEffect } from "react";
import { Select } from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axiosInstance from "../../request";

const OccupancyStatistics = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [data, setData] = useState([]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get("/booking/all");
                const bookings = response.bookingList || [];
                
                const yearlyData = Array(12).fill(0).map((_, index) => {
                    const month = index + 1;
                    const occupancy = bookings.filter(b => 
                        new Date(b.checkInDate).getFullYear() === year &&
                        new Date(b.checkInDate).getMonth() + 1 === month
                    ).length;
                    return { name: `Tháng ${month}`, occupancy };
                });
                
                setData(yearlyData);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
                setData([]);
            }
        };
        
        fetchData();
    }, [year]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-700">Thống kê lượng đặt phòng</h2>
                <Select value={year} onChange={setYear} className="w-32">
                    {[...Array(20)].map((_, i) => {
                        const y = new Date().getFullYear() - i;
                        return <Select.Option key={y} value={y}>{y}</Select.Option>;
                    })}
                </Select>
            </div>
            <ResponsiveContainer width="100%" height={450}>
                <BarChart data={data} barCategoryGap="75%">
                    <XAxis dataKey="name" interval={0} tick={{ textAnchor: "end", fontSize: 10 }}/>
                    <YAxis allowDecimals={false} tickCount={11} />
                    <Tooltip formatter={(value) => [`${value}`, "Số lượng đặt phòng"]} />
                    <Bar dataKey="occupancy" fill="#3498db" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default OccupancyStatistics;
