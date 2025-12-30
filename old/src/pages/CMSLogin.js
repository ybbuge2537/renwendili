import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CMSLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation (in production, use proper authentication)
    if (username === 'admin' && password === 'admin123') {
      onLogin(true);
      navigate('/cms/dashboard');
    } else {
      setError('用户名或密码错误');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>文舆世界 - CMS后台登录</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">用户名:</label>
            <input 
              type="text" 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">密码:</label>
            <input 
              type="password" 
              id="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary">登录</button>
        </form>
      </div>
    </div>
  );
};

export default CMSLogin;