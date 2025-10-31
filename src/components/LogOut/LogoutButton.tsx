// LogoutButton.tsx
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import { adminAuthApi } from '../../apis/authApi';

export default function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Call the logout API
            await adminAuthApi.logout();

            // Clear local storage
            localStorage.removeItem("adminAccessToken");
            localStorage.removeItem("adminRefreshToken");
            localStorage.removeItem("adminData");

            // Redirect to login page
            navigate('/signin');

        } catch (error) {
            console.error('Logout error:', error);
            // Even if API call fails, clear local storage and redirect
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userData");
            navigate('/signin');
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-4 py-3 text-left text-gray-700 transition-colors hover:bg-gray-100 hover:text-red-600 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-red-400"
        >
            <FiLogOut className="text-lg" />
            <span className="text-sm font-medium">Log Out</span>
        </button>
    );
}