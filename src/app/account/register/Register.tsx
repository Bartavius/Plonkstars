import api from '@/utils/api';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useRouter } from "next/navigation";


const Register: React.FC = () => {
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
                console.log('buttonEnabled', buttonEnabled);
                setButtonEnabled(false);
                if (password !== confirmPassword) {
                    throw new Error('Passwords do not match');
                }
                await api.post('/account/register', {
                    username,
                    password,
                });
                router.push('/login');
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
                className="w-full max-w-md p-6 bg-white shadow-lg rounded-2xl"
            >
                <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-black">Register</h2>
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
                    <div>
                        <label htmlFor="cpassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            id="cpassword"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!buttonEnabled}
                        className={`w-full ${buttonEnabled? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'} text-white rounded-lg py-2 text-center`}
                    >
                        Register
                    </button>
                </form>
            </motion.div>
        </div>
    );
};
export default Register;