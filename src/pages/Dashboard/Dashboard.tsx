import { useState } from "react";
import {
  FaUsers,
  FaDollarSign,
  FaHandHoldingUsd,
  FaChartLine,
  FaExchangeAlt,
  FaUserPlus,
  FaCoins,
  FaMoneyBillWave,
} from "react-icons/fa";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import DashboardCard from "./DashboardCard";
import RecentActivities from "./RecentActivities";
import RecentTransactions from "./RecentTransactions";
import LoginLogs from "./LoginLogs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');

  const ChartComponent = chartType === 'bar' ? Bar : Line;

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50 text-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <FaChartLine className="text-blue-500" />
            Dashboard Overview
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
          {/* Wallet Balance */}
          <DashboardCard
            icon={<FaDollarSign className="text-3xl text-blue-500" />}
            title="Wallet Balance"
            value="$1,800"
          />

          {/* Total Referral Bonus */}
          <DashboardCard
            icon={<FaUserPlus className="text-3xl text-green-500" />}
            title="Total Referral Bonus"
            value="$400"
          />

          {/* Total Deposit */}
          <DashboardCard
            icon={<FaHandHoldingUsd className="text-3xl text-purple-500" />}
            title="Total Deposit"
            value="$1,000"
          />

          {/* Trading Bonus */}
          <DashboardCard
            icon={<FaCoins className="text-3xl text-amber-500" />}
            title="Trading Bonus"
            value="$400"
          />

          {/* Total Earnings */}
          <DashboardCard
            icon={<FaChartLine className="text-3xl text-emerald-500" />}
            title="Total Earnings"
            value="$1,000"
          />

          {/* Monthly Profit Share */}
          <DashboardCard
            icon={<FaMoneyBillWave className="text-3xl text-red-500" />}
            title="Monthly Profit Share"
            value="$200"
          />

          {/* Total Withdrawn */}
          <DashboardCard
            icon={<FaExchangeAlt className="text-3xl text-indigo-500" />}
            title="Total Withdrawn"
            value="$200"
          />

          {/* Total Team Size */}
          <DashboardCard
            icon={<FaUsers className="text-3xl text-cyan-500" />}
            title="Total Team Size"
            value="20"
          />
        </div>

        {/* Chart Section */}
        <div className="rounded-xl shadow-sm p-5 mb-8 bg-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <h2 className="text-xl font-semibold">Earnings & Deposits Overview</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 rounded-lg text-sm ${chartType === 'bar' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Bar Chart
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1 rounded-lg text-sm ${chartType === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Line Chart
              </button>
            </div>
          </div>
          <div className="h-80">
            <ChartComponent
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [
                  {
                    label: 'Wallet Add',
                    data: [200, 300, 400, 500, 600, 700, 800],
                    backgroundColor: '#0b66ff',
                    borderColor: '#0b66ff',
                  },
                  {
                    label: 'Wallet Transfer',
                    data: [100, 150, 200, 250, 300, 350, 400],
                    backgroundColor: '#34c759',
                    borderColor: '#34c759',
                  },
                  {
                    label: 'New Member Join',
                    data: [5, 8, 10, 12, 15, 18, 20],
                    backgroundColor: '#ffcc00',
                    borderColor: '#ffcc00',
                  },
                  {
                    label: 'Total Commission',
                    data: [50, 80, 100, 120, 140, 160, 180],
                    backgroundColor: '#ff9500',
                    borderColor: '#ff9500',
                  },
                  {
                    label: 'Withdrawal Request',
                    data: [80, 100, 120, 150, 170, 190, 210],
                    backgroundColor: '#ff3b30',
                    borderColor: '#ff3b30',
                  },
                  {
                    label: 'Withdrawal Approved',
                    data: [60, 90, 110, 130, 150, 170, 190],
                    backgroundColor: '#9b59b6',
                    borderColor: '#9b59b6',
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                    labels: {
                      color: '#333',
                    },
                  },
                },
                scales: {
                  x: {
                    grid: {
                      color: 'rgba(0, 0, 0, 0.1)',
                    },
                    ticks: {
                      color: '#333',
                    },
                  },
                  y: {
                    grid: {
                      color: 'rgba(0, 0, 0, 0.1)',
                    },
                    ticks: {
                      color: '#333',
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <RecentActivities />

          {/* Recent Transactions */}
          <RecentTransactions />

          <LoginLogs />
        </div>
      </div>
    </div>
  );
}