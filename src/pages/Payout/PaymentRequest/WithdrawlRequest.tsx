import { useState, useEffect } from "react";
import Pagination from "../../../utils/Pagination";
import { FiFilter } from "react-icons/fi";
import { withdrawalRequestApi } from "../../../apis/withdrawlRequest.api"; // ✅ remove WithdrawalResponse import

export default function WithdrawalRequest() {
  const [allWithdrawals, setAllWithdrawals] = useState<any[]>([]); // ✅ use any[]
  const [filteredWithdrawals, setFilteredWithdrawals] = useState<any[]>([]); // ✅ use any[]
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 10;

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Fetch withdrawals from API
  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        setLoading(true);
        const data: any[] = await withdrawalRequestApi.getAllWithdrawals(); // ✅ cast to any[]
        setAllWithdrawals(data);
        setFilteredWithdrawals(data);
      } catch (error: any) {
        console.error("Failed to fetch withdrawals:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, []);

  // Filter logic
  useEffect(() => {
    let result = [...allWithdrawals];
    if (statusFilter)
      result = result.filter((t) => t.status === statusFilter.toLowerCase());
    setFilteredWithdrawals(result);
    setCurrentPage(1);
  }, [statusFilter, allWithdrawals]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredWithdrawals.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleApprove = async (withdrawal: any) => {
    // ✅ use any
    console.log({ withdrawal });
    try {
      const updated = await withdrawalRequestApi.updateWithdrawalStatus(
        withdrawal, // pass ID
        "approved"
      );
      setAllWithdrawals((prev) =>
        prev.map((w) => (w._id === updated._id ? updated : w))
      );
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (withdrawal: any) => {
    // ✅ use any
    try {
      const updated = await withdrawalRequestApi.updateWithdrawalStatus(
        withdrawal, // pass ID
        "rejected"
      );
      setAllWithdrawals((prev) =>
        prev.map((w) => (w._id === updated._id ? updated : w))
      );
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const totalPages = Math.ceil(filteredWithdrawals.length / itemsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
            Withdrawal Requests
          </h4>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <FiFilter className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {showFilters && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <label className="mr-2 font-medium">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        )}

        <div className="mb-4 text-sm text-gray-600">
          {loading
            ? "Loading withdrawals..."
            : `Showing ${filteredWithdrawals.length} withdrawals`}
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    User Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    withdrawl Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Requested Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Transaction Fee
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Wallet
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Requested On
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
                      colSpan={8}
                      className="px-4 py-4 text-center text-sm text-gray-500"
                    >
                      No withdrawals found
                    </td>
                  </tr>
                ) : (
                  currentItems.map((w, idx) => (
                    <tr key={w._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {w.userId.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {w.netAmount}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {w.amount}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {w.fee}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {w.method}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {w.walletAddress}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                            w.status
                          )}`}
                        >
                          {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {formatDate(w.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {w.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              className="bg-green-100 text-green-800 px-3 py-1 rounded-md hover:bg-green-200"
                              onClick={() => handleApprove(w._id)}
                            >
                              Approve
                            </button>
                            <button
                              className="bg-red-100 text-red-800 px-3 py-1 rounded-md hover:bg-red-200"
                              onClick={() => handleReject(w._id)}
                            >
                              Reject
                            </button>
                          </div>
                        )}
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
    </div>
  );
}
