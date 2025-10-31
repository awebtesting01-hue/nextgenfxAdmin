import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  DollarSign,
  Percent,
  ArrowUpRight,
  Save,
  X,
  Hash,
  Database,
  CreditCard,
} from "lucide-react";
import { withdrawalChargeTransactionFeeApi } from "../../apis/withdrawlTransactionFee";

export default function WithdrawalCharge() {
  const [fees, setFees] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [fromAmount, setFromAmount] = useState<number | "">("");
  const [toAmount, setToAmount] = useState<number | "">("");
  const [type, setType] = useState<"flat" | "percent">("flat");
  const [value, setValue] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  // Fetch all fees on load
  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await withdrawalChargeTransactionFeeApi.getAllFees();
        setFees(res.data);
      } catch (err: any) {
        alert(err.message || "Failed to fetch withdrawal charges");
      }
    };
    fetchFees();
  }, []);

  const handleSubmit = async () => {
    if (fromAmount === "" || value === "") {
      alert("Please fill all required fields");
      return;
    }

    if (toAmount !== "" && Number(toAmount) <= Number(fromAmount)) {
      alert("'To Amount' must be greater than 'From Amount'");
      return;
    }

    const payload = {
      fromAmount: Number(fromAmount),
      toAmount: toAmount === "" ? null : Number(toAmount),
      type,
      value: Number(value),
    };

    setLoading(true);
    try {
      if (editingId) {
        const res = await withdrawalChargeTransactionFeeApi.updateFee(
          editingId,
          payload
        );
        setFees(fees.map((f) => (f._id === editingId ? res.data : f)));
        setEditingId(null);
      } else {
        const res = await withdrawalChargeTransactionFeeApi.createFee(payload);
        setFees(
          [...fees, res.data].sort((a, b) => a.fromAmount - b.fromAmount)
        );
      }
      resetForm();
    } catch (err: any) {
      alert(err.message || "Failed to save withdrawal charge");
    } finally {
      setLoading(false);
    }
  };

  const editFee = (id: string) => {
    const feeToEdit = fees.find((fee) => fee._id === id);
    if (!feeToEdit) return;

    setFromAmount(feeToEdit.fromAmount);
    setToAmount(feeToEdit.toAmount ?? "");
    setType(feeToEdit.type);
    setValue(feeToEdit.value);
    setEditingId(id);
  };

  const deleteFee = async (id: string) => {
    if (!confirm("Are you sure you want to delete this fee? ")) return;
    console.log({ id });
    try {
      await withdrawalChargeTransactionFeeApi.deleteFee(id);
      setFees(fees.filter((fee) => fee._id !== id));
      if (editingId === id) resetForm();
    } catch (err: any) {
      alert(err.message || "Failed to delete fee");
    }
  };

  const resetForm = () => {
    setFromAmount("");
    setToAmount("");
    setType("flat");
    setValue("");
    setEditingId(null);
  };

  const formatValue = (type: "flat" | "percent", value: number) =>
    type === "flat" ? `$${value.toFixed(2)}` : `${value}%`;

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
              <CreditCard className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Withdrawal Charge
              </h1>
              <p className="text-gray-600">
                Configure withdrawal charges for different amount ranges
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          {/* Form Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Plus className="text-indigo-600 text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Add New Charge Slab
                </h2>
                <p className="text-gray-600 text-sm">
                  Create or edit withdrawal charge slabs
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 border-b border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
              {/* From Amount */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  From Amount *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={fromAmount}
                    onChange={(e) =>
                      setFromAmount(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 text-sm bg-white hover:border-gray-400 transition-all duration-200"
                    placeholder="e.g. 15"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              {/* To Amount */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  To Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={toAmount}
                    onChange={(e) =>
                      setToAmount(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 text-sm bg-white hover:border-gray-400 transition-all duration-200"
                    placeholder="Leave empty for 'Above'"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Type */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type *
                </label>
                <div className="flex rounded-xl shadow-sm border border-gray-300 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setType("flat")}
                    className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
                      type === "flat"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <DollarSign className="h-4 w-4" />
                    Flat
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("percent")}
                    className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 ${
                      type === "percent"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Percent className="h-4 w-4" />
                    Percent
                  </button>
                </div>
              </div>

              {/* Value */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {type === "flat" ? "Charge Amount *" : "Charge Percentage *"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {type === "flat" ? (
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Percent className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) =>
                      setValue(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 text-sm bg-white hover:border-gray-400 transition-all duration-200"
                    placeholder={type === "flat" ? "e.g. 1.5" : "e.g. 2"}
                    min="0"
                    step={type === "percent" ? "0.1" : "0.01"}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="lg:col-span-1 flex gap-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
                >
                  {editingId ? (
                    <Save className="h-5 w-5" />
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                  {editingId ? "Update" : "Add"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-3 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <Percent className="text-emerald-600 text-lg" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Withdrawal Charge Slabs
                </h3>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {fees.length} items
                </span>
              </div>
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
                      <DollarSign className="h-4 w-4" />
                      From Amount
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      To Amount
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Type
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="h-4 w-4" />
                      Charge Value
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="bg-gray-100 p-4 rounded-full">
                          <Database className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-lg font-medium text-gray-500">
                          No charge slabs yet
                        </p>
                        <p className="text-sm text-gray-400">
                          Add your first withdrawal charge slab above
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  fees.length > 0 &&
                  fees.map((fee, index) => (
                    <tr
                      key={fee.id}
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${fee.fromAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {fee.toAmount !== null
                          ? `$${fee.toAmount.toFixed(2)}`
                          : "Above"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {fee.type === "flat" ? (
                            <div className="bg-green-100 p-1 rounded">
                              <DollarSign className="h-3 w-3 text-green-600" />
                            </div>
                          ) : (
                            <div className="bg-purple-100 p-1 rounded">
                              <Percent className="h-3 w-3 text-purple-600" />
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-900">
                            {fee.type.charAt(0).toUpperCase() +
                              fee.type.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatValue(fee.type, fee.value)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button
                            onClick={() => editFee(fee._id)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteFee(fee._id)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
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
