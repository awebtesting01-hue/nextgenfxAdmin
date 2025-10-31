import { FaUserShield, FaUserTie, FaUser, FaCalendarAlt, FaClock, FaGlobe, FaSignInAlt } from "react-icons/fa";

const LoginLogs = () => {
    const logs = [
        {
            role: "Admin",
            date: "27/07/2025",
            time: "10:12 AM",
            ip: "192.168.1.23",
            device: "Chrome, Windows"
        },
        {
            role: "Moderator",
            date: "27/07/2025",
            time: "09:45 AM",
            ip: "192.168.1.12",
            device: "Safari, Mac"
        },
        {
            role: "Admin",
            date: "26/07/2025",
            time: "05:33 PM",
            ip: "192.168.1.98",
            device: "Firefox, Linux"
        },
        {
            role: "User",
            date: "26/07/2025",
            time: "04:15 PM",
            ip: "192.168.1.45",
            device: "Edge, Windows"
        },
        {
            role: "Admin",
            date: "25/07/2025",
            time: "11:22 AM",
            ip: "192.168.1.23",
            device: "Chrome, Android"
        },
        {
            role: "Moderator",
            date: "25/07/2025",
            time: "08:30 AM",
            ip: "192.168.1.76",
            device: "Safari, iOS"
        },
    ];

    const getRoleIcon = (role: string) => {
        switch (role) {
            case "Admin":
                return <FaUserShield className="text-red-500" />;
            case "Moderator":
                return <FaUserTie className="text-blue-500" />;
            default:
                return <FaUser className="text-green-500" />;
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case "Admin":
                return "bg-red-100 text-red-800";
            case "Moderator":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-green-100 text-green-800";
        }
    };

    return (
        <div className="rounded-xl shadow-sm p-5 bg-white">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FaSignInAlt className="text-blue-500" />
                    Login Logs
                </h2>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                    {logs.length} entries
                </span>
            </div>

            <div className="space-y-4">
                {logs.map((log, index) => (
                    <div
                        key={index}
                        className="p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                        <div className="flex items-start gap-3">
                            <div className="p-3 rounded-lg bg-gray-100">
                                {getRoleIcon(log.role)}
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <span className="text-sm font-medium text-gray-800">
                                        {log.role}
                                    </span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(log.role)}`}>
                                        {log.role}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FaCalendarAlt />
                                        <span>{log.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FaClock />
                                        <span>{log.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FaGlobe />
                                        <span>{log.ip}</span>
                                    </div>
                                </div>

                                <div className="mt-2 text-xs text-gray-400">
                                    Device: {log.device}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex justify-end">
                <button className="text-sm px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600">
                    View All Logs
                </button>
            </div>
        </div>
    );
};

export default LoginLogs;