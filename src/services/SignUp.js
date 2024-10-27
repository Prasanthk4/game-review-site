import React, { useState } from 'react';
import { auth } from './firebase';
import { useNavigate, Link } from 'react-router-dom'; 


const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await auth.createUserWithEmailAndPassword(email, password);
      await result.user.updateProfile({
        displayName: `${firstName} ${lastName}`,
      });

      console.log('User signed up:', result.user);
      navigate('/');
    } catch (err) {
      setError(err.message);
      console.error('Error during sign up:', err);
    }
  };

  return (
    <div className="signup-container">
      <h2 className="text-3xl font-bold mb-4 text-white">Create an Account</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSignUp} className="flex flex-col space-y-4">
        <input 
          type="text" 
          placeholder="First Name" 
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className="p-2 border rounded text-gray-800 bg-white"
        />
        <input 
          type="text" 
          placeholder="Last Name" 
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className="p-2 border rounded text-gray-800 bg-white" 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 border rounded text-gray-800 bg-white"
        />
        <div className="relative">
          <input 
            type={showPassword ? 'text' : 'password'} 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 border rounded w-full text-gray-800 bg-white"
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)} 
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            {showPassword ? (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-gray-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12s2-4 9-4 9 4 9 4-2 4-9 4-9-4-9-4z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-gray-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12s2-4 9-4 9 4 9 4-2 4-9 4-9-4-9-4z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12c-1.5 1-3.5 1-5 0" />
              </svg>
            )}
          </button>
        </div>
        <button 
          type="submit" 
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-white">
        Already have an account? <Link to="/login" className="text-blue-500">Log in here</Link>
      </p>
    </div>
  );
};

export default Signup;
