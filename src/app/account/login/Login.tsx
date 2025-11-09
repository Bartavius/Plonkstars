"use client";

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '@/utils/api'; 
import { motion } from 'framer-motion';
import { useRouter } from "next/navigation";
import { Sigmar } from "next/font/google";
import { clearBlockedURL, clearError } from '@/redux/errorSlice';
import { isAuthenticated,isDemo,login } from '@/utils/auth';

const sigmar = Sigmar({ subsets: ["latin"], weight: "400" });

const Login: React.FC = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    
    const isAuth = isAuthenticated();
    const demo = isDemo();
    const reduxError = useSelector((state:any) => state.error);
    const blockedURL = reduxError.loginRequiredUrl ?? "/";

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [buttonEnabled,setButtonEnabled] = useState(true);
    const [error, setError] = useState<string | undefined>(reduxError.error);

    

    useEffect(() => {
        dispatch(clearError());
    },[dispatch])

    useEffect(() => {
        if (isAuth && !demo) {
            dispatch(clearBlockedURL());
            router.push(blockedURL);
        }
    },[isAuth, demo])

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
                login(token);
                router.push(blockedURL)
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed');
            setButtonEnabled(true);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md p-6 form-window shadow-lg rounded-2xl border border-white/10"
            >
            <div className="text-center mb-6">
                <h2 className={`${sigmar.className} text-white text-4xl`}>Login</h2>
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
                    To create an account:{" "}
                    <a 
                        onClick={(e) => {
                            e.preventDefault(); 
                            router.push('/account/register');
                        }} 
                        className='link'
                    >
                        Register here
                    </a>
                </div>
                <button
                    type="submit"
                    disabled={!buttonEnabled}
                    className={`${buttonEnabled? `form-button-selected` : `form-button-not-selected`} ${sigmar.className} py-2 form-button-general`}
                >
                    Sign In
                </button>
            </form>
            <div className={`${sigmar.className} text-center text-xl`}>
                OR
            </div>
            <div className="text-center">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        login('demo');
                        router.push('/');
                    }}
                    className={`${sigmar.className} form-button-general ${buttonEnabled? `form-button-selected` : `form-button-not-selected`} w-full`}
                >
                    Play without an account
                </button>
            </div>
        </motion.div>
    </div>
  );
};

export default Login;