import { useState, useEffect } from "react";
import { Layers, AlertCircle } from "lucide-react";
import {
  levelCommissionApi,
  LevelCommission,
  CreateLevelCommissionData,
} from "../../apis/levelCommissionApi";
import LevelCommissionStats from "./areas/LevelCommissionStats";
import LevelCommissionForm from "./areas/LevelCommissionForm";
import LevelCommissionTable from "./areas/LevelCommissionTable";

export default function LevelCommissions() {
  const [commissions, setCommissions] = useState<LevelCommission[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [level, setLevel] = useState<number | "">("");
  const [fromAmount, setFromAmount] = useState<number | "">("");
  const [toAmount, setToAmount] = useState<number | "">("");
  const [commissionType, setCommissionType] = useState<"flat" | "percent">(
    "flat"
  );
  const [commissionValue, setCommissionValue] = useState<number | "">("");

  // Fetch commissions on component mount
  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await levelCommissionApi.getAll();
      setCommissions(response.data.commissions);
    } catch (err: any) {
      setError(err.message || "Failed to fetch commission slabs");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (level === "" || fromAmount === "" || commissionValue === "") {
      setError("Please fill all required fields");
      return;
    }

    if (commissionType === "percent" && Number(commissionValue) > 100) {
      setError("Percentage commission cannot exceed 100%");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");
    await fetchCommissions();

    try {
      const data: CreateLevelCommissionData = {
        level: Number(level),
        from_amount: Number(fromAmount),
        to_amount: toAmount === "" ? null : Number(toAmount),
        commission_type: commissionType,
        commission_value: Number(commissionValue),
      };

      if (editingId) {
        const response = await levelCommissionApi.update(editingId, data);
        setCommissions(
          commissions.map((commission) =>
            commission._id === editingId ? response.data.commission : commission
          )
        );
        setSuccess("Commission slab updated successfully");
      } else {
        const response = await levelCommissionApi.create(data);
        setCommissions([...commissions, response.data.commission]);
        setSuccess("Commission slab created successfully");
      }

      resetForm();
    } catch (err: any) {
      setError(err.message || "Failed to save commission slab");
    } finally {
      setSubmitting(false);
    }
  };

  const editCommission = (id: string) => {
    const commissionToEdit = commissions.find(
      (commission) => commission._id === id
    );
    if (!commissionToEdit) return;

    setLevel(commissionToEdit.level);
    setFromAmount(commissionToEdit.from_amount);
    setToAmount(commissionToEdit.to_amount ?? "");
    setCommissionType(commissionToEdit.commission_type);
    setCommissionValue(commissionToEdit.commission_value);
    setEditingId(id);
  };

  const deleteCommission = async (id: string) => {
    if (!confirm("Are you sure you want to delete this commission slab?")) {
      return;
    }

    setLoading(true);
    setError("");
    try {
      await levelCommissionApi.delete(id);
      setCommissions(commissions.filter((commission) => commission._id !== id));
      setSuccess("Commission slab deleted successfully");

      if (editingId === id) {
        resetForm();
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete commission slab");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setLevel("");
    setFromAmount("");
    setToAmount("");
    setCommissionType("flat");
    setCommissionValue("");
    setEditingId(null);
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
              <Layers className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Level Commissions
              </h1>
              <p className="text-gray-600">
                Configure commission slabs for different levels
              </p>
            </div>
          </div>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-green-600" />
            <p className="text-green-600">{success}</p>
          </div>
        )}

        {/* Stats Cards */}
        <LevelCommissionStats commissions={commissions} />

        {/* Main Content */}
        <div className="space-y-6">
          <LevelCommissionForm
            level={level}
            fromAmount={fromAmount}
            toAmount={toAmount}
            commissionType={commissionType}
            commissionValue={commissionValue}
            editingId={editingId}
            submitting={submitting}
            onLevelChange={setLevel}
            onFromAmountChange={setFromAmount}
            onToAmountChange={setToAmount}
            onCommissionTypeChange={setCommissionType}
            onCommissionValueChange={setCommissionValue}
            onSubmit={handleSubmit}
            onReset={resetForm}
          />

          <LevelCommissionTable
            commissions={commissions}
            loading={loading}
            onRefresh={fetchCommissions}
            onEdit={editCommission}
            onDelete={deleteCommission}
            formatDate={formatDate}
          />
        </div>
      </div>
    </div>
  );
}
