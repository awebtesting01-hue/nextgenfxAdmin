import { useState, useEffect } from "react";
import Pagination from "../../../utils/Pagination";

import { transferWalletApi } from "../../../apis/transferWallet.api";
import TransferTransactionModal from "./TransferTransactionModal";

interface WalletRequest {
  _id: string;
  userId: {
    _id: string;
    email: string;
    user_id?: string; // make optional
    display_name: string;
  };
  totalPayable: number;
  transactionCharge: number;
  receiveAmount: number;
  screenshotUrls: string[];
  user_remarks: string;
  admin_remarks?: string;
  transferType: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const TransferWallet: React.FC = () => {
  const [requests, setRequests] = useState<WalletRequest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [adminRemarks, setAdminRemarks] = useState<{ [key: string]: string }>(
    {}
  );
  const [selectedRequest, setSelectedRequest] = useState<WalletRequest | null>(
    null
  );

  useEffect(() => {
    const fetchWalletRequests = async () => {
      try {
        const response = await transferWalletApi.getAddWalletRequests();
        if (response?.data) setRequests(response.data);
        console.log("Wallet Requests:", response.data);
      } catch (error) {
        console.error("Error fetching wallet requests:", error);
      }
    };
    fetchWalletRequests();
  }, []);

  const handleAction = (id: string, action: "approved" | "rejected") => {
    const remarks = adminRemarks[id] || "";
    const payload = { id, action, admin_remarks: remarks };
    console.log("Admin Action Payload:", payload);
    // Call your API here to update the status
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = requests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(requests.length / itemsPerPage);

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Add Wallet Requests</h2>

      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">#</th>
              <th className="px-4 py-3 text-left text-sm font-medium">User</th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                User Remarks
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Admin Remarks
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((req, idx) => (
              <tr key={req._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-700">
                  {indexOfFirstItem + idx + 1}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {req.userId.display_name} ({req.userId.user_id})
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  ₹{req.totalPayable}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {req.user_remarks || "N/A"}
                </td>
                <td className="px-4 py-3">{req.admin_remarks || "N/A"}</td>
                <td className="px-4 py-3 text-sm text-gray-700 capitalize">
                  {req.status}
                </td>
                <td className="px-4 py-3 text-sm flex gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedRequest(req)}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {selectedRequest && (
        <TransferTransactionModal
          transaction={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
};

export default TransferWallet;
