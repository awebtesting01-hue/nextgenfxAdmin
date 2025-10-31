import { useState } from "react";
import { addWalletApi } from "../../../apis/addWallet.api";

export interface Transaction {
  _id: string;
  userId: {
    _id: string;
    email: string;
    user_id: string;
    display_name: string;
  };
  otherUserId?: {
    _id: string;
    email: string;
    user_id: string;
    display_name: string;
  };
  totalPayable: number;
  transactionCharge: number;
  receiveAmount: number;
  screenshotUrls: string[];
  user_remarks: string;
  admin_remarks: string;
  transferType: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export default function TransactionModal({ transaction, onClose }: any) {
  const [note, setNote] = useState(transaction.admin_remarks || "");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleAction = async (action: string) => {
    if (!transaction) return;
    setIsSubmitting(true);

    console.log({ transaction });

    try {
      let status: "pending" | "approve" | "reject" = "pending";

      if (action === "Approved") status = "approve";
      else if (action === "Disapproved") status = "reject";
      else if (action === "UpdateRemarks") status = "pending"; // keep pending

      await addWalletApi.updateAddWalletRequest(transaction._id, {
        admin_remarks: note,
        status,
      });

      alert(`Transaction ${action} successfully.`);
      onClose();
    } catch (error: any) {
      console.error("Error updating wallet request:", error);
      alert("Failed to update transaction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
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

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 p-4 sticky top-0 bg-white z-10">
          <h3 className="text-lg font-semibold text-gray-900">
            Wallet Transaction Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <strong className="text-gray-700">Transaction ID:</strong>{" "}
              {transaction?._id}
            </div>
            <div>
              <strong className="text-gray-700">User ID:</strong>{" "}
              {transaction?.userId?.user_id}
            </div>
            <div>
              <strong className="text-gray-700">Name:</strong>{" "}
              {transaction?.userId?.display_name}
            </div>
            <div>
              <strong className="text-gray-700">Email:</strong>{" "}
              {transaction?.userId?.email}
            </div>
            <div>
              <strong className="text-gray-700">Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                  transaction?.status
                )}`}
              >
                {transaction?.status}
              </span>
            </div>
            <div>
              <strong className="text-gray-700">Requested On:</strong>{" "}
              {new Date(transaction?.createdAt).toLocaleString()}
            </div>
            <div>
              <strong className="text-gray-700">Transfer Type:</strong>{" "}
              {transaction?.transferType}
            </div>
            <div>
              <strong className="text-gray-700">Total Payable:</strong> ₹
              {transaction?.totalPayable}
            </div>
            <div>
              <strong className="text-gray-700">Transaction Charge:</strong> ₹
              {transaction?.transactionCharge}
            </div>
            <div>
              <strong className="text-gray-700">User Remarks: </strong>
              {transaction?.user_remarks}
            </div>
            <div>
              <strong className="text-gray-700">Transfer Account: </strong>
              {transaction?.otherUserId?.user_id || "N/A"}
            </div>
            <div>
              <strong className="text-gray-700">Receive Amount:</strong> ₹
              {transaction?.receiveAmount}
            </div>
          </div>

          <hr className="my-4" />

          {/* Remarks */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="adminNote"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Admin Note
              </label>
              <textarea
                id="adminNote"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Enter remarks..."
              />
            </div>

            {/* Screenshots */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Screenshots
              </label>
              <div className="flex gap-2 flex-wrap">
                {transaction.screenshotUrls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt="screenshot"
                    className="h-20 w-20 object-cover rounded cursor-pointer border"
                    onClick={() => window.open(url, "_blank")}
                  />
                ))}
              </div>
            </div>

            {/* File Upload */}
            {/* <div>
              <label
                htmlFor="proofUpload"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Upload Proof (Image/PDF)
              </label>
              <input
                type="file"
                id="proofUpload"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                accept=".jpg,.jpeg,.png,.pdf"
              />
              <p className="mt-1 text-xs text-gray-500">
                Allowed formats: JPG, PNG, or PDF (Max: 5MB)
              </p>
            </div> */}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center border-t border-gray-200 p-4 sticky bottom-0 bg-white">
          <div className="flex space-x-2">
            <button
              onClick={() => handleAction("Approved")}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              Approve
            </button>

            <button
              onClick={() => {
                if (!note.trim())
                  return alert(
                    "Please provide a reason in the remarks before disapproving."
                  );
                handleAction("Disapproved");
              }}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              Reject
            </button>
            <button
              onClick={() => handleAction("UpdateRemarks")}
              disabled={isSubmitting || note === ""}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50"
            >
              Update Remarks
            </button>
          </div>
          <button
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
