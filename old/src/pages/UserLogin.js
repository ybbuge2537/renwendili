import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserLogin = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple validation (in production, use proper authentication)
    // This is just a demo - in real app, you'd validate against a backend
    if (formData.username && formData.password) {
      console.log('登录成功:', formData);
      if (onLogin) {
        onLogin(true);
        navigate('/');
      }
    } else {
      setError('请输入用户名和密码');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>文舆世界 - 用户登录</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">用户名:</label>
            <input 
              type="text" 
              id="username" 
              name="username"
              value={formData.username} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">密码:</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              value={formData.password} 
              onChange={handleInputChange} 
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }}>登录</button>
          
          <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
            <span>还没有账号？ </span>
            <a href="/user/register" style={{ color: '#3498db', textDecoration: 'none' }}>立即注册</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;