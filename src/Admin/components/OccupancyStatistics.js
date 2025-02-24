import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OccupancyStatistics = () => {
  const data = {
    labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    datasets: [
      {
        label: 'Occupancy Rate',
        data: [35, 50, 75, 100, 80, 60, 40, 50, 60, 70],
        backgroundColor: 'lightblue',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Occupancy Statistics',
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <Bar options={options} data={data} />
    </div>
  );
};

export default OccupancyStatistics;