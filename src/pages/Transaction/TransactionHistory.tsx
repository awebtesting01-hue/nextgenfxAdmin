import { useState } from 'react';
import { FiEye, FiDownload, FiFilter } from 'react-icons/fi';
import Pagination from '../../utils/Pagination';
import TransactionModal from './TransactionModal';


interface Transaction {
    id: number;
    billId: string;
    userId: string;
    amount: string;
    method: string;
    status: 'Approved' | 'Pending' | 'Rejected';
    requestDate: string;
    transactionType: string;
    name: string;
    from: string;
    to: string;
}

export default function TransactionHistoryTwo() {
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Sample data
    const transactions: Transaction[] = Array.from({ length: 45 }, (_, i) => ({
        id: i + 1,
        billId: `#BILL${100000 + i}`,
        userId: `USR${String(i + 1).padStart(3, '0')}`,
        amount: `₹${Math.floor(Math.random() * 10000).toLocaleString('en-IN')}`,
        method: ['Bank Transfer', 'UPI', 'PayPal', 'Credit Card'][Math.floor(Math.random() * 4)],
        status: ['Approved', 'Pending', 'Rejected'][Math.floor(Math.random() * 3)] as 'Approved' | 'Pending' | 'Rejected',
        requestDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleString(),
        transactionType: ['Withdrawal', 'Deposit', 'Transfer'][Math.floor(Math.random() * 3)],
        name: ['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis'][Math.floor(Math.random() * 4)],
        from: `User ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
        to: `User ${String.fromCharCode(70 + Math.floor(Math.random() * 5))}`,
    }));

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(transactions.length / itemsPerPage);

    const openModal = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-100 text-green-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h4 className="text-xl md:text-2xl font-bold text-gray-800">Transaction History</h4>
                    <div className="flex items-center space-x-2">
                        <button className="px-3 py-1.5 flex items-center gap-1 bg-white border border-gray-300 rounded-md text-sm font-medium">
                            <FiDownload size={14} /> Export
                        </button>
                        <button className="px-3 py-1.5 flex items-center gap-1 bg-blue-600 text-white rounded-md text-sm font-medium">
                            <FiFilter size={14} /> Filter
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">#</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Bill ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">User ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Method</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.map((transaction) => (
                                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.billId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.userId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{transaction.amount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.method}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(transaction.status)}`}>
                                                {transaction.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.requestDate}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.transactionType}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                                            <button
                                                onClick={() => openModal(transaction)}
                                                className="text-blue-600 hover:text-blue-900 flex items-center justify-end w-full"
                                            >
                                                <FiEye className="mr-1" /> View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={closeModal}
                transaction={selectedTransaction}
            />
        </div>
    );
}