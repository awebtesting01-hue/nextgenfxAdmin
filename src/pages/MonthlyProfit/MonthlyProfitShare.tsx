import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  DollarSign,
  Percent,
  Settings,
  Save,
  X,
  Filter,
  Database,
  Clock,
} from "lucide-react";
import { monthlyProfitShareApi } from "../../apis/monthlyProfitShareApi";

interface ProfitShareSlab {
  _id?: string;
  level: number;
  from_amount: number;
  to_amount: number | null;
  profit_share_type: "flat" | "percent";
  profit_share_value: number;
  commission_percentage: number; // ✅ NEW FIELD
  is_active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function MonthlyProfitSetting() {
  const [slabs, setSlabs] = useState<ProfitShareSlab[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [level, setLevel] = useState("");
  const [fromAmount, setFromAmount] = useState<number | "">("");
  const [toAmount, setToAmount] = useState<number | "">("");
  const [type, setType] = useState<"flat" | "percent">("flat");
  const [value, setValue] = useState<number | "">("");
  const [commission, setCommission] = useState<number | "">(""); // ✅ NEW STATE

  const levels = Array.from({ length: 15 }, (_, i) => i + 1);

  // ✅ Fetch all slabs on mount
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await monthlyProfitShareApi.getAllProfitShares();
        console.log("Fetched shares:", response?.shares);
        setSlabs(response?.shares || []);
      } catch (err: any) {
        alert(err.message || "Failed to fetch profit share slabs");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async () => {
    if (!level || fromAmount === "" || value === "" || commission === "") {
      alert("Please fill all required fields");
      return;
    }

    const levelNumber = parseInt(level);
    const newFrom = Number(fromAmount);
    const newTo = toAmount === "" ? null : Number(toAmount);
    const newValue = Number(value);
    const newCommission = Number(commission);

    // Validation checks
    if (levelNumber < 1 || levelNumber > 15) {
      alert("Level must be between 1 and 15");
      return;
    }

    if (newFrom < 0) {
      alert("From amount cannot be negative");
      return;
    }

    if (newTo !== null && newTo <= newFrom) {
      alert("To amount must be greater than from amount");
      return;
    }

    if (newValue < 0 || newCommission < 0) {
      alert("Values cannot be negative");
      return;
    }

    if (type === "percent" && (newValue > 100 || newCommission > 100)) {
      alert("Percentage values cannot exceed 100%");
      return;
    }

    // 🚫 Prevent overlap for the same level
    const overlap = slabs.some((slab) => {
      if (slab.level !== levelNumber || slab._id === editingId) return false;

      const existingFrom = slab.from_amount;
      const existingTo = slab.to_amount ?? Infinity;

      const overlaps =
        (newFrom >= existingFrom && newFrom <= existingTo) ||
        (newTo !== null && newTo >= existingFrom && newTo <= existingTo) ||
        (newFrom <= existingFrom && (newTo === null || newTo >= existingTo));

      return overlaps;
    });

    if (overlap) {
      alert(
        `❌ Range overlaps with an existing slab for Level ${levelNumber}. Please adjust your range.`
      );
      return;
    }

    const newSlab: ProfitShareSlab = {
      level: levelNumber,
      from_amount: newFrom,
      to_amount: newTo,
      profit_share_type: type,
      profit_share_value: newValue,
      commission_percentage: newCommission, // ✅ Include commission
    };

    try {
      setLoading(true);
      if (editingId) {
        // ✅ Update existing
        await monthlyProfitShareApi.updateProfitShare(editingId, newSlab);
        setSlabs((prev) =>
          prev.map((s) => (s._id === editingId ? { ...s, ...newSlab } : s))
        );
        setEditingId(null);
      } else {
        // ✅ Create new
        const created = await monthlyProfitShareApi.createProfitShare(newSlab);
        setSlabs([...slabs, created.data || created]);
      }

      resetForm();
      alert(
        editingId
          ? "Configuration updated successfully!"
          : "Configuration added successfully!"
      );

      // Re-fetch all slabs after save
      const response = await monthlyProfitShareApi.getAllProfitShares();
      setSlabs(response?.shares || []);
    } catch (err: any) {
      alert(err.message || "Failed to save data");
    } finally {
      setLoading(false);
    }
  };

  const editSlab = (id: string) => {
    const slabToEdit = slabs.find((slab) => slab._id === id);
    if (!slabToEdit) return;

    setLevel(slabToEdit.level.toString());
    setFromAmount(slabToEdit.from_amount);
    setToAmount(slabToEdit.to_amount ?? "");
    setType(slabToEdit.profit_share_type);
    setValue(slabToEdit.profit_share_value);
    setCommission(slabToEdit.commission_percentage); // ✅ Load commission value
    setEditingId(id);
  };

  const deleteSlab = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this slab?")) return;
    try {
      await monthlyProfitShareApi.deleteProfitShare(id);
      setSlabs(slabs.filter((slab) => slab._id !== id));
      alert("Configuration deleted successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to delete slab");
    }
  };

  const resetForm = () => {
    setLevel("");
    setFromAmount("");
    setToAmount("");
    setType("flat");
    setValue("");
    setCommission(""); // ✅ Reset commission
    setEditingId(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
            <Settings className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Profit Share Settings
            </h1>
            <p className="text-gray-600">
              Configure flat or percentage-based profit share per level.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-10">
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Plus className="text-indigo-600 text-xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {editingId ? "Edit Configuration" : "Add New Configuration"}
            </h2>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            {/* Level */}
            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Level *
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                <option value="">Select Level</option>
                {levels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    Level {lvl}
                  </option>
                ))}
              </select>
            </div>

            {/* From Amount */}
            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                From Amount *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  value={fromAmount}
                  onChange={(e) =>
                    setFromAmount(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  min="0"
                  step="1"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="0"
                />
              </div>
            </div>

            {/* To Amount */}
            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                To Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  value={toAmount}
                  onChange={(e) =>
                    setToAmount(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  min="0"
                  step="1"
                  placeholder="Leave empty for 'Above'"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Type */}
            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Type *
              </label>
              <div className="flex rounded-xl border border-gray-300 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setType("flat")}
                  className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-1 ${
                    type === "flat"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <DollarSign className="h-4 w-4" /> Flat
                </button>
                <button
                  type="button"
                  onClick={() => setType("percent")}
                  className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-1 ${
                    type === "percent"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Percent className="h-4 w-4" /> Percent
                </button>
              </div>
            </div>

            {/* Profit Share Value */}
            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {type === "flat"
                  ? "Own Account Amount *"
                  : "Own Account Percentage *"}
              </label>
              <div className="relative">
                {type === "flat" ? (
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                ) : (
                  <Percent className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                )}
                <input
                  type="number"
                  value={value}
                  onChange={(e) =>
                    setValue(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  min="0"
                  step={type === "percent" ? "0.1" : "1"}
                  max={type === "percent" ? "100" : undefined}
                  placeholder={type === "flat" ? "e.g. 50" : "e.g. 2.5"}
                  className={`w-full py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm ${
                    type === "flat" ? "pl-10 pr-3" : "pl-3 pr-10"
                  }`}
                />
              </div>
            </div>

            {/* Commission Percentage */}
            <div className="md:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Commission Percentage *
              </label>
              <div className="relative">
                <Percent className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  value={commission}
                  onChange={(e) =>
                    setCommission(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="e.g. 5"
                  className="w-full py-3 pl-3 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="md:col-span-3 flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-5 w-5" />
                {loading ? "Saving..." : editingId ? "Update" : "Add"}
              </button>
              {editingId && (
                <button
                  onClick={resetForm}
                  disabled={loading}
                  className="p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Filter className="text-emerald-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Configurations
              </h3>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {slabs.length} {slabs.length === 1 ? "item" : "items"}
              </span>
            </div>
            {slabs.length > 0 && (
              <div className="text-sm text-gray-500">
                Sorted by Level → From Amount
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Range
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Own Account
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Commission %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {slabs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Database className="h-8 w-8 text-gray-400" />
                        <p className="text-gray-500 font-medium">
                          No configurations yet
                        </p>
                        <p className="text-sm text-gray-400">
                          Add your first profit share slab above
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  slabs
                    .sort((a, b) => {
                      if (a.level !== b.level) return a.level - b.level;
                      return a.from_amount - b.from_amount;
                    })
                    .map((slab, index) => (
                      <tr key={slab._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Level {slab.level}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatCurrency(slab.from_amount)} →{" "}
                          {slab.to_amount !== null
                            ? formatCurrency(slab.to_amount)
                            : "Above"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {slab.profit_share_type === "flat" ? "$" : ""}
                          {slab.profit_share_value}
                          {slab.profit_share_type === "percent" ? "%" : ""}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {slab.commission_percentage}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              slab.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {slab.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-gray-400" />
                            {slab.createdAt
                              ? formatDate(slab.createdAt)
                              : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => editSlab(slab._id!)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteSlab(slab._id!)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
      </div>
    </div>
  );
}
