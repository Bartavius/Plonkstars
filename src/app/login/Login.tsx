"use client";

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, loginFailure } from '../../redux/authSlice';
import api from '../../utils/api'; 
import { RootState } from '../../redux/store';
import Cookies from 'js-cookie';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const { error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post('/account/login', {
        username,
        password,
      });

      const token = response.data.token;
      
      // Store JWT token in a cookie
      Cookies.set('authToken', token, {
        expires: 7,
        secure: true,
        sameSite: 'Strict',
      });

      dispatch(loginSuccess(token));
    } catch (err: any) {
      dispatch(loginFailure(err.response?.data?.message || 'Login failed'));
    }
  };

  if (isAuthenticated) {
    return <div>Welcome, you are logged in!</div>;
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            style={{color: 'black'}}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            style={{color: 'black'}}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;