import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, spotifyService } from '../services/api';
import StatsCard from '../components/StatsCard';
import RecentlyPlayed from '../components/RecentlyPlayed';
import GenreChart from '../components/GenreChart';

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dataLoading, setDataLoading] = useState(false);
    const [topTracks, setTopTracks] = useState([]);
    const [topArtists, setTopArtists] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [timeRange, setTimeRange] = useState('medium_term');

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

                // Fetch all data
                await fetchAllData('medium_term');

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

    const fetchAllData = async (range) => {
        setDataLoading(true);
        try {
            const [itemsData, analyticsData] = await Promise.all([
                spotifyService.getTopItems(range),
                spotifyService.getAnalytics(range),
            ]);

            setTopTracks(itemsData.tracks || []);
            setTopArtists(itemsData.artists || []);
            setAnalytics(analyticsData);
            setTimeRange(range);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setDataLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const formatDuration = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds.padStart(2, '0')}`;
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
            <nav className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-2xl font-bold text-purple-600">MusiVerse</h1>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/discover')}
                                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition duration-200"
                            >
                                Discover
                            </button>
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
                {/* Welcome Message */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Welcome back, {user?.displayName}! 🎉
                    </h2>
                    <p className="text-gray-600">
                        Here's your music listening overview
                    </p>
                </div>

                {/* Time Range Selector */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => fetchAllData('short_term')}
                            disabled={dataLoading}
                            className={`px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 ${
                                timeRange === 'short_term'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Last 4 Weeks
                        </button>
                        <button
                            onClick={() => fetchAllData('medium_term')}
                            disabled={dataLoading}
                            className={`px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 ${
                                timeRange === 'medium_term'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Last 6 Months
                        </button>
                        <button
                            onClick={() => fetchAllData('long_term')}
                            disabled={dataLoading}
                            className={`px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 ${
                                timeRange === 'long_term'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            All Time
                        </button>
                    </div>
                </div>

                {dataLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                ) : (
                    <>
                        {/* Stats Cards */}
                        {analytics && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                <StatsCard
                                    title="Top Tracks"
                                    value={analytics.totalTopTracks}
                                    icon="🎵"
                                    color="purple"
                                />
                                <StatsCard
                                    title="Top Artists"
                                    value={analytics.totalTopArtists}
                                    icon="🎤"
                                    color="blue"
                                />
                                <StatsCard
                                    title="Top Genre"
                                    value={analytics.topGenre}
                                    icon="🎸"
                                    color="green"
                                />
                                <StatsCard
                                    title="Avg Popularity"
                                    value={`${analytics.avgPopularity}%`}
                                    icon="⭐"
                                    color="pink"
                                />
                            </div>
                        )}

                        {/* Charts Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            {/* Genre Distribution */}
                            {analytics && analytics.genreDistribution && (
                                <GenreChart data={analytics.genreDistribution} />
                            )}

                            {/* Recently Played */}
                            <RecentlyPlayed />
                        </div>

                        {/* Top Tracks and Artists */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Top Tracks */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">
                                    Your Top Tracks
                                </h3>
                                {topTracks.length > 0 ? (
                                    <div className="space-y-3">
                                        {topTracks.map((track, index) => (
                                            <div
                                                key={track.id}
                                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition"
                                            >
                        <span className="text-lg font-bold text-gray-400 w-6">
                          {index + 1}
                        </span>
                                                {track.imageUrl && (
                                                    <img
                                                        src={track.imageUrl}
                                                        alt={track.name}
                                                        className="w-12 h-12 rounded"
                                                    />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {track.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500 truncate">
                                                        {track.artists.join(', ')}
                                                    </p>
                                                </div>
                                                <span className="text-xs text-gray-400">
                          {formatDuration(track.durationMs)}
                        </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">
                                        No tracks found for this time period
                                    </p>
                                )}
                            </div>

                            {/* Top Artists */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">
                                    Your Top Artists
                                </h3>
                                {topArtists.length > 0 ? (
                                    <div className="space-y-3">
                                        {topArtists.map((artist, index) => (
                                            <div
                                                key={artist.id}
                                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition"
                                            >
                        <span className="text-lg font-bold text-gray-400 w-6">
                          {index + 1}
                        </span>
                                                {artist.imageUrl && (
                                                    <img
                                                        src={artist.imageUrl}
                                                        alt={artist.name}
                                                        className="w-12 h-12 rounded-full"
                                                    />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {artist.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500 truncate">
                                                        {artist.genres.slice(0, 2).join(', ')}
                                                    </p>
                                                </div>
                                                <div className="flex items-center">
                          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                            {artist.popularity}%
                          </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">
                                        No artists found for this time period
                                    </p>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default Dashboard;