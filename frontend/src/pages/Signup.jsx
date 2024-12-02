import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // For backend integration
import GoogleLogo from '../assets/google.png'; // Ensure the correct path to your Google logo image

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const response = await axios.post('/api/signup', formData);
            if (response.data.success) {
                setSuccess('Signup successful! Redirecting...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(response.data.message || 'Signup failed');
            }
        } catch (err) {
            setError('An error occurred during signup');
        }
    };

    const handleGoogleSignup = () => {
        // Redirect to your backend Google OAuth endpoint
        window.location.href = '/api/auth/google';
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-light dark:bg-gray-900">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md dark:bg-gray-800">
                <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Sign Up for DamMilam</h2>
                {error && <div className="mb-4 text-red-500">{error}</div>}
                {success && <div className="mb-4 text-green-500">{success}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block mb-1 text-gray-600 dark:text-gray-300">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block mb-1 text-gray-600 dark:text-gray-300">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-1 text-gray-600 dark:text-gray-300">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-700 text-white p-2 rounded"
                    >
                        Sign Up
                    </button>
                </form>

                <div className="flex items-center justify-center mt-6">
                    <div className="w-full border-t border-gray-300"></div>
                    <span className="px-3 text-gray-600 dark:text-gray-300">OR</span>
                    <div className="w-full border-t border-gray-300"></div>
                </div>

                <button
                    onClick={handleGoogleSignup}
                    className="flex items-center justify-center w-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-600 p-2 mt-4 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                >
                    <img src={GoogleLogo} alt="Google" className="w-5 h-5 mr-2" />
                    Sign Up with Google
                </button>

                <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
                    Already have an account? <a href="/login" className="text-green-500 hover:underline">Login</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
