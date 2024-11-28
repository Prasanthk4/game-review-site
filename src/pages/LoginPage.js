import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      setError('Failed to log in. Please check your credentials.');
      console.error('Login error:', error);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }

    try {
      setIsResetting(true);
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setError('');
    } catch (error) {
      setError('Failed to send reset email. Please check your email address.');
      console.error('Reset password error:', error);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-[#121212] to-black">
      <div className="bg-gray-800/50 p-8 rounded-lg shadow-lg max-w-md w-full backdrop-blur-sm border border-gray-700/50">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {resetSent && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-3 rounded mb-4 text-sm">
            Password reset email sent! Check your inbox.
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700/50 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700/50 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-purple-600 text-white rounded py-2 px-4 hover:bg-purple-700 transition-colors"
            >
              Login
            </button>

            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={isResetting}
              className="text-purple-400 hover:text-purple-300 text-sm transition-colors disabled:opacity-50"
            >
              {isResetting ? 'Sending...' : 'Forgot Password?'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-purple-400 hover:text-purple-300"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
