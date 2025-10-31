
import { Database, TrendingUp, BarChart3, Target, Calendar, Clock } from 'lucide-react';

interface BonusStatsProps {
    bonuses: any[];
}

export default function BonusStats({ bonuses }: BonusStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <Database className="text-blue-600 text-xl" />
                    </div>
                    <div className="bg-green-100 p-2 rounded-full">
                        <TrendingUp className="text-green-600 text-sm" />
                    </div>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Total Slabs</p>
                    <p className="text-3xl font-bold text-gray-900">{bonuses.length}</p>
                    <p className="text-sm text-blue-600 font-medium">Active configurations</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                    <div className="bg-emerald-100 p-3 rounded-full">
                        <BarChart3 className="text-emerald-600 text-xl" />
                    </div>
                    <div className="bg-blue-100 p-2 rounded-full">
                        <Target className="text-blue-600 text-sm" />
                    </div>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Levels Covered</p>
                    <p className="text-3xl font-bold text-gray-900">
                        {new Set(bonuses.map(b => b.level)).size || 0}
                    </p>
                    <p className="text-sm text-emerald-600 font-medium">Different levels</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                        <Calendar className="text-purple-600 text-xl" />
                    </div>
                    <div className="bg-orange-100 p-2 rounded-full">
                        <Clock className="text-orange-600 text-sm" />
                    </div>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Last Updated</p>
                    <p className="text-3xl font-bold text-gray-900">
                        {bonuses.length > 0 ? 'Today' : 'None'}
                    </p>
                    <p className="text-sm text-purple-600 font-medium">Recent activity</p>
                </div>
            </div>
        </div>
    );
}