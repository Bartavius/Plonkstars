import api from '@/utils/api';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { Sigmar } from "next/font/google";

const sigmar = Sigmar({ subsets: ["latin"], weight: "400" });

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [buttonEnabled,setButtonEnabled] = useState(true);
    const router = useRouter();
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
           
            {buttonEnabled &&
                setButtonEnabled(false);
                if (password !== confirmPassword) {
                    throw new Error('Passwords do not match');
                }
                await api.post('/account/register', {
                    username,
                    password,
                });
                router.push('/account/login');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || err.message || 'Something went wrong');
            setButtonEnabled(true);

        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md p-6 form-window shadow-lg rounded-2xl"
            >
                <div className="text-center mb-6">
                    <h2 className={`${sigmar.className} text-white text-4xl`}>Register</h2>
                </div>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`${sigmar.className} mb-4 text-center text-red-600 bg-red-100 p-2 rounded-lg border border-red-400`}
                        aria-live="polite"
                    >
                        {error}
                    </motion.div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700"></label>
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
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700"></label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`input-field ${sigmar.className}`}
                        />
                    </div>
                    <div>
                        <label htmlFor="cpassword" className="block text-sm font-medium text-gray-700"></label>
                        <input
                            type="password"
                            id="cpassword"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`input-field ${sigmar.className}`}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!buttonEnabled}
                        className={`${buttonEnabled? `form-button-selected` : `form-button-not-selected`} ${sigmar.className} py-2 form-button-general`}
                    >
                        Register
                    </button>
                </form>
                <div className={`${sigmar.className} text-white`}>
                    Already have an account? <a href="/account/login" className='link'>Login here</a>
                </div>
            </motion.div>
        </div>
    );
};
export default Register;