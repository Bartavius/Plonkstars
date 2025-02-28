"use client";

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, loginFailure } from '@/redux/authSlice';
import api from '@/utils/api'; 
import { RootState } from '@/redux/store';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import { useRouter } from "next/navigation";

const Login: React.FC = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await api.post('/account/login', {
                username,
                password,
            });

            const token = response.data.token;
      
            Cookies.set('authToken', token, {
                expires: 30,
                secure: true,
                sameSite: 'Strict',
            });

            dispatch(loginSuccess(token));
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed');
            dispatch(loginFailure(err.response?.data?.error || 'Login failed'));
        }
    };

    if (isAuthenticated) {
        return <div>Welcome, you are logged in!</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md p-6 bg-white shadow-lg rounded-2xl"
            >
            <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-black">Login</h2>
            </div>
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-4 text-center text-red-600 bg-red-100 p-2 rounded-lg border border-red-400"
                    aria-live="polite"
                >
                    {error}
                </motion.div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        type="username"
                        id="username"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                </div>
                <div style={{color: 'black'}}>
                    To create an account: <a href="/account/register" style={{color: 'blue'}}>Register here</a>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 text-center"
                >
                    Sign In
                </button>
            </form>
        </motion.div>
    </div>
  );
};

export default Login;