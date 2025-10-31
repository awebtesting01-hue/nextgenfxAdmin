import { useState, useEffect } from "react";
import {
  FiTarget,
  FiClock,
  FiCheck,
  FiUser,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import { X, Database } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";

type ReferralLog = {
  _id: string;
  referrerId: string;
  isActive: boolean;
  createdAt: string;
};

export default function DefaultReferralAssignment() {
  const [referrerId, setReferrerId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logs, setLogs] = useState<ReferralLog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editReferrerId, setEditReferrerId] = useState("");

  const pageSize = 3;

  // Fetch referrals with pagination
  const fetchLogs = async (page = 1) => {
    try {
      const res = await axiosInstance.get("/admin/get-default-refferal", {
        params: { page, pageSize },
      });

      // Expect API to return { data: [...], currentPage, totalPages }
      const { data, currentPage: cp, totalPages: tp } = res.data.data;
      console.log({ data });
      setLogs(data);
      setCurrentPage(cp);
      setTotalPages(tp);
    } catch (err) {
      console.error("Error fetching logs", err);
    }
  };

  useEffect(() => {
    fetchLogs(currentPage);
  }, [currentPage]);

  // Create new referral
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referrerId.trim()) {
      alert("Please enter a valid Referrer ID");
      return;
    }
    const is_referrer_exist = logs.find(
      (log) => log.referrerId.toLowerCase() === referrerId.toLowerCase()
    );

    if (is_referrer_exist) {
      alert("Already same refferal id exist");
      return;
    }

    setIsSubmitting(true);
    try {
      await axiosInstance.post("/admin/create-default-refferal", {
        userId: "system",
        referrerId: referrerId.trim(),
        isActive: true,
      });
      setReferrerId("");
      fetchLogs(1);
    } catch (err) {
      console.error(err);
      alert("Failed to create referral");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle active status
  // Toggle active status
  const toggleActive = async (id: string, log: ReferralLog) => {
    try {
      await axiosInstance.put(`/admin/update-default-refferal/${id}`, {
        referrerId: log.referrerId,
        isActive: true,
      });
      fetchLogs(currentPage);
    } catch (err) {
      console.error(err);
      alert("Failed to toggle active status");
    }
  };

  // Delete referral
  const deleteReferral = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this referral?"))
      return;
    try {
      await axiosInstance.delete(`/admin/delete-default-refferal/${id}`);
      // If deleting last item on page and page > 1, go back a page
      if (logs.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchLogs(currentPage);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete referral");
    }
  };

  // Start editing a referralId
  const startEdit = (log: ReferralLog) => {
    setEditingId(log._id);
    setEditReferrerId(log.referrerId);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditReferrerId("");
  };

  // Save edited referrerId
  const saveEdit = async () => {
    if (!editReferrerId.trim()) {
      alert("Referrer ID cannot be empty");
      return;
    }
    try {
      await axiosInstance.put(`/admin/update-default-refferal/${editingId}`, {
        referrerId: editReferrerId.trim(),
      });
      setEditingId(null);
      setEditReferrerId("");
      fetchLogs(currentPage);
    } catch (err) {
      console.error(err);
      alert("Failed to update referrer ID");
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
              <FiTarget className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Default Referral Assignment
              </h1>
              <p className="text-gray-600">
                Assign a default referrer for users who register without a
                referral code
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Form Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <FiUser className="text-indigo-600 text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Set Default Referrer
                </h2>
                <p className="text-gray-600 text-sm">
                  Enter the referrer ID to assign as default
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 border-b border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="referrerId"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  <span className="after:content-['*'] after:ml-0.5 after:text-red-500">
                    Referrer ID
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="referrerId"
                    value={referrerId}
                    onChange={(e) => setReferrerId(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 text-sm bg-white hover:border-gray-400 transition-all duration-200"
                    placeholder="e.g., user_9999"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setReferrerId("")}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-medium flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    <>
                      <FiCheck className="h-5 w-5" />
                      Create Default Referrer
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Referral Logs */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <FiClock className="text-emerald-600 text-lg" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">
                Referrer Logs
              </h3>
            </div>

            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                <Database className="h-6 w-6 mb-2" />
                No default referrer assigned yet
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div
                      key={log._id}
                      className={`flex justify-between items-center p-4 rounded-xl border ${
                        log.isActive
                          ? "bg-emerald-100 border-emerald-300"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex flex-col max-w-[70%]">
                        {editingId === log._id ? (
                          <>
                            <input
                              type="text"
                              className="border border-gray-300 rounded px-3 py-1 text-sm"
                              value={editReferrerId}
                              onChange={(e) =>
                                setEditReferrerId(e.target.value)
                              }
                              autoFocus
                            />
                            <div className="mt-1 space-x-2">
                              <button
                                onClick={saveEdit}
                                className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="text-sm bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="font-medium text-sm text-gray-800">
                              Referrer ID: {log.referrerId}
                            </p>
                            <p className="text-xs text-gray-500">
                              Created At:{" "}
                              {new Date(log.createdAt).toLocaleString("en-IN")}
                            </p>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleActive(log._id, log)}
                          className={`px-4 py-1.5 rounded text-sm font-medium transition ${
                            log.isActive
                              ? "bg-red-500 text-white hover:bg-red-600"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {log.isActive ? "Deactivate" : "Set Active"}
                        </button>

                        {editingId !== log._id && (
                          <button
                            onClick={() => startEdit(log)}
                            className="p-2 rounded hover:bg-gray-200 transition"
                            title="Edit Referrer ID"
                          >
                            <FiEdit className="text-gray-600" />
                          </button>
                        )}

                        <button
                          onClick={() => deleteReferral(log._id)}
                          className="p-2 rounded hover:bg-red-100 transition"
                          title="Delete Referral"
                        >
                          <FiTrash2 className="text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center mt-4 gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
