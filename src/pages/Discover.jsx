import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recommendationService } from '../services/api';

function Discover() {
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('medium_term');

    const timeRanges = [
        { value: 'short_term', label: 'Recent Vibes', desc: 'Last 4 weeks' },
        { value: 'medium_term', label: 'Current Favorites', desc: 'Last 6 months' },
        { value: 'long_term', label: 'All-Time Classics', desc: 'Your entire history' }
    ];

    useEffect(() => {
        fetchRecommendations();
    }, [timeRange]);

    const fetchRecommendations = async () => {
        setLoading(true);
        try {
            const data = await recommendationService.getDiscoverRecommendations(timeRange, 20);
            setRecommendations(data);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black">
            {/* Header */}
            <header className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="text-white hover:text-purple-300 transition-colors"
                            >
                                ← Back
                            </button>
                            <h1 className="text-3xl font-bold text-white">🔍 Discover New Music</h1>
                        </div>
                    </div>

                    {/* Time Range Selector */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                        {timeRanges.map(range => (
                            <button
                                key={range.value}
                                onClick={() => setTimeRange(range.value)}
                                className={`p-4 rounded-lg transition-all text-left ${
                                    timeRange === range.value
                                        ? 'bg-purple-500 text-white shadow-lg scale-105'
                                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                }`}
                            >
                                <div className="font-semibold">{range.label}</div>
                                <div className="text-sm opacity-80">{range.desc}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Info Banner */}
                <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl p-6 mb-8">
                    <div className="flex items-start gap-4">
                        <div className="text-4xl">🎵</div>
                        <div className="flex-1">
                            <h2 className="text-white text-xl font-bold mb-2">
                                AI-Powered Music Discovery
                            </h2>
                            <p className="text-gray-300 text-sm mb-3">
                                Our algorithm analyzes your listening patterns, extracts your top artists and genres,
                                then searches Spotify for new tracks you haven't heard yet. Each recommendation is
                                ranked by similarity to your taste profile using machine learning.
                            </p>
                            <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
                  ✓ 100% New Tracks
                </span>
                                <span className="text-xs bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                  ✓ ML-Ranked
                </span>
                                <span className="text-xs bg-green-500/20 text-green-300 px-3 py-1 rounded-full">
                  ✓ Genre Matched
                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center text-white py-20">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4"></div>
                        <p className="text-xl mb-2">Discovering new music for you...</p>
                        <p className="text-gray-400 text-sm">
                            Analyzing your taste • Searching Spotify • Filtering duplicates
                        </p>
                    </div>
                ) : recommendations.length === 0 ? (
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-12 text-center border border-white/20">
                        <div className="text-6xl mb-4">🎵</div>
                        <h3 className="text-white text-2xl font-bold mb-2">No recommendations found</h3>
                        <p className="text-gray-300 mb-6">
                            Try saving more songs to your Spotify library or listening to more music!
                        </p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">
                                Found {recommendations.length} new tracks for you
                            </h2>
                            <button
                                onClick={fetchRecommendations}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {recommendations.map((track, index) => (
                                <div
                                    key={track.id}
                                    className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:bg-white/15 hover:scale-105 transition-all group"
                                >
                                    {/* Album Art */}
                                    <div className="relative aspect-square">
                                        {track.imageUrl ? (
                                            <img
                                                src={track.imageUrl}
                                                alt={track.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                                <span className="text-6xl">🎵</span>
                                            </div>
                                        )}

                                        {/* Rank Badge */}
                                        <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold">
                                            #{index + 1}
                                        </div>

                                        {/* Popularity Badge */}
                                        <div className="absolute top-2 right-2 bg-purple-500/80 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-semibold">
                                            {track.popularity}%
                                        </div>
                                    </div>

                                    {/* Track Info */}
                                    <div className="p-4">
                                        <h3 className="text-white font-semibold truncate mb-1">
                                            {track.name}
                                        </h3>
                                        <p className="text-gray-400 text-sm truncate mb-2">
                                            {track.artists.join(', ')}
                                        </p>
                                        <p className="text-gray-500 text-xs truncate mb-3">
                                            {track.album}
                                        </p>

                                        <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">
                        {Math.floor(track.durationMs / 60000)}:{String(Math.floor((track.durationMs % 60000) / 1000)).padStart(2, '0')}
                      </span>
                                            <span className="text-green-400 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                        </svg>
                        New
                      </span>
                                        </div>

                                        {/* Preview Button (if available) */}
                                        {track.previewUrl && (
                                            <button className="w-full mt-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg text-sm transition-colors">
                                                ▶ Preview
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Discover;