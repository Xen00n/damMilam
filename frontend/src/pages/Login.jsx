import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post(`http://localhost:56840/api/login`, { email, password },
                { headers: { 'Content-Type': 'application/json' }});
            if (response.data.success) {
                // Save the JWT token to localStorage or sessionStorage
                localStorage.setItem('authToken', response.data.token);

                // Redirect to Home after successful login
                navigate('/home');
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('An error occurred during login');
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-light dark:bg-gray-900">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md dark:bg-gray-800">
                <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Login</h2>
                {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block mb-1 text-gray-600 dark:text-gray-300">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-1 text-gray-600 dark:text-gray-300">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-900 text-white p-2 rounded"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
                    Don't have an account? <a href="/signup" className="text-green-500 hover:underline">Sign up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
