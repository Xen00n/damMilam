import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post(`http://localhost:6969/api/signup`, formData);
            if (response.data.success) {
                setShowModal(true);
                // Automatically redirect to login after 3 seconds
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setError(response.data.message || 'Signup failed');
            }
        } catch {
            setError('An error occurred during signup');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-light dark:bg-gray-900">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md dark:bg-gray-800">
                <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Sign Up</h2>
                {error && <div className="mb-4 text-red-500">{error}</div>}
                
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

                <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
                    Already have an account? <a href="/login" className="text-green-500 hover:underline">Login</a>
                </p>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg max-w-sm w-full">
                        <h3 className="text-xl font-semibold text-center dark:text-white">
                            Check Your Email
                        </h3>
                        <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
                            A verification email has been sent to your inbox. Please check your email to complete the signup process.
                        </p>
                        <button
                            onClick={() => setShowModal(false)}
                            className="mt-6 w-full bg-green-500 hover:bg-green-700 text-white p-2 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Signup;
