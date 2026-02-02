import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    getSpotifyAuthUrl: async () => {
        const response = await api.get('/auth/spotify/url');
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
};

export const spotifyService = {
    getTopTracks: async (timeRange = 'medium_term') => {
        const response = await api.get(`/spotify/top-tracks?timeRange=${timeRange}`);
        return response.data;
    },

    getTopArtists: async (timeRange = 'medium_term') => {
        const response = await api.get(`/spotify/top-artists?timeRange=${timeRange}`);
        return response.data;
    },

    getTopItems: async (timeRange = 'medium_term') => {
        const response = await api.get(`/spotify/top-items?timeRange=${timeRange}`);
        return response.data;
    },

    getRecentlyPlayed: async (limit = 20) => {
        const response = await api.get(`/spotify/recently-played?limit=${limit}`);
        return response.data;
    },

    getAnalytics: async (timeRange = 'medium_term') => {
        const response = await api.get(`/spotify/analytics?timeRange=${timeRange}`);
        return response.data;
    },
};

// Add new recommendation service
export const recommendationService = {
    getSimilarTracks: async (trackId, limit = 10) => {
        const response = await api.get(`/recommendations/similar/${trackId}?limit=${limit}`);
        return response.data;
    },

    getDiscoverRecommendations: async (timeRange = 'medium_term', limit = 20) => {
        const response = await api.get(`/recommendations/discover?timeRange=${timeRange}&limit=${limit}`);
        return response.data;
    },

    generatePlaylist: async (playlistType, trackCount = 20, seedTrackIds = []) => {
        const response = await api.post('/recommendations/playlist/generate', {
            playlistType,
            trackCount,
            seedTrackIds,
        });
        return response.data;
    },
};

export default api;