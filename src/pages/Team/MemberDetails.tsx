import { getStatusClass, TeamMember } from "./Team";

interface MemberDetailsProps {
    member: TeamMember;
    onClose: () => void;
}

const MemberDetails = ({ member, onClose }: MemberDetailsProps) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Member Details</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        &times;
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-4">
                        <img src={member.image} alt={member.userId} className="h-16 w-16 rounded-full" />
                        <div>
                            <h4 className="text-lg font-semibold">{member.userId}</h4>
                            <p className="text-gray-600">{member.email}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Team:</span>
                            <span className="font-medium">{member.team}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Mobile:</span>
                            <span className="font-medium">{member.mobile}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Referral ID:</span>
                            <span className="font-medium">{member.referralId}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Direct Referral:</span>
                            <span className="font-medium">{member.directReferral}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">IP Address:</span>
                            <span className="font-medium">{member.ipAddress}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Join Date:</span>
                            <span className="font-medium">{member.joinDate}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Last Login:</span>
                            <span className="font-medium">{member.lastLogin.date}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">IP:</span>
                            <span className="font-medium">{member.lastLogin.ip}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(member.status)}`}>
                                {member.status}
                            </span>
                        </div>
                    </div>

                    <div className="col-span-2">
                        <h4 className="font-semibold mb-2">Levels</h4>
                        <div className="grid grid-cols-5 gap-2">
                            {Object.entries(member.levels).map(([level, count]) => (
                                <div key={level} className="bg-gray-50 p-2 rounded text-center">
                                    <span className="font-medium">{level}:</span> {count}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-2 flex justify-end space-x-3 mt-4">
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                            Edit Member
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberDetails;