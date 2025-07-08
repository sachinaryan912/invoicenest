
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase/config';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input type="password" className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Login</button>
        </form>
        <div className="mt-6">
          <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded-md hover:bg-red-600">
            <svg className="w-5 h-5" viewBox="0 0 488 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M488 261.8c0-17.8-1.5-35-4.4-51.7H249v97.9h135.5c-5.8 31.1-23.5 57.4-50.1 75.1v62h80.9c47.3-43.5 74.7-107.6 74.7-183.3z" />
              <path d="M249 492c67.4 0 124-22.4 165.3-60.9l-80.9-62c-22.5 15.1-51.3 24-84.4 24-64.9 0-119.8-43.9-139.6-102.9H27.4v64.8C67.2 442.1 151.2 492 249 492z" />
              <path d="M109.4 298.2c-4.8-14.1-7.6-29.2-7.6-44.7s2.8-30.6 7.6-44.7v-64.8H27.4C9.8 178.6 0 212.3 0 249s9.8 70.4 27.4 99.1l82-50.9z" />
              <path d="M249 97.5c36.7 0 69.5 12.7 95.3 37.7l71.3-71.3C373 28.3 317.1 0 249 0 151.2 0 67.2 49.9 27.4 124.9l82 64.8C129.2 141.4 184.1 97.5 249 97.5z" />
            </svg>
            Sign in with Google
          </button>
        </div>
        <p className="text-center text-sm mt-4 text-gray-600">
                  Not have an account?{' '}
                  <Link to="/register" className="text-blue-600 hover:underline">Signup</Link>
                </p>
      </div>
    </div>
  );
};

export default Login;
