"use client";

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, loginFailure } from '@/redux/authSlice';
import api from '@/utils/api'; 
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import { useRouter } from "next/navigation";
import { Sigmar } from "next/font/google";
import { clearBlockedURL, clearError } from '@/redux/errorSlice';

const sigmar = Sigmar({ subsets: ["latin"], weight: "400" });
const formTitle = `${sigmar.className} text-white text-4xl`

const Login: React.FC = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    
    const { isAuthenticated } = useSelector((state: any) => state.auth);
    const reduxError = useSelector((state:any) => state.error);    

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [buttonEnabled,setButtonEnabled] = useState(true);
    const [error, setError] = useState<string | null>(reduxError.error);
    const [blockedURL, setBlockedURL] = useState<string>(reduxError.loginRequiredUrl??"/");

    useEffect(() => {
        dispatch(clearError());
        dispatch(clearBlockedURL());
    },[dispatch])

    useEffect(() => {
        if (isAuthenticated) {
            router.push(blockedURL);
        }
    },[isAuthenticated])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            {buttonEnabled &&
                setButtonEnabled(false);
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
                router.push(blockedURL)
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed');
            dispatch(loginFailure(err.response?.data?.error || 'Login failed'));
            setButtonEnabled(true);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md p-6 form-window shadow-lg rounded-2xl"
            >
            <div className="text-center mb-6">
                <h2 className={formTitle}>Login</h2>
            </div>
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`mb-4 ${sigmar.className} text-center text-red-600 bg-red-200 p-2 rounded-lg border border-red-400`}
                    aria-live="polite"
                >
                    {error}
                </motion.div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4 flex flex-col justify-center">
                <div>
                    <label htmlFor="username" className={`block ${sigmar.className} text-white`}></label>
                    <input
                        type="username"
                        id="username"
                        placeholder="Enter Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`input-field ${sigmar.className}`}
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-green-900"></label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`input-field ${sigmar.className}`}
                    />
                </div>
                <div className={`${sigmar.className} text-white`}>
                    To create an account: <a href="/account/register" className='link'>Register here</a>
                </div>       
                <button
                    type="submit"
                    disabled={!buttonEnabled}
                    className={`${buttonEnabled? `form-button-selected` : `form-button-not-selected`} ${sigmar.className} py-2 form-button-general`}
                >
                    Sign In
                </button>
            </form>
        </motion.div>
    </div>
  );
};

export default Login;