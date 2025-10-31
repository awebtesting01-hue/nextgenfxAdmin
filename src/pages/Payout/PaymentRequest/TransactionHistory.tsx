import { useState, useEffect } from "react";
import TransactionModal from "./TransactionModal";
import Pagination from "../../../utils/Pagination";
import { FiFilter, FiX, FiCalendar } from "react-icons/fi";

interface Transaction {
  id: number;
  billId: string;
  userId: string;
  amount: string;
  method: string;
  status: "Approved" | "Pending" | "Rejected";
  requestDate: string;
  transactionType: string;
  name: string;
  from: string;
  to: string;
}

export default function TransactionHistory() {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 10;

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [billIdFilter, setBillIdFilter] = useState<string>("");
  const [userIdFilter, setUserIdFilter] = useState<string>("");
  const [methodFilter, setMethodFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [transactionTypeFilter, setTransactionTypeFilter] =
    useState<string>("");

  // Sample data - in a real app, this would come from an API
  const allTransactions: Transaction[] = Array.from({ length: 45 }, (_, i) => ({
    id: i + 1,
    billId: `#BILL${100000 + i}`,
    userId: `USR${String(i + 1).padStart(3, "0")}`,
    amount: `₹${Math.floor(Math.random() * 10000).toLocaleString()}`,
    method: ["Bank Transfer", "UPI", "PayPal", "Credit Card"][
      Math.floor(Math.random() * 4)
    ],
    status: ["Approved", "Pending", "Rejected"][
      Math.floor(Math.random() * 3)
    ] as "Approved" | "Pending" | "Rejected",
    requestDate: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    transactionType: ["Withdrawal Request", "Deposit", "Transfer"][
      Math.floor(Math.random() * 3)
    ],
    name: ["John Doe", "Jane Smith", "Robert Johnson", "Emily Davis"][
      Math.floor(Math.random() * 4)
    ],
    from: `User ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
    to: `User ${String.fromCharCode(70 + Math.floor(Math.random() * 5))}`,
  }));

  // Filter transactions based on filter criteria
  const [filteredTransactions, setFilteredTransactions] =
    useState<Transaction[]>(allTransactions);

  useEffect(() => {
    let result = [...allTransactions];

    if (statusFilter) {
      result = result.filter((t) => t.status === statusFilter);
    }
    if (billIdFilter) {
      result = result.filter((t) =>
        t.billId.toLowerCase().includes(billIdFilter.toLowerCase())
      );
    }
    if (userIdFilter) {
      result = result.filter((t) =>
        t.userId.toLowerCase().includes(userIdFilter.toLowerCase())
      );
    }
    if (methodFilter) {
      result = result.filter((t) => t.method === methodFilter);
    }
    if (dateFilter) {
      result = result.filter((t) => {
        const transactionDate = new Date(t.requestDate)
          .toISOString()
          .split("T")[0];
        return transactionDate === dateFilter;
      });
    }
    if (transactionTypeFilter) {
      result = result.filter(
        (t) => t.transactionType === transactionTypeFilter
      );
    }

    setFilteredTransactions(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [
    statusFilter,
    billIdFilter,
    userIdFilter,
    methodFilter,
    dateFilter,
    transactionTypeFilter,
  ]);

  // Get unique values for filter dropdowns
  const uniqueMethods = [...new Set(allTransactions.map((t) => t.method))];
  const uniqueTransactionTypes = [
    ...new Set(allTransactions.map((t) => t.transactionType)),
  ];

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const openModal = (transaction: Transaction) => {
    console.log({ transaction });
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
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const resetFilters = () => {
    setStatusFilter("");
    setBillIdFilter("");
    setUserIdFilter("");
    setMethodFilter("");
    setDateFilter("");
    setTransactionTypeFilter("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-xl md:text-2xl font-bold text-gray-800">
            Transaction History
          </h4>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiFilter className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Status
                </label>
                <div className="relative">
                  <FiFilter
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500"
                    size={18}
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 bg-gray-50 shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition text-sm"
                  >
                    <option value="">All Statuses</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Bill ID Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Unique Bill ID
                </label>
                <div className="relative">
                  <FiFilter
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500"
                    size={18}
                  />
                  <input
                    type="text"
                    value={billIdFilter}
                    onChange={(e) => setBillIdFilter(e.target.value)}
                    placeholder="Search Bill ID"
                    className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 bg-gray-50 shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition text-sm"
                  />
                </div>
              </div>

              {/* User ID Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  User ID
                </label>
                <div className="relative">
                  <FiFilter
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500"
                    size={18}
                  />
                  <input
                    type="text"
                    value={userIdFilter}
                    onChange={(e) => setUserIdFilter(e.target.value)}
                    placeholder="Search User ID"
                    className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 bg-gray-50 shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition text-sm"
                  />
                </div>
              </div>

              {/* Method Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="relative">
                  <FiFilter
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500"
                    size={18}
                  />
                  <select
                    value={methodFilter}
                    onChange={(e) => setMethodFilter(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 bg-gray-50 shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition text-sm"
                  >
                    <option value="">All Methods</option>
                    {uniqueMethods.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Request Date
                </label>
                <div className="relative">
                  <FiCalendar
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500"
                    size={18}
                  />
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 bg-gray-50 shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition text-sm"
                  />
                </div>
              </div>

              {/* Transaction Type Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Transaction Type
                </label>
                <div className="relative">
                  <FiFilter
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500"
                    size={18}
                  />
                  <select
                    value={transactionTypeFilter}
                    onChange={(e) => setTransactionTypeFilter(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 bg-gray-50 shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition text-sm"
                  >
                    <option value="">All Types</option>
                    {uniqueTransactionTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 shadow transition"
              >
                <FiX size={16} />
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredTransactions.length} transactions
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Unique Bill ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Request On
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Transaction Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-4 text-center text-sm text-gray-500"
                    >
                      No transactions found matching your filters
                    </td>
                  </tr>
                ) : (
                  currentItems.map((transaction, idx) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {transaction.id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.billId}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {transaction.userId}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {transaction.amount}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {transaction.method}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                            transaction.status
                          )}`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(transaction.requestDate)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {transaction.transactionType}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => console.log({ transaction })}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md text-sm"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      {isModalOpen && selectedTransaction && (
        <TransactionModal
          transaction={selectedTransaction}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
