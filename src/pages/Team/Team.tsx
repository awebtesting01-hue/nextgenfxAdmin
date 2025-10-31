import { useState } from 'react';
import { FiSearch, FiCalendar, FiDownload, FiChevronDown, FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';
import Pagination from '../../utils/Pagination';
import MemberDetails from './MemberDetails';

export interface TeamMember {
    id: string;
    image: string;
    team: string;
    userId: string;
    email: string;
    mobile: string;
    referralId: string;
    directReferral: string;
    ipAddress: string;
    status: 'Active' | 'Inactive';
    levels: {
        L1: number;
        L2: number;
        L3: number;
        L4: number;
        L5: number;
        L6: number;
        L7: number;
        L8: number;
        L9: number;
        L10: number;
        L11: number;
        L12: number;
        L13: number;
        L14: number;
        L15: number;
    };
    joinDate: string;
    lastLogin: {
        date: string;
        ip: string;
    };
    earningsStatus: 'Completed' | 'Not Completed';
    activity: 'Active' | 'Inactive';
}

interface SortConfig {
    key: keyof TeamMember | string;
    direction: 'asc' | 'desc';
}





export const getStatusClass = (status: string): string => {
    switch (status) {
        case 'Active': return 'bg-green-100 text-green-800';
        case 'Inactive': return 'bg-red-100 text-red-800';
        case 'Completed': return 'bg-blue-100 text-blue-800';
        case 'Not Completed': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export default function Team() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedLevel, setSelectedLevel] = useState<string>('All Levels');
    const [selectedEarningsStatus, setSelectedEarningsStatus] = useState<string>('All');
    const [selectedActivityStatus, setSelectedActivityStatus] = useState<string>('All');
    const [selectedStatus, setSelectedStatus] = useState<string>('All');
    const [viewMember, setViewMember] = useState<TeamMember | null>(null);
    const itemsPerPage = 10;

    const [members, setMembers] = useState<TeamMember[]>([
        {
            id: '1',
            image: 'https://randomuser.me/api/portraits/men/1.jpg',
            team: 'Alpha',
            userId: 'U001',
            email: 'user1@example.com',
            mobile: '+919876543210',
            referralId: 'REF001',
            directReferral: 'DIR001',
            ipAddress: '192.168.1.1',
            status: 'Active',
            levels: {
                L1: 5,
                L2: 10,
                L3: 15,
                L4: 20,
                L5: 25,
                L6: 30,
                L7: 35,
                L8: 40,
                L9: 45,
                L10: 50,
                L11: 55,
                L12: 60,
                L13: 65,
                L14: 70,
                L15: 75
            },
            joinDate: '2025-01-15',
            lastLogin: {
                date: '2025-08-10 14:30:22',
                ip: '192.168.1.1'
            },
            earningsStatus: 'Completed',
            activity: 'Active'
        },
        {
            id: '2',
            image: 'https://randomuser.me/api/portraits/women/1.jpg',
            team: 'Beta',
            userId: 'U002',
            email: 'user2@example.com',
            mobile: '+919876543211',
            referralId: 'REF002',
            directReferral: 'DIR002',
            ipAddress: '192.168.1.2',
            status: 'Inactive',
            levels: {
                L1: 3,
                L2: 6,
                L3: 9,
                L4: 12,
                L5: 15,
                L6: 18,
                L7: 21,
                L8: 24,
                L9: 27,
                L10: 30,
                L11: 33,
                L12: 36,
                L13: 39,
                L14: 42,
                L15: 45
            },
            joinDate: '2025-02-20',
            lastLogin: {
                date: '2025-08-01 10:15:33',
                ip: '192.168.1.2'
            },
            earningsStatus: 'Not Completed',
            activity: 'Inactive'
        },
        ...Array.from({ length: 48 }, (_, i) => ({
            id: `${i + 3}`,
            image: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${i + 2}.jpg`,
            team: ['Alpha', 'Beta', 'Gamma', 'Delta'][Math.floor(Math.random() * 4)],
            userId: `U${100 + i}`,
            email: `user${i + 3}@example.com`,
            mobile: `+91987654${Math.floor(1000 + Math.random() * 9000)}`,
            referralId: `REF${100 + i}`,
            directReferral: `DIR${100 + i}`,
            ipAddress: `192.168.1.${Math.floor(Math.random() * 100)}`,
            status: Math.random() > 0.3 ? 'Active' : 'Inactive' as 'Active' | 'Inactive',
            levels: {
                L1: Math.floor(Math.random() * 10),
                L2: Math.floor(Math.random() * 20),
                L3: Math.floor(Math.random() * 30),
                L4: Math.floor(Math.random() * 40),
                L5: Math.floor(Math.random() * 50),
                L6: Math.floor(Math.random() * 60),
                L7: Math.floor(Math.random() * 70),
                L8: Math.floor(Math.random() * 80),
                L9: Math.floor(Math.random() * 90),
                L10: Math.floor(Math.random() * 100),
                L11: Math.floor(Math.random() * 110),
                L12: Math.floor(Math.random() * 120),
                L13: Math.floor(Math.random() * 130),
                L14: Math.floor(Math.random() * 140),
                L15: Math.floor(Math.random() * 150)
            },
            joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            lastLogin: {
                date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleString(),
                ip: `192.168.1.${Math.floor(Math.random() * 100)}`
            },
            earningsStatus: Math.random() > 0.5 ? 'Completed' : 'Not Completed' as 'Completed' | 'Not Completed',
            activity: Math.random() > 0.3 ? 'Active' : 'Inactive' as 'Active' | 'Inactive'
        }))
    ]);

    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

    const todayStr = new Date().toISOString().split('T')[0];

    const toggleMemberStatus = (id: string) => {
        setMembers(members.map(member =>
            member.id === id
                ? { ...member, status: member.status === 'Active' ? 'Inactive' : 'Active' }
                : member
        ));
    };

    const deleteMember = (id: string) => {
        if (window.confirm('Are you sure you want to delete this member?')) {
            setMembers(members.filter(member => member.id !== id));
        }
    };

    const filteredMembers = members.filter((member) => {
        // Basic search filter
        const matchesSearch = searchTerm === '' ||
            member.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.mobile.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.referralId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.directReferral.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.ipAddress.toLowerCase().includes(searchTerm.toLowerCase());

        // Date range filter
        const matchesStartDate = startDate === '' || member.joinDate >= startDate;
        const matchesEndDate = endDate === '' || member.joinDate <= endDate;

        // Level filter - check if any level matches the selected level
        const matchesLevel = selectedLevel === 'All Levels' ||
            (selectedLevel.startsWith('User level ') &&
                member.levels[`L${selectedLevel.split(' ')[2]}` as keyof typeof member.levels] > 0);

        // Earnings status filter
        const matchesEarningsStatus = selectedEarningsStatus === 'All' ||
            member.earningsStatus === selectedEarningsStatus;

        // Activity status filter
        const matchesActivityStatus = selectedActivityStatus === 'All' ||
            member.activity === selectedActivityStatus;

        // Status filter
        const matchesStatus = selectedStatus === 'All' ||
            member.status === selectedStatus;

        return matchesSearch && matchesStartDate && matchesEndDate &&
            matchesLevel && matchesEarningsStatus && matchesActivityStatus && matchesStatus;
    });

    const sortedMembers = [...filteredMembers];
    if (sortConfig !== null) {
        sortedMembers.sort((a, b) => {
            let aValue: any, bValue: any;

            if (sortConfig.key.startsWith('levels.')) {
                const levelKey = sortConfig.key.split('.')[1] as keyof TeamMember['levels'];
                aValue = a.levels[levelKey];
                bValue = b.levels[levelKey];
            } else if (sortConfig.key === 'lastLogin') {
                aValue = a.lastLogin.date;
                bValue = b.lastLogin.date;
            } else {
                aValue = a[sortConfig.key as keyof TeamMember];
                bValue = b[sortConfig.key as keyof TeamMember];
            }

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
    const currentItems = sortedMembers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedMembers.length / itemsPerPage);

    const requestSort = (key: string) => {
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

    // const exportToCSV = () => {
    //     const headers = Object.keys(members[0]).filter(key => key !== 'levels' && key !== 'lastLogin').join(',') +
    //         ',lastLoginDate,lastLoginIp,' +
    //         Object.keys(members[0].levels).join(',');

    //     const rows = members.map(member => {
    //         const baseValues = Object.entries(member)
    //             .filter(([key]) => key !== 'levels' && key !== 'lastLogin')
    //             .map(([_, value]) => `"${value}"`);

    //         return [
    //             ...baseValues,
    //             `"${member.lastLogin.date}"`,
    //             `"${member.lastLogin.ip}"`,
    //             ...Object.values(member.levels).map(v => `"${v}"`)
    //         ].join(',');
    //     });

    //     const csvContent = [headers, ...rows].join('\n');
    //     const blob = new Blob([csvContent], { type: 'text/csv' });
    //     const url = URL.createObjectURL(blob);
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.download = 'team_members.csv';
    //     link.click();
    // };

    return (
        <div className="bg-gray-50 min-h-screen p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <h4 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Team Members</h4>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-xs">
                            <input
                                type="text"
                                placeholder="🔍 Search by ID, Email, Mobile, etc."
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
                    </div>

                    {/* Advanced Filters */}
                    <div className="mt-4 flex flex-wrap gap-3">
                        {/* Status Dropdown */}
                        <div className="relative">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="appearance-none pl-3 pr-8 py-2 rounded-full border border-gray-300 bg-white shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm transition"
                            >
                                <option value="All">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Level Dropdown */}
                        <div className="relative">
                            <select
                                value={selectedLevel}
                                onChange={(e) => setSelectedLevel(e.target.value)}
                                className="appearance-none pl-3 pr-8 py-2 rounded-full border border-gray-300 bg-white shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm transition"
                            >
                                <option value="All Levels">All Levels</option>
                                {[...Array(15)].map((_, i) => (
                                    <option key={`L${i + 1}`} value={`User level ${i + 1}`}>
                                        Level {i + 1}
                                    </option>
                                ))}
                            </select>
                            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Earnings Status Dropdown */}
                        <div className="relative">
                            <select
                                value={selectedEarningsStatus}
                                onChange={(e) => setSelectedEarningsStatus(e.target.value)}
                                className="appearance-none pl-3 pr-8 py-2 rounded-full border border-gray-300 bg-white shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm transition"
                            >
                                <option value="All">All Earnings Status</option>
                                <option value="Completed">3x Earnings Completed</option>
                                <option value="Not Completed">3x Earnings Not Completed</option>
                            </select>
                            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Activity Status Dropdown */}
                        <div className="relative">
                            <select
                                value={selectedActivityStatus}
                                onChange={(e) => setSelectedActivityStatus(e.target.value)}
                                className="appearance-none pl-3 pr-8 py-2 rounded-full border border-gray-300 bg-white shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm transition"
                            >
                                <option value="All">All Activity Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Export Button */}
                        <button
                            // onClick={exportToCSV}
                            className="flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium text-white bg-green-500 hover:bg-green-600 shadow transition ml-auto"
                        >
                            <FiDownload size={16} />
                            Export
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Image</th>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                        onClick={() => requestSort('team')}
                                    >
                                        Team
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                        onClick={() => requestSort('userId')}
                                    >
                                        User Id
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                        onClick={() => requestSort('email')}
                                    >
                                        Email
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                        onClick={() => requestSort('mobile')}
                                    >
                                        Mobile
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                        onClick={() => requestSort('referralId')}
                                    >
                                        Referral ID
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                        onClick={() => requestSort('directReferral')}
                                    >
                                        Direct Referral
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                        onClick={() => requestSort('ipAddress')}
                                    >
                                        IP Address
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                        onClick={() => requestSort('status')}
                                    >
                                        Status
                                    </th>
                                    {[...Array(15)].map((_, i) => (
                                        <th
                                            key={`L${i + 1}`}
                                            className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                            onClick={() => requestSort(`levels.L${i + 1}`)}
                                        >
                                            L{i + 1}
                                        </th>
                                    ))}
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                        onClick={() => requestSort('joinDate')}
                                    >
                                        Join Date
                                    </th>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                        onClick={() => requestSort('lastLogin')}
                                    >
                                        Last Login
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Member Activity
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        3x Earnings
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentItems.length > 0 ? (
                                    currentItems.map((member) => (
                                        <tr key={member.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <img src={member.image} alt={member.userId} className="h-8 w-8 rounded-full" />
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{member.team}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{member.userId}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{member.email}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{member.mobile}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{member.referralId}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{member.directReferral}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{member.ipAddress}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                <button
                                                    onClick={() => toggleMemberStatus(member.id)}
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(member.status)}`}
                                                >
                                                    {member.status}
                                                </button>
                                            </td>
                                            {[...Array(15)].map((_, i) => (
                                                <td key={`L${i + 1}-${member.id}`} className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                    {member.levels[`L${i + 1}` as keyof typeof member.levels]}
                                                </td>
                                            ))}
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{member.joinDate}</td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                {member.lastLogin.date}<br />
                                                <span className="text-xs text-gray-500">{member.lastLogin.ip}</span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(member.activity)}`}>
                                                    {member.activity}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(member.earningsStatus)}`}>
                                                    {member.earningsStatus}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => setViewMember(member)}
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                        title="View"
                                                    >
                                                        <FiEye size={16} />
                                                    </button>
                                                    <button
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="Edit"
                                                    >
                                                        <FiEdit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteMember(member.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Delete"
                                                    >
                                                        <FiTrash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={30} className="px-4 py-4 text-center text-sm text-gray-500">
                                            No members found matching your criteria
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

            {/* Member Details Modal */}
            {viewMember && (
                <MemberDetails
                    member={viewMember}
                    onClose={() => setViewMember(null)}
                />
            )}
        </div>
    );
}