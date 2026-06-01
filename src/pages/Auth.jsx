import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import './Auth.css';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    
    let error;
    if (isLogin) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      error = signInError;

      if (error) {
        setErrorMsg(error.message);
      } else {
        navigate('/');
      }
    } else {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });
      error = signUpError;

      if (error) {
        setErrorMsg(error.message);
      } else if (data?.user && !data?.session) {
        // Supabase requires email confirmation
        setErrorMsg('Registration successful! Please check your email to confirm your account before logging in.');
        setIsLogin(true); // Switch to login mode for when they return
      } else {
        navigate('/');
      }
    }

    setLoading(false);
  };

  return (
    <div className="dark-auth-wrapper flex">
      {/* Left Side (Form) */}
      <div className="dark-auth-left">
        <div className="dark-auth-container">
          
          {/* Logo */}
          <div className="dark-logo mb-4">
            <svg viewBox="0 0 24 24" fill="none" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#6366f1"/>
              <path d="M2 17L12 22L22 17" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h2 className="dark-title">{isLogin ? 'Sign in to your account' : 'Create a new account'}</h2>
          
          <p className="dark-subtitle mb-6" style={{ color: '#9ca3af', fontSize: '14px' }}>
            {isLogin ? 'Not a member? ' : 'Already a member? '}
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="dark-link-btn" style={{ marginLeft: '4px' }}>
              {isLogin ? 'Create an account' : 'Sign in to your account'}
            </button>
          </p>

          {errorMsg && <div className="dark-error">{errorMsg}</div>}

          <form onSubmit={handleAuth} className="dark-form">
            {!isLogin && (
              <div className="dark-input-group mb-4">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="dark-input-group">
              <label>Email address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="dark-input-group mt-4">
              <label>Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {isLogin && (
              <div className="dark-form-actions flex justify-between items-center mt-4">
                <div className="remember-me flex items-center gap-2">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <a href="#" className="dark-link-btn text-sm">Forgot password?</a>
              </div>
            )}

            <button type="submit" className="dark-submit-btn mt-6" disabled={loading}>
              {loading ? 'Processing...' : (isLogin ? 'Sign in' : 'Sign up')}
            </button>
          </form>

        </div>
      </div>

      {/* Right Side (Image) */}
      <div className="dark-auth-right">
        {/* Bright desk setup image */}
      </div>
    </div>
  );
};

export default Auth;
