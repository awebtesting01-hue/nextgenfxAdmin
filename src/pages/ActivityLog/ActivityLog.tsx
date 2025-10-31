import { useState } from 'react';
import { FiSearch, FiCalendar, FiDownload, FiChevronDown, FiFilter } from 'react-icons/fi';
import Pagination from '../../utils/Pagination';

interface LogEntry {
    id: string;
    userId: string;
    name: string;
    role: 'User' | 'Admin';
    type: 'Activity' | 'Payout' | 'Level' | 'Plan';
    status: 'Success' | 'Pending' | 'Failed';
    description: string;
    generatedOn: string;
    ipLocation: string;
    device: string;
    actionBy: string;
}

interface SummaryStats {
    total: number;
    success: number;
    pending: number;
    failed: number;
}

interface SortConfig {
    key: keyof LogEntry;
    direction: 'asc' | 'desc';
}

export default function ActivityLog() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRole, setSelectedRole] = useState<string>('All');
    const [selectedType, setSelectedType] = useState<string>('All');
    const [selectedStatus, setSelectedStatus] = useState<string>('All');
    const [selectedActionBy, setSelectedActionBy] = useState<string>('All');
    const [showFilters, setShowFilters] = useState(false);
    const itemsPerPage = 10;

    const [logs] = useState<LogEntry[]>([
        {
            id: 'L001',
            userId: 'U001',
            name: 'John Doe',
            role: 'User',
            type: 'Activity',
            status: 'Success',
            description: 'Login from new device',
            generatedOn: '2025-08-09 14:35:22',
            ipLocation: '192.168.1.10 / Delhi',
            device: 'Chrome / Windows',
            actionBy: 'User'
        },
        {
            id: 'L002',
            userId: 'U002',
            name: 'Jane Smith',
            role: 'Admin',
            type: 'Payout',
            status: 'Pending',
            description: 'Payout ₹1,500 initiated',
            generatedOn: '2025-07-28 10:12:09',
            ipLocation: '192.168.1.11 / Mumbai',
            device: 'Safari / Mac',
            actionBy: 'Admin'
        },
        ...Array.from({ length: 45 }, (_, i) => ({
            id: `L${100 + i}`,
            userId: `U${100 + i}`,
            name: ['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis'][Math.floor(Math.random() * 4)],
            role: (Math.random() > 0.7 ? 'Admin' : 'User') as 'User' | 'Admin',
            type: ['Activity', 'Payout', 'Level', 'Plan'][Math.floor(Math.random() * 4)] as 'Activity' | 'Payout' | 'Level' | 'Plan',
            status: ['Success', 'Pending', 'Failed'][Math.floor(Math.random() * 3)] as 'Success' | 'Pending' | 'Failed',
            description: ['Login attempt', 'Password change', 'Payout request', 'Profile update'][Math.floor(Math.random() * 4)],
            generatedOn: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleString(),
            ipLocation: `192.168.1.${Math.floor(Math.random() * 100)} / ${['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad'][Math.floor(Math.random() * 4)]}`,
            device: `${['Chrome', 'Firefox', 'Safari', 'Edge'][Math.floor(Math.random() * 4)]} / ${['Windows', 'Mac', 'Linux', 'Android'][Math.floor(Math.random() * 4)]}`,
            actionBy: (Math.random() > 0.7 ? 'Admin' : 'User') as 'User' | 'Admin'
        }))
    ]);

    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

    const todayStr = new Date().toISOString().split('T')[0];

    const filteredLogs = logs.filter((log) => {
        // Basic search filter
        const matchesSearch = searchTerm === '' ||
            log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.ipLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.device.toLowerCase().includes(searchTerm.toLowerCase());

        // Date range filter
        const logDate = log.generatedOn.split(' ')[0];
        const matchesStartDate = startDate === '' || logDate >= startDate;
        const matchesEndDate = endDate === '' || logDate <= endDate;

        // Role filter
        const matchesRole = selectedRole === 'All' || log.role === selectedRole;

        // Type filter
        const matchesType = selectedType === 'All' || log.type === selectedType;

        // Status filter
        const matchesStatus = selectedStatus === 'All' || log.status === selectedStatus;

        // Action By filter
        const matchesActionBy = selectedActionBy === 'All' || log.actionBy === selectedActionBy;

        return matchesSearch && matchesStartDate && matchesEndDate &&
            matchesRole && matchesType && matchesStatus && matchesActionBy;
    });

    const sortedLogs = [...filteredLogs];
    if (sortConfig !== null) {
        sortedLogs.sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedLogs.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedLogs.length / itemsPerPage);

    const requestSort = (key: keyof LogEntry) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleTodayClick = () => {
        setStartDate(todayStr);
        setEndDate(todayStr);
        setCurrentPage(1);
    };

    const handleLast7DaysClick = () => {
        const d = new Date();
        const last7 = new Date(d.setDate(d.getDate() - 7)).toISOString().split('T')[0];
        setStartDate(last7);
        setEndDate(todayStr);
        setCurrentPage(1);
    };

    const handleLast30DaysClick = () => {
        const d = new Date();
        const last30 = new Date(d.setDate(d.getDate() - 30)).toISOString().split('T')[0];
        setStartDate(last30);
        setEndDate(todayStr);
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setStartDate('');
        setEndDate('');
        setSelectedRole('All');
        setSelectedType('All');
        setSelectedStatus('All');
        setSelectedActionBy('All');
        setCurrentPage(1);
    };



    const getBadgeClass = (type: string): string => {
        switch (type) {
            case 'User': return 'bg-yellow-100 text-yellow-800';
            case 'Admin': return 'bg-indigo-100 text-indigo-800';
            case 'Activity': return 'bg-blue-100 text-blue-800';
            case 'Payout': return 'bg-green-100 text-green-800';
            case 'Level': return 'bg-amber-100 text-amber-800';
            case 'Plan': return 'bg-pink-100 text-pink-800';
            case 'Success': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const summary: SummaryStats = {
        total: filteredLogs.length,
        success: filteredLogs.filter(log => log.status === 'Success').length,
        pending: filteredLogs.filter(log => log.status === 'Pending').length,
        failed: filteredLogs.filter(log => log.status === 'Failed').length
    };

    return (
        <div className="bg-gray-50 min-h-screen p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <h4 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Activity Logs</h4>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-sm text-gray-500">Total Logs</div>
                        <div className="text-lg font-semibold">{summary.total}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-sm text-gray-500">Success</div>
                        <div className="text-lg font-semibold text-green-600">{summary.success}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-sm text-gray-500">Pending</div>
                        <div className="text-lg font-semibold text-yellow-600">{summary.pending}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="text-sm text-gray-500">Failed</div>
                        <div className="text-lg font-semibold text-red-600">{summary.failed}</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-xs">
                            <input
                                type="text"
                                placeholder="🔍 Search by ID, Name, Description, etc."
                                className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 bg-gray-50 shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition text-sm placeholder-gray-400"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500">
                                <FiSearch size={18} />
                            </span>
                        </div>

                        {/* Calendar Range */}
                        <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-200 shadow flex-1 max-w-md">
                            <FiCalendar className="text-indigo-500" size={18} />
                            <input
                                type="date"
                                className="rounded-full border border-gray-300 bg-white px-3 py-1 shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm transition w-32"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <span className="text-sm text-gray-500 mx-2">to</span>
                            <input
                                type="date"
                                className="rounded-full border border-gray-300 bg-white px-3 py-1 shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm transition w-32"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>

                        {/* Quick Filters */}
                        <div className="flex gap-2">
                            <button
                                onClick={handleTodayClick}
                                className="px-3 py-2 rounded-full text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 shadow transition"
                            >
                                Today
                            </button>
                            <button
                                onClick={handleLast7DaysClick}
                                className="px-3 py-2 rounded-full text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 shadow transition"
                            >
                                7 Days
                            </button>
                            <button
                                onClick={handleLast30DaysClick}
                                className="px-3 py-2 rounded-full text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 shadow transition"
                            >
                                30 Days
                            </button>
                        </div>

                        {/* Filter Toggle Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 shadow transition"
                        >
                            <FiFilter size={16} />
                            {showFilters ? 'Hide Filters' : 'More Filters'}
                        </button>

                        {/* Export Button */}
                        <button
                            // onClick={exportToCSV}
                            className="flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium text-white bg-green-500 hover:bg-green-600 shadow transition"
                        >
                            <FiDownload size={16} />
                            Export
                        </button>
                    </div>

                    {/* Advanced Filters - Shown when showFilters is true */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Role Filter */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="appearance-none pl-3 pr-8 py-2 w-full rounded border border-gray-300 bg-white shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm transition"
                                >
                                    <option value="All">All Roles</option>
                                    <option value="User">User</option>
                                    <option value="Admin">Admin</option>
                                </select>
                                <FiChevronDown className="absolute right-3 bottom-2 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Type Filter */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="appearance-none pl-3 pr-8 py-2 w-full rounded border border-gray-300 bg-white shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm transition"
                                >
                                    <option value="All">All Types</option>
                                    <option value="Activity">Activity</option>
                                    <option value="Payout">Payout</option>
                                    <option value="Level">Level</option>
                                    <option value="Plan">Plan</option>
                                </select>
                                <FiChevronDown className="absolute right-3 bottom-2 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Status Filter */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="appearance-none pl-3 pr-8 py-2 w-full rounded border border-gray-300 bg-white shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm transition"
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="Success">Success</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Failed">Failed</option>
                                </select>
                                <FiChevronDown className="absolute right-3 bottom-2 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Action By Filter */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Action By</label>
                                <select
                                    value={selectedActionBy}
                                    onChange={(e) => setSelectedActionBy(e.target.value)}
                                    className="appearance-none pl-3 pr-8 py-2 w-full rounded border border-gray-300 bg-white shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm transition"
                                >
                                    <option value="All">All Actions</option>
                                    <option value="User">User</option>
                                    <option value="Admin">Admin</option>
                                </select>
                                <FiChevronDown className="absolute right-3 bottom-2 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Clear Filters Button */}
                            <div className="flex items-end">
                                <button
                                    onClick={handleClearFilters}
                                    className="px-3 py-2 rounded text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 shadow transition"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                        onClick={() => requestSort('id')}
                                    >
                                        Log ID
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                        onClick={() => requestSort('userId')}
                                    >
                                        User ID
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                        onClick={() => requestSort('name')}
                                    >
                                        Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                        onClick={() => requestSort('generatedOn')}
                                    >
                                        Generated On
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        IP Location
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Device
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Action By
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.length > 0 ? (
                                    currentItems.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{log.id}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{log.userId}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{log.name}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeClass(log.role)}`}>
                                                    {log.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeClass(log.type)}`}>
                                                    {log.type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeClass(log.status)}`}>
                                                    {log.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">{log.description}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{log.generatedOn}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{log.ipLocation}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{log.device}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeClass(log.actionBy)}`}>
                                                    {log.actionBy}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={11} className="px-4 py-4 text-center text-sm text-gray-500">
                                            No logs found matching your criteria
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-4 py-3 border-t border-gray-200">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}