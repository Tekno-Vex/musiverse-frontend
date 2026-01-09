import { useState, useEffect } from 'react';
import { spotifyService } from '../services/api';

function RecentlyPlayed() {
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecentlyPlayed();
    }, []);

    const fetchRecentlyPlayed = async () => {
        try {
            const data = await spotifyService.getRecentlyPlayed(20);
            setTracks(data);
        } catch (error) {
            console.error('Error fetching recently played:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    const formatDuration = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds.padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recently Played</h3>
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recently Played</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {tracks.map((track, index) => (
                    <div
                        key={`${track.id}-${index}`}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition"
                    >
                        {track.imageUrl && (
                            <img
                                src={track.imageUrl}
                                alt={track.name}
                                className="w-10 h-10 rounded"
                            />
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {track.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {track.artists.join(', ')}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-400">{formatTime(track.playedAt)}</p>
                            <p className="text-xs text-gray-500">{formatDuration(track.durationMs)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default RecentlyPlayed;