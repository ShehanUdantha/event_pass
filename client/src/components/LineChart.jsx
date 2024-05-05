import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJs,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  CategoryScale,
} from "chart.js";

ChartJs.register(
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  CategoryScale
);

const LineChart = ({
  dateList,
  dateRageTickets,
  dateRageVerifiedTicket,
  dateRageRefundRequestedTicket,
}) => {
  const options = {};
  const data = {
    labels: [...dateList],
    datasets: [
      {
        label: "Sold",
        data: [...dateRageTickets],
        borderColor: "rgb(67,56,202)",
      },
      {
        label: "Verified",
        data: [...dateRageVerifiedTicket],
        borderColor: "rgb(47,151,47)",
      },
      {
        label: "Refund Request",
        data: [...dateRageRefundRequestedTicket],
        borderColor: "rgb(255,76,76)",
      },
    ],
  };

  return (
    <div className="w-full">
      <Line options={options} data={data} />
    </div>
  );
};

export default LineChart;
