// RecentActivities.tsx
import { FaUser, FaExchangeAlt, FaUserPlus, FaCoins, FaMoneyBillWave, FaCheckCircle, FaHistory } from "react-icons/fa";

const RecentActivities = () => {
    const activities = [
        {
            icon: <FaUserPlus className="text-purple-500" />,
            text: "User JohnDoe registered",
            time: "2 mins ago"
        },
        {
            icon: <FaMoneyBillWave className="text-emerald-500" />,
            text: "$500 payout requested by user123",
            time: "15 mins ago"
        },
        {
            icon: <FaCheckCircle className="text-green-500" />,
            text: "Admin approved payout #456",
            time: "1 hour ago"
        },
        {
            icon: <FaUser className="text-blue-500" />,
            text: "New admin login detected",
            time: "2 hours ago"
        },
        {
            icon: <FaCoins className="text-amber-500" />,
            text: "Commission paid to 12 users",
            time: "5 hours ago"
        },
        {
            icon: <FaExchangeAlt className="text-indigo-500" />,
            text: "Wallet transfer completed",
            time: "1 day ago"
        }
    ];

    return (
        <div className="rounded-xl shadow-sm p-5 bg-white">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaHistory className="text-blue-500" />
                Recent Activities
            </h2>
            <ul className="divide-y divide-gray-200">
                {activities.map((activity, index) => (
                    <li key={index} className="py-3">
                        <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-gray-100">
                                {activity.icon}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-600">{activity.text}</p>
                                <p className="text-xs text-gray-400">{activity.time}</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecentActivities;