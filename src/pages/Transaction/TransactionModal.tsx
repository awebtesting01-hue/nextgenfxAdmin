import { FiX } from 'react-icons/fi';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: {
        billId: string;
        userId: string;
        name: string;
        amount: string;
        status: string;
        requestDate: string;
        transactionType: string;
        method: string;
        from: string;
        to: string;
    } | null;
}

export default function TransactionModal({ isOpen, onClose, transaction }: TransactionModalProps) {
    if (!isOpen || !transaction) return null;

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
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-gray-200 p-6 sticky top-0 bg-white z-10">
                    <h3 className="text-xl font-semibold text-gray-900">Transaction Details</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <FiX className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                            <DetailItem label="Unique Bill ID" value={transaction.billId} />
                            <DetailItem label="User ID" value={transaction.userId} />
                            <DetailItem label="Name" value={transaction.name} />
                            <DetailItem label="Amount" value={transaction.amount} />
                        </div>
                        <div className="space-y-4">
                            <DetailItem label="Status">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(transaction.status)}`}>
                                    {transaction.status}
                                </span>
                            </DetailItem>
                            <DetailItem label="Request Date" value={transaction.requestDate} />
                            <DetailItem label="Transaction Type" value={transaction.transactionType} />
                            <DetailItem label="Method" value={transaction.method} />
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Transaction Parties</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DetailItem label="From" value={transaction.from} />
                            <DetailItem label="To" value={transaction.to} />
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 p-6 sticky bottom-0 bg-white">
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Close
                        </button>
                        <button
                            onClick={() => alert('Transaction processed')}
                            className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
                        >
                            Process Transaction
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const DetailItem = ({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        {value ? <p className="mt-1 text-sm font-medium text-gray-900">{value}</p> : children}
    </div>
);