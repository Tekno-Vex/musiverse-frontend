import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function AuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('processing');
    const [message, setMessage] = useState('Processing authentication...');

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            localStorage.setItem('token', token);
            setStatus('success');
            setMessage('Authentication successful!');
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } else {
            setStatus('error');
            setMessage('Authentication failed. Please try again.');
            setTimeout(() => {
                navigate('/');
            }, 2500);
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
                {/* Logo */}
                <div className="text-center mb-6">
                    <h1 className="text-5xl font-bold text-white mb-2">
                        🎵 MusiVerse
                    </h1>
                </div>

                {/* Status Animation */}
                <div className="flex flex-col items-center mb-6">
                    {status === 'processing' && (
                        <div className="relative">
                            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-purple-400"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-3xl">🎵</div>
                            </div>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="relative">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border-4 border-green-500 animate-bounce">
                                <div className="text-5xl">✓</div>
                            </div>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="relative">
                            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center border-4 border-red-500">
                                <div className="text-5xl">✗</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Status Message */}
                <div className="text-center">
                    <h2 className={`text-2xl font-bold mb-2 ${
                        status === 'success' ? 'text-green-400' :
                            status === 'error' ? 'text-red-400' :
                                'text-white'
                    }`}>
                        {status === 'success' && '🎉 Welcome to MusiVerse!'}
                        {status === 'error' && '😕 Oops!'}
                        {status === 'processing' && 'Connecting...'}
                    </h2>
                    <p className="text-gray-300">
                        {message}
                    </p>

                    {/* Progress Dots */}
                    {status === 'processing' && (
                        <div className="flex justify-center gap-2 mt-4">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    )}

                    {/* Success Message */}
                    {status === 'success' && (
                        <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                            <p className="text-green-300 text-sm">
                                Redirecting to your dashboard...
                            </p>
                        </div>
                    )}

                    {/* Error Message */}
                    {status === 'error' && (
                        <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                            <p className="text-red-300 text-sm mb-3">
                                Unable to authenticate with Spotify
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AuthCallback;