import { useState } from "react";
import { FiEdit, FiEye, FiEyeOff, FiCamera, FiSave } from "react-icons/fi";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";

interface UserData {
    avatar: string;
    name: string;
    id: string;
    email: string;
    phone: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export default function ProfileManagement() {
    const [user, setUser] = useState<UserData>({
        avatar: "/images/user/owner.jpg",
        name: "Musharof Chowdhury",
        id: "USR-001",
        email: "musharof@example.com",
        phone: "+1 (555) 123-4567",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (isEditing) {
            if (!user.name) newErrors.name = "Name is required";
            if (!user.email) newErrors.email = "Email is required";
            if (!/^\S+@\S+\.\S+$/.test(user.email)) newErrors.email = "Invalid email format";
            if (!user.phone) newErrors.phone = "Phone is required";
        }

        // Password validation only if new password is entered
        if (user.newPassword) {
            if (user.newPassword.length < 8) {
                newErrors.newPassword = "Password must be at least 8 characters";
            }
            if (user.newPassword !== user.confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match";
            }
            if (!user.currentPassword) {
                newErrors.currentPassword = "Current password is required";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Handle form submission
        console.log("Profile updated:", {
            ...user,
            // Don't send passwords in the final object (just for demo)
            currentPassword: "***",
            newPassword: "***",
            confirmPassword: "***"
        });

        // Reset form state
        setIsEditing(false);
        setUser(prev => ({
            ...prev,
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setUser({ ...user, avatar: event.target.result as string });
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800">Profile Management</h2>
                        <p className="text-gray-600 mt-1">Update your personal information</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="p-6 md:p-8">
                            {/* Avatar Section */}
                            <div className="flex flex-col items-center mb-8">
                                <div className="relative group">
                                    <img
                                        src={user.avatar}
                                        alt="User Avatar"
                                        className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
                                    />
                                    {isEditing && (
                                        <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-all">
                                            <FiCamera size={18} />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleAvatarChange}
                                            />
                                        </label>
                                    )}
                                </div>
                                <h3 className="mt-4 text-xl font-semibold text-gray-800">
                                    {user.name}
                                </h3>
                                <p className="text-gray-500">{user.id}</p>
                            </div>

                            {/* Form Fields */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Name */}
                                <div>
                                    <Label>Full Name</Label>
                                    <Input
                                        type="text"
                                        name="name"
                                        value={user.name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        error={!!errors.name}
                                        hint={errors.name}
                                    />
                                </div>

                                {/* ID (readonly) */}
                                <div>
                                    <Label>User ID</Label>
                                    <Input
                                        type="text"
                                        value={user.id}
                                        disabled
                                        className="bg-gray-100"
                                    />
                                </div>

                                {/* Email */}
                                <div className="md:col-span-2">
                                    <Label>Email Address</Label>
                                    <Input
                                        type="email"
                                        name="email"
                                        value={user.email}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        error={!!errors.email}
                                        hint={errors.email}
                                    />
                                </div>

                                {/* Phone */}
                                <div className="md:col-span-2">
                                    <Label>Phone Number</Label>
                                    <Input
                                        type="tel"
                                        name="phone"
                                        value={user.phone}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        error={!!errors.phone}
                                        hint={errors.phone}
                                    />
                                </div>

                                {/* Password Fields - Always visible but only editable in edit mode */}
                                <div className="md:col-span-2">
                                    <Label>Current Password</Label>
                                    <div className="relative">
                                        <Input
                                            type={showCurrentPassword ? "text" : "password"}
                                            name="currentPassword"
                                            value={user.currentPassword}
                                            onChange={handleChange}
                                            placeholder={isEditing ? "Enter current password" : "••••••••"}
                                            disabled={!isEditing}
                                            error={!!errors.currentPassword}
                                            hint={errors.currentPassword}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            disabled={!isEditing}
                                        >
                                            {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <Label>New Password</Label>
                                    <div className="relative">
                                        <Input
                                            type={showNewPassword ? "text" : "password"}
                                            name="newPassword"
                                            value={user.newPassword}
                                            onChange={handleChange}
                                            placeholder={isEditing ? "Enter new password" : "••••••••"}
                                            disabled={!isEditing}
                                            error={!!errors.newPassword}
                                            hint={errors.newPassword}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            disabled={!isEditing}
                                        >
                                            {showNewPassword ? <FiEyeOff /> : <FiEye />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <Label>Confirm New Password</Label>
                                    <div className="relative">
                                        <Input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={user.confirmPassword}
                                            onChange={handleChange}
                                            placeholder={isEditing ? "Confirm new password" : "••••••••"}
                                            disabled={!isEditing}
                                            error={!!errors.confirmPassword}
                                            hint={errors.confirmPassword}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            disabled={!isEditing}
                                        >
                                            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                                {isEditing ? (
                                    <>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setErrors({});
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" className="flex items-center gap-2">
                                            <FiSave size={16} />
                                            Save Changes
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2"
                                    >
                                        <FiEdit size={16} />
                                        Edit Profile
                                    </Button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}