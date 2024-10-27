import React, { useState } from 'react';
import './Login.css';
import './firebase'; 
import { auth, googleAuthProvider } from './firebase'; // Ensure googleAuthProvider is imported
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      console.log('Signed in successfully');
      navigate('/home');
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Error signing in: ' + error.message);
    }
  };

  const handleSignUp = () => {
    navigate('/signup'); 
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await auth.signInWithPopup(googleAuthProvider);
      console.log('User Info:', result.user);
      navigate('/home');
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      alert('Error during Google sign-in: ' + error.message); // Added error handling
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert('Please enter your email address to reset your password.');
      return;
    }
    try {
      await auth.sendPasswordResetEmail(email);
      alert('Password reset email sent!');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      alert('Error sending password reset email: ' + error.message);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="flex-column">
        <label className="text-white">Email</label>
      </div>
      <div className="inputForm">
        <input
          type="text"
          className="input text-gray-800 bg-white" // Adjust background and text colors
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="flex-column">
        <label className="text-white">Password</label>
      </div>
      <div className="inputForm relative">
        <input
          type={showPassword ? 'text' : 'password'} // Toggle between text and password
          className="input text-gray-800 bg-white" // Adjust background and text colors
          placeholder="Enter your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button 
          type="button" 
          onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
          className="absolute inset-y-0 right-0 flex items-center pr-3" // Positioning for the eye icon
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

      <div className="flex-row">
        <div>
          <input type="checkbox" id="remember" name="remember" />
          <label htmlFor="remember" className="text-white">Remember me</label>
        </div>
        <span className="span text-white" onClick={handleForgotPassword} style={{ cursor: 'pointer' }}>Forgot password?</span>
      </div>
      <button type="submit" className="button-submit">Sign In</button>

      <p className="p text-white">Don't have an account? <span className="span" onClick={handleSignUp} style={{ cursor: 'pointer' }}>Sign Up</span></p>

      <p className="p line text-white">Or With</p>

      <div className="flex-row">
        <button type="button" className="btn google" onClick={handleGoogleSignIn}>
          <svg version="1.1" width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path style={{ fill: '#FBBB00' }} d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456C103.821,274.792,107.225,292.797,113.47,309.408z"></path>
            <path style={{ fill: '#518EF8' }} d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z"></path>
            <path style={{ fill: '#28B446' }} d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z"></path>
            <path style={{ fill: '#F14336' }} d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0C318.115,0,375.068,22.126,419.404,58.936z"></path>
          </svg>
          Google
        </button>
      </div>
    </form>
  );
};

export default Login;
