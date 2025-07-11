import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../firebase/config';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import '../styles/Login.css';

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
    <div className="login-wrapper">
    <div className="login-overlay"></div>
    
    <div className="login-box">
      <h2 className="login-title">Welcome Back to <span>INVOICENEST</span></h2>
      <p className="login-subtitle">powered by aryantechworld</p>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="login-button">Login</button>
        </form>

        <button className="google-button" onClick={handleGoogleLogin}>
          <svg className="google-icon" viewBox="0 0 488 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M488 261.8c0-17.8-1.5-35-4.4-51.7H249v97.9h135.5c-5.8 31.1-23.5 57.4-50.1 75.1v62h80.9c47.3-43.5 74.7-107.6 74.7-183.3z" />
            <path d="M249 492c67.4 0 124-22.4 165.3-60.9l-80.9-62c-22.5 15.1-51.3 24-84.4 24-64.9 0-119.8-43.9-139.6-102.9H27.4v64.8C67.2 442.1 151.2 492 249 492z" />
            <path d="M109.4 298.2c-4.8-14.1-7.6-29.2-7.6-44.7s2.8-30.6 7.6-44.7v-64.8H27.4C9.8 178.6 0 212.3 0 249s9.8 70.4 27.4 99.1l82-50.9z" />
            <path d="M249 97.5c36.7 0 69.5 12.7 95.3 37.7l71.3-71.3C373 28.3 317.1 0 249 0 151.2 0 67.2 49.9 27.4 124.9l82 64.8C129.2 141.4 184.1 97.5 249 97.5z" />
          </svg>
          Sign in with Google
        </button>

        <p className="login-footer">
          Don’t have an account? <Link to="/register">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
