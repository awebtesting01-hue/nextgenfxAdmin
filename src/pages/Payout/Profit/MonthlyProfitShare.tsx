import { useState } from 'react';
import { FiDollarSign, FiCalendar, FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface ProfitData {
    year: number;
    months: {
        month: string;
        amount: number;
        sharePercentage: number;
    }[];
}

export default function MonthlyProfitShare() {
    const [expandedYear, setExpandedYear] = useState<number | null>(2023);
    const [selectedView, setSelectedView] = useState<'amount' | 'percentage'>('amount');

    // Sample data - in a real app, this would come from an API
    const profitData: ProfitData[] = [
        {
            year: 2023,
            months: [
                { month: 'January', amount: 12500, sharePercentage: 25 },
                { month: 'February', amount: 11800, sharePercentage: 23.6 },
                { month: 'March', amount: 14200, sharePercentage: 28.4 },
                { month: 'April', amount: 9800, sharePercentage: 19.6 },
                { month: 'May', amount: 15600, sharePercentage: 31.2 },
                { month: 'June', amount: 13400, sharePercentage: 26.8 },
                { month: 'July', amount: 17200, sharePercentage: 34.4 },
                { month: 'August', amount: 18900, sharePercentage: 37.8 },
                { month: 'September', amount: 16500, sharePercentage: 33 },
                { month: 'October', amount: 20300, sharePercentage: 40.6 },
                { month: 'November', amount: 21800, sharePercentage: 43.6 },
                { month: 'December', amount: 24500, sharePercentage: 49 },
            ],
        },
        {
            year: 2022,
            months: [
                { month: 'January', amount: 9800, sharePercentage: 19.6 },
                { month: 'February', amount: 8700, sharePercentage: 17.4 },
                { month: 'March', amount: 10500, sharePercentage: 21 },
                { month: 'April', amount: 9200, sharePercentage: 18.4 },
                { month: 'May', amount: 11200, sharePercentage: 22.4 },
                { month: 'June', amount: 12400, sharePercentage: 24.8 },
                { month: 'July', amount: 13800, sharePercentage: 27.6 },
                { month: 'August', amount: 14500, sharePercentage: 29 },
                { month: 'September', amount: 13200, sharePercentage: 26.4 },
                { month: 'October', amount: 15700, sharePercentage: 31.4 },
                { month: 'November', amount: 16800, sharePercentage: 33.6 },
                { month: 'December', amount: 19500, sharePercentage: 39 },
            ],
        },
    ];

    const toggleYear = (year: number) => {
        setExpandedYear(expandedYear === year ? null : year);
    };

    const formatValue = (value: number) => {
        return selectedView === 'amount'
            ? `$${value.toLocaleString()}`
            : `${value}%`;
    };

    const getBarColor = (value: number) => {
        if (selectedView === 'amount') {
            return value > 20000 ? 'bg-green-500' : value > 15000 ? 'bg-blue-500' : 'bg-purple-500';
        } else {
            return value > 40 ? 'bg-green-500' : value > 30 ? 'bg-blue-500' : 'bg-purple-500';
        }
    };

    const totalProfit = profitData.reduce((sum, yearData) => {
        return sum + yearData.months.reduce((yearSum, month) => yearSum + month.amount, 0);
    }, 0);

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <FiDollarSign className="text-blue-600" />
                    Monthly Profit Share
                </h2>

                <div className="flex items-center gap-4 mt-3 md:mt-0">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setSelectedView('amount')}
                            className={`px-3 py-1 rounded-md text-sm font-medium ${selectedView === 'amount' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
                        >
                            Amount
                        </button>
                        <button
                            onClick={() => setSelectedView('percentage')}
                            className={`px-3 py-1 rounded-md text-sm font-medium ${selectedView === 'percentage' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
                        >
                            Percentage
                        </button>
                    </div>
                </div>
            </div>

            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">Total Profit Share</p>
                        <p className="text-2xl font-bold text-blue-700">${totalProfit.toLocaleString()}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                        <FiCalendar className="text-blue-600 text-xl" />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {profitData.map((yearData) => (
                    <div key={yearData.year} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => toggleYear(yearData.year)}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="font-semibold text-gray-800">{yearData.year}</span>
                                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                    ${yearData.months.reduce((sum, month) => sum + month.amount, 0).toLocaleString()}
                                </span>
                            </div>
                            {expandedYear === yearData.year ? (
                                <FiChevronUp className="text-gray-500" />
                            ) : (
                                <FiChevronDown className="text-gray-500" />
                            )}
                        </button>

                        {expandedYear === yearData.year && (
                            <div className="divide-y divide-gray-200">
                                {yearData.months.map((monthData) => (
                                    <div key={monthData.month} className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-gray-700">{monthData.month}</span>
                                            <span className="font-semibold">
                                                {formatValue(selectedView === 'amount' ? monthData.amount : monthData.sharePercentage)}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div
                                                className={`h-2.5 rounded-full ${getBarColor(
                                                    selectedView === 'amount' ? monthData.amount : monthData.sharePercentage
                                                )}`}
                                                style={{
                                                    width: `${Math.min(
                                                        100,
                                                        (selectedView === 'amount'
                                                            ? (monthData.amount / 25000) * 100
                                                            : monthData.sharePercentage * 2)
                                                    )}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}