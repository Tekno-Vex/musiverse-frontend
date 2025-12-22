import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/');
                    return;
                }

                const userData = await authService.getCurrentUser();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user:', error);
                localStorage.removeItem('token');
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-2xl font-bold text-purple-600">🎵 MoodTune</h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">{user?.displayName}</span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Welcome, {user?.displayName}! 🎉
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Your Spotify account is successfully connected.
                    </p>
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                        <p className="text-blue-700">
                            <strong>Sprint 1 Complete!</strong> You've successfully implemented Spotify authentication.
                            In the next sprints, we'll add analytics, recommendations, and AI chat.
                        </p>
                    </div>
                </div>

                {/* User Info Card */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Profile</h3>
                    <div className="space-y-2">
                        <p><strong>Display Name:</strong> {user?.displayName}</p>
                        <p><strong>Email:</strong> {user?.email || 'Not provided'}</p>
                        <p><strong>Spotify ID:</strong> {user?.spotifyId}</p>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;