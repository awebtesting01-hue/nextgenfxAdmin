import { Plus, Save, X, DollarSign, Percent, Layers } from 'lucide-react';

interface LevelCommissionFormProps {
    level: number | '';
    fromAmount: number | '';
    toAmount: number | '';
    commissionType: 'flat' | 'percent';
    commissionValue: number | '';
    editingId: string | null;
    submitting: boolean;
    onLevelChange: (value: number | '') => void;
    onFromAmountChange: (value: number | '') => void;
    onToAmountChange: (value: number | '') => void;
    onCommissionTypeChange: (value: 'flat' | 'percent') => void;
    onCommissionValueChange: (value: number | '') => void;
    onSubmit: () => void;
    onReset: () => void;
}

export default function LevelCommissionForm({
    level,
    fromAmount,
    toAmount,
    commissionType,
    commissionValue,
    editingId,
    submitting,
    onLevelChange,
    onFromAmountChange,
    onToAmountChange,
    onCommissionTypeChange,
    onCommissionValueChange,
    onSubmit,
    onReset,
}: LevelCommissionFormProps) {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                        <Plus className="text-indigo-600 text-xl" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Add New Commission Slab</h2>
                        <p className="text-gray-600 text-sm">Create or edit commission slabs</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="p-6 border-b border-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                    {/* Level */}
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Level</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Layers className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                                value={level}
                                onChange={(e) => onLevelChange(e.target.value === '' ? '' : Number(e.target.value))}
                                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 text-sm bg-white hover:border-gray-400 transition-all duration-200"
                                required
                                disabled={submitting}
                            >
                                <option value="">Select Level</option>
                                {Array.from({ length: 15 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>Level {i + 1}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* From Amount */}
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">From Amount</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <DollarSign className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="number"
                                value={fromAmount}
                                onChange={(e) => onFromAmountChange(e.target.value === '' ? '' : Number(e.target.value))}
                                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 text-sm bg-white hover:border-gray-400 transition-all duration-200"
                                placeholder="e.g. 1000"
                                min="0"
                                step="0.01"
                                required
                                disabled={submitting}
                            />
                        </div>
                    </div>

                    {/* To Amount */}
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">To Amount</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <DollarSign className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="number"
                                value={toAmount}
                                onChange={(e) => onToAmountChange(e.target.value === '' ? '' : Number(e.target.value))}
                                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 text-sm bg-white hover:border-gray-400 transition-all duration-200"
                                placeholder="Leave empty for 'Above'"
                                min="0"
                                step="0.01"
                                disabled={submitting}
                            />
                        </div>
                    </div>

                    {/* Commission Type */}
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Commission Type</label>
                        <div className="flex rounded-xl shadow-sm border border-gray-300 overflow-hidden">
                            <button
                                type="button"
                                onClick={() => onCommissionTypeChange('flat')}
                                disabled={submitting}
                                className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 ${commissionType === 'flat'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <DollarSign className="h-4 w-4" />
                                Flat
                            </button>
                            <button
                                type="button"
                                onClick={() => onCommissionTypeChange('percent')}
                                disabled={submitting}
                                className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 ${commissionType === 'percent'
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <Percent className="h-4 w-4" />
                                Percent
                            </button>
                        </div>
                    </div>

                    {/* Commission Value */}
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {commissionType === 'flat' ? 'Amount' : 'Percentage'}
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                {commissionType === 'flat' ? (
                                    <DollarSign className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <Percent className="h-5 w-5 text-gray-400" />
                                )}
                            </div>
                            <input
                                type="number"
                                value={commissionValue}
                                onChange={(e) => onCommissionValueChange(e.target.value === '' ? '' : Number(e.target.value))}
                                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 text-sm bg-white hover:border-gray-400 transition-all duration-200"
                                placeholder={commissionType === 'flat' ? 'e.g. 50' : 'e.g. 2.5'}
                                min="0"
                                step={commissionType === 'percent' ? '0.1' : '0.01'}
                                required
                                disabled={submitting}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="lg:col-span-2 flex gap-2">
                        <button
                            type="button"
                            onClick={onSubmit}
                            disabled={submitting}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
                        >
                            <Save className="h-5 w-5" />
                            {submitting ? 'Processing...' : editingId ? 'Update' : 'Add'}
                        </button>
                        {editingId && (
                            <button
                                type="button"
                                onClick={onReset}
                                disabled={submitting}
                                className="px-3 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}