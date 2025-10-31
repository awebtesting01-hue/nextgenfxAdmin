import { FaExchangeAlt, FaUserPlus, FaCoins, FaMoneyBillWave, FaCheckCircle, FaClock } from "react-icons/fa";

const RecentTransactions = () => {
    const transactions = [
        {
            type: 'Wallet Add',
            user: 'alice.j',
            amount: '$300',
            date: '2025-07-24',
            status: 'Completed',
            icon: <FaMoneyBillWave className="text-green-500" />
        },
        {
            type: 'Wallet Transfer',
            user: 'bob.s',
            amount: '$150',
            date: '2025-07-24',
            status: 'Completed',
            icon: <FaExchangeAlt className="text-blue-500" />
        },
        {
            type: 'New Member',
            user: 'charlie.l',
            amount: '-',
            date: '2025-07-23',
            status: 'Completed',
            icon: <FaUserPlus className="text-purple-500" />
        },
        {
            type: 'Commission',
            user: 'diana.k',
            amount: '$50',
            date: '2025-07-23',
            status: 'Completed',
            icon: <FaCoins className="text-amber-500" />
        },
        {
            type: 'Withdrawal',
            user: 'eric.m',
            amount: '$100',
            date: '2025-07-22',
            status: 'Pending',
            icon: <FaClock className="text-yellow-500" />
        }
    ];

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-100 text-green-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="rounded-xl shadow-sm p-5 bg-white">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-blue-500" />
                Recent Transactions
            </h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">User</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {transactions.map((tx, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-gray-100">
                                            {tx.icon}
                                        </div>
                                        <span className="text-sm text-gray-600">{tx.type}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{tx.user}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{tx.amount}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{tx.date}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(tx.status)}`}>
                                        {tx.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentTransactions;