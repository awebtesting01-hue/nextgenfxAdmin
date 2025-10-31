// pages/DirectReferralBonus.tsx
import { useState, useEffect } from 'react';
import { Users, AlertCircle } from 'lucide-react';
import { referralBonusApi, ReferralBonus, CreateReferralBonusData } from '../../apis/referralBonusApi';
import BonusStats from './areas/BonusStats';
import BonusForm from './areas/BonusForm';
import BonusTable from './areas/BonusTable';

export default function DirectReferralBonus() {
    const [bonuses, setBonuses] = useState<ReferralBonus[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form state
    const [level, setLevel] = useState<number | ''>('');
    const [fromAmount, setFromAmount] = useState<number | ''>('');
    const [toAmount, setToAmount] = useState<number | ''>('');
    const [commissionType, setCommissionType] = useState<'flat' | 'percent'>('flat');
    const [commissionValue, setCommissionValue] = useState<number | ''>('');

    // Fetch bonuses on component mount
    useEffect(() => {
        fetchBonuses();
    }, []);

    const fetchBonuses = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await referralBonusApi.getAll();
            setBonuses(response.data.bonuses);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch bonus slabs');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (level === '' || fromAmount === '' || commissionValue === '') {
            setError('Please fill all required fields');
            return;
        }

        if (commissionType === 'percent' && Number(commissionValue) > 100) {
            setError('Percentage commission cannot exceed 100%');
            return;
        }

        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const data: CreateReferralBonusData = {
                level: Number(level),
                from_amount: Number(fromAmount),
                to_amount: toAmount === '' ? null : Number(toAmount),
                commission_type: commissionType,
                commission_value: Number(commissionValue)
            };

            if (editingId) {
                const response = await referralBonusApi.update(editingId, data);
                setBonuses(bonuses.map(bonus =>
                    bonus._id === editingId ? response.data.bonus : bonus
                ));
                setSuccess('Bonus slab updated successfully');
            } else {
                const response = await referralBonusApi.create(data);
                setBonuses([...bonuses, response.data.bonus]);
                setSuccess('Bonus slab created successfully');
            }

            resetForm();
        } catch (err: any) {
            setError(err.message || 'Failed to save bonus slab');
        } finally {
            setSubmitting(false);
        }
    };

    const editBonus = (id: string) => {
        const bonusToEdit = bonuses.find(bonus => bonus._id === id);
        if (!bonusToEdit) return;

        setLevel(bonusToEdit.level);
        setFromAmount(bonusToEdit.from_amount);
        setToAmount(bonusToEdit.to_amount ?? '');
        setCommissionType(bonusToEdit.commission_type);
        setCommissionValue(bonusToEdit.commission_value);
        setEditingId(id);
    };

    const deleteBonus = async (id: string) => {
        if (!confirm('Are you sure you want to delete this bonus slab?')) {
            return;
        }

        setLoading(true);
        setError('');
        try {
            await referralBonusApi.delete(id);
            setBonuses(bonuses.filter(bonus => bonus._id !== id));
            setSuccess('Bonus slab deleted successfully');

            if (editingId === id) {
                resetForm();
            }
        } catch (err: any) {
            setError(err.message || 'Failed to delete bonus slab');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setLevel('');
        setFromAmount('');
        setToAmount('');
        setCommissionType('flat');
        setCommissionValue('');
        setEditingId(null);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                            <Users className="text-white text-2xl" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Direct Referral Bonus
                            </h1>
                            <p className="text-gray-600">Configure referral bonus slabs for different levels</p>
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
                <BonusStats bonuses={bonuses} />

                {/* Main Content */}
                <div className="space-y-6">
                    <BonusForm
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

                    <BonusTable
                        bonuses={bonuses}
                        loading={loading}
                        onRefresh={fetchBonuses}
                        onEdit={editBonus}
                        onDelete={deleteBonus}
                        formatDate={formatDate}
                    />
                </div>
            </div>
        </div>
    );
}