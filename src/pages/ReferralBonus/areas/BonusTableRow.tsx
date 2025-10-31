// components/ReferralBonus/BonusTableRow.tsx
import { Edit2, Trash2, Layers, DollarSign, Percent, Clock } from 'lucide-react';

interface BonusTableRowProps {
    bonus: any;
    index: number;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    formatDate: (dateString: string) => string;
}

export default function BonusTableRow({ bonus, index, onEdit, onDelete, formatDate }: BonusTableRowProps) {
    return (
        <tr key={bonus._id} className="hover:bg-gray-50 transition-colors duration-150">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                        <Layers className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-900">Level {bonus.level}</p>
                        {!bonus.is_active && (
                            <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">Inactive</span>
                        )}
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                        ${bonus.from_amount.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400">→</span>
                    <span className="text-sm font-medium text-gray-900">
                        {bonus.to_amount !== null ? `$${bonus.to_amount.toLocaleString()}` : 'Above'}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                    {bonus.commission_type === 'flat' ? (
                        <div className="bg-green-100 p-1 rounded">
                            <DollarSign className="h-3 w-3 text-green-600" />
                        </div>
                    ) : (
                        <div className="bg-purple-100 p-1 rounded">
                            <Percent className="h-3 w-3 text-purple-600" />
                        </div>
                    )}
                    <span className="text-sm font-semibold text-gray-900">
                        {bonus.commission_type === 'flat' ? '$' : ''}
                        {bonus.commission_value.toLocaleString()}
                        {bonus.commission_type === 'percent' ? '%' : ''}
                    </span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    {formatDate(bonus.createdAt)}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
                <div className="flex justify-end items-center gap-2">
                    <button
                        onClick={() => onEdit(bonus._id)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Edit"
                    >
                        <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onDelete(bonus._id)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}