import {
  Hash,
  Layers,
  DollarSign,
  Target,
  Clock,
  Edit2,
  Trash2,
  Filter,
  Database,
  RefreshCw,
  Percent,
} from "lucide-react";
import { LevelCommission } from "../../../apis/levelCommissionApi";

interface LevelCommissionTableProps {
  commissions: LevelCommission[];
  loading: boolean;
  onRefresh: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  formatDate: (dateString: string) => string;
}

export default function LevelCommissionTable({
  commissions,
  loading,
  onRefresh,
  onEdit,
  onDelete,
  formatDate,
}: LevelCommissionTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Filter className="text-emerald-600 text-lg" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Commission Slabs
            </h3>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {commissions.length} items
            </span>
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />#
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Level
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Amount Range
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Commission
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Created
                </div>
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {commissions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-gray-100 p-4 rounded-full">
                      <Database className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium text-gray-500">
                      {loading
                        ? "Loading commissions..."
                        : "No commission slabs yet"}
                    </p>
                    <p className="text-sm text-gray-400">
                      Add your first commission slab above
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              commissions.map((commission, index) => (
                <tr
                  key={commission?._id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <Layers className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Level {commission?.level}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        ${commission?.from_amount.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400">→</span>
                      <span className="text-sm font-medium text-gray-900">
                        {commission?.to_amount !== null
                          ? `$${commission?.to_amount?.toLocaleString()}`
                          : "Above"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {commission?.commission_type === "flat" ? (
                        <div className="bg-green-100 p-1 rounded">
                          <DollarSign className="h-3 w-3 text-green-600" />
                        </div>
                      ) : (
                        <div className="bg-purple-100 p-1 rounded">
                          <Percent className="h-3 w-3 text-purple-600" />
                        </div>
                      )}
                      <span className="text-sm font-semibold text-gray-900">
                        {commission?.commission_type === "flat" ? "$" : ""}
                        {commission?.commission_value.toLocaleString()}
                        {commission?.commission_type === "percent" ? "%" : ""}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {formatDate(commission?.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end items-center gap-2">
                      <button
                        onClick={() => onEdit(commission?._id)}
                        disabled={loading}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(commission?._id)}
                        disabled={loading}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
