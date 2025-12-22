import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function AuthCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('Processing...');

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            localStorage.setItem('token', token);
            setStatus('Success! Redirecting...');
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
        } else {
            setStatus('Authentication failed');
            setTimeout(() => {
                navigate('/');
            }, 2000);
        }
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                <div className="mb-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{status}</h2>
            </div>
        </div>
    );
}

export default AuthCallback;