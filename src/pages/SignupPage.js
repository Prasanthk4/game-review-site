import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const SignupPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: userCredential.user.email,
        favorites: []
      });

      navigate('/');
    } catch (error) {
      setError('Failed to create account. ' + error.message);
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-[#121212] to-black">
      <div className="bg-gray-800/50 p-8 rounded-lg shadow-lg max-w-md w-full backdrop-blur-sm border border-gray-700/50">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
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

          <button
            type="submit"
            className="w-full bg-purple-600 text-white rounded py-2 hover:bg-purple-700 transition-colors"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-purple-400 hover:text-purple-300"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
