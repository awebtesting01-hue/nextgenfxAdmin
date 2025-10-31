import React, { useEffect, useMemo, useState } from "react";
import { FaSearch, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { userApi } from "../../apis/userApi";

type UserRow = {
  _id: string;
  avatar?: string;
  user_id: string;
  team?: number;
  display_name?: string;
  email?: string;
  phone_number?: string;
  referral_id?: string;
  isActive?: boolean;
  payment_screenshot?: string;
  total_deposit?: number;
  joined_by_referral_id?: string;
};

type SortKey = keyof UserRow;

const ManageUsers: React.FC = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const pageSize = 10;
  const [sortKey, setSortKey] = useState<SortKey>("display_name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("adminAccessToken") || "";
        const res = await userApi.getAllUsers(
          { q, page, pageSize },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Set users and pagination data from API response
        setRows(res?.data?.users || []);
        setTotalPages(res?.data?.totalPages || 1);
        setTotalUsers(res?.data?.total || 0);
      } catch (err: any) {
        setError(err?.message || "Failed to fetch users");
        setRows([]);
        setTotalPages(1);
        setTotalUsers(0);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [q, page]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortedRows = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const va = a?.[sortKey] ?? "";
      const vb = b?.[sortKey] ?? "";
      if (typeof va === "number" && typeof vb === "number")
        return sortDir === "asc" ? va - vb : vb - va;
      if (typeof va === "boolean" && typeof vb === "boolean")
        return sortDir === "asc"
          ? Number(va) - Number(vb)
          : Number(vb) - Number(va);
      return sortDir === "asc"
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  const toggleActive = async (id: string, current: boolean) => {
    try {
      const token = localStorage.getItem("adminAccessToken") || "";
      // API call
      const res = await userApi.toggleUserStatus(id, !current);

      // Update local state if API successful
      setRows((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isActive: !current } : u))
      );
    } catch (err: any) {
      console.error("Failed to toggle user status", err.message);
      alert(err.message || "Failed to toggle status");
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col)
      return <FaSort className="inline-block ml-1 opacity-60" />;
    return sortDir === "asc" ? (
      <FaSortUp className="inline-block ml-1" />
    ) : (
      <FaSortDown className="inline-block ml-1" />
    );
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Manage Users</h1>
        <div className="flex items-center gap-2 w-full md:w-80">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              placeholder="Search by name, email, referral..."
              value={q}
              onChange={(e) => {
                setPage(1);
                setQ(e.target.value);
              }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600 font-medium">
              <tr>
                <th className="px-4 py-3">Avatar</th>
                <th className="px-4 py-3">User Id</th>
                <th
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => toggleSort("team")}
                >
                  Team <img src={SortIcon} alt="sort team" />
                </th>
                <th
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => toggleSort("display_name")}
                >
                  Name <img src={SortIcon} alt="sort display_name" />
                </th>
                <th
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => toggleSort("email")}
                >
                  Email <img src={SortIcon} alt="sort email" />
                </th>
                <th className="px-4 py-3">Mobile</th>
                <th
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => toggleSort("referral_id")}
                >
                  Referral ID <img src={SortIcon} alt="sort referral_id" />
                </th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3">Payment Screenshot</th>
                <th
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => toggleSort("total_deposit")}
                >
                  Total Deposit <img src={SortIcon} alt="sort total_deposit" />
                </th>
                <th className="px-4 py-3">Joined By Referral</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    Loading users…
                  </td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-6 text-center text-red-600"
                  >
                    {error}
                  </td>
                </tr>
              )}
              {!loading && !error && sortedRows.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No users found.
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                sortedRows.map((u) => (
                  <tr key={u._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img
                        src={
                          u.avatar ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                            u.display_name || u.email || "U"
                          )}`
                        }
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-4 py-3">{u.user_id}</td>
                    <td className="px-4 py-3">{u.team ?? 0}</td>
                    <td className="px-4 py-3 font-medium">
                      {u.display_name || "-"}
                    </td>
                    <td className="px-4 py-3">
                      {u.email ? (
                        <a
                          href={`mailto:${u.email}`}
                          className="text-indigo-600 hover:underline"
                        >
                          {u.email}
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-3">{u.phone_number || "-"}</td>
                    <td className="px-4 py-3">{u.referral_id || "-"}</td>

                    {/* Toggle Active/Inactive */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(u._id, !!u.isActive)}
                        className={`relative inline-flex items-center h-6 w-12 rounded-full transition-colors focus:outline-none ${
                          u.isActive ? "bg-green-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block w-5 h-5 transform bg-white rounded-full shadow-md transition-transform ${
                            u.isActive ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </td>

                    <td className="px-4 py-3">
                      {u.payment_screenshot ? (
                        <a
                          href={u.payment_screenshot}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline"
                        >
                          View
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      ${u.total_deposit?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-4 py-3">
                      {u.joined_by_referral_id || "-"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row items-center justify-between px-4 py-3 border-t bg-gray-50 gap-2">
          <div className="text-sm text-gray-600">
            Page <span className="font-medium">{page}</span> of{" "}
            <span className="font-medium">{totalPages}</span> •{" "}
            <span className="font-medium">{totalUsers}</span> total users
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
