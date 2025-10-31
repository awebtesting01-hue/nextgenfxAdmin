import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  DollarSign,
  Percent,
  CreditCard,
  ArrowUpRight,
  Save,
  X,
  Hash,
  Database,
} from "lucide-react";
import { transactionFeeApiTransferWallet } from "../../apis/transferWalletTransactionFee";

// Define the TransactionFee type
interface TransactionFee {
  _id: string;
  fromAmount: number;
  toAmount: number | null;
  type: "flat" | "percent";
  value: number;
  createdBy: string;
}

export default function TransferTranscationFee() {
  const [fees, setFees] = useState<TransactionFee[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [type, setType] = useState<"flat" | "percent">("flat");
  const [value, setValue] = useState<string>("");

  // Fetch fees from backend on mount
  useEffect(() => {
    fetchFees();
  }, []);

  console.log({ fees });

  const fetchFees = async () => {
    try {
      const res = await transactionFeeApiTransferWallet.getAllFees();
      console.log({ res });
      const feesResponse = res.data as any[];

      console.log({ feesResponse });
      setFees(feesResponse || []);
    } catch (err) {
      alert((err as Error).message || "Failed to fetch transaction fees");
    }
  };

  const handleSubmit = async () => {
    if (fromAmount === "" || value === "") {
      alert("Please fill all required fields");
      return;
    }

    const fromNum = Number(fromAmount);
    const toNum = toAmount === "" ? null : Number(toAmount);

    if (toNum !== null && fromNum >= toNum) {
      alert("From Amount must be less than To Amount.");
      return;
    }

    // Check for overlap with existing slabs
    const isOverlap = fees?.some((fee) => {
      if (editingId && fee._id === editingId) return false;

      const feeFrom = fee.fromAmount;
      const feeTo = fee.toAmount ?? null;

      if (toNum === null || feeTo === null) return false;

      return fromNum < feeTo && toNum > feeFrom;
    });

    if (isOverlap) {
      alert(
        "Fee range overlaps with an existing slab. Please enter a valid range."
      );
      return;
    }

    // Enforce strict fromAmount > last toAmount
    if (!editingId && fees?.length > 0) {
      const sortedFees = [...fees].sort((a, b) => a.fromAmount - b.fromAmount);
      const lastFee = sortedFees[sortedFees.length - 1];

      if (lastFee.toAmount !== null && fromNum <= lastFee.toAmount) {
        alert(
          `New slab must start after the last slab's toAmount (${lastFee.toAmount}).`
        );
        return;
      }
    }

    const feePayload = {
      fromAmount: fromNum,
      toAmount: toNum,
      type,
      value: Number(value),
      createdBy: "68a9c4f26b35467bd9f5aa39",
    };

    try {
      if (editingId) {
        const res = await transactionFeeApiTransferWallet.updateFee(
          editingId,
          feePayload
        );
        const feeResponse = res.data as TransactionFee;
        setFees(
          fees?.map((fee) => (fee?._id === editingId ? feeResponse : fee))
        );
        setEditingId(null);
      } else {
        const res = await transactionFeeApiTransferWallet.createFee(feePayload);
        const feeResponse = res.data as TransactionFee;
        setFees([...fees, feeResponse]);
      }
      fetchFees();
      resetForm();
    } catch (err) {
      alert((err as Error).message || "Failed to save fee");
    }
  };

  const editFee = (id: string) => {
    const feeToEdit = fees?.find((fee) => fee._id === id);
    if (!feeToEdit) return;

    setFromAmount(feeToEdit.fromAmount.toString());
    setToAmount(feeToEdit.toAmount?.toString() ?? "");
    setType(feeToEdit.type);
    setValue(feeToEdit.value.toString());
    setEditingId(id);
  };

  const deleteFee = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction fee slab?"
    );
    if (!confirmDelete) return;

    try {
      await transactionFeeApiTransferWallet.deleteFee(id);
      setFees(fees?.filter((fee) => fee._id !== id));
      if (editingId === id) resetForm();
    } catch (err) {
      alert((err as Error).message || "Failed to delete fee");
    }
  };

  const resetForm = () => {
    setFromAmount("");
    setToAmount("");
    setType("flat");
    setValue("");
    setEditingId(null);
  };

  const formatValue = (type: "flat" | "percent", value: number) => {
    return type === "flat" ? `$${value.toFixed(2)}` : `${value}%`;
  };
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
                Add Wallet Transaction Fee
              </h1>
              <p className="text-gray-600">
                Configure add wallet transaction fee
              </p>
            </div>
          </div>
        </div>

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
                    setFromAmount(e.target.value === "" ? "" : e.target.value)
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
                    setToAmount(e.target.value === "" ? "" : e.target.value)
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
                {type === "flat" ? "Amount *" : "Percentage *"}
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
                    setValue(e.target.value === "" ? "" : e.target.value)
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
                Add Wallet Transaction Fee Slabs
              </h3>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {fees?.length} items
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
                    Fee Value
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fees?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="bg-gray-100 p-4 rounded-full">
                        <Database className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-lg font-medium text-gray-500">
                        No fee slabs yet
                      </p>
                      <p className="text-sm text-gray-400">
                        Add your first transaction fee slab above
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                fees?.length > 1 &&
                fees?.map((fee, index) => (
                  <tr
                    key={fee._id}
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
                      ${fee?.fromAmount?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {fee.toAmount !== null
                        ? `$${fee?.toAmount?.toFixed(2)}`
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
                          {fee?.type?.charAt(0)?.toUpperCase() +
                            fee?.type?.slice(1)}
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
  );
}
