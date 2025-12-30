import React, { useState } from 'react';

const UserRegister = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = '用户名不能为空';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '邮箱不能为空';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }
    
    if (!formData.password) {
      newErrors.password = '密码不能为空';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码长度不能少于6个字符';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Here you would normally send data to a server
      // For this demo, we'll just show a success message
      console.log('注册成功:', formData);
      setSuccessMessage('注册成功！欢迎加入文舆世界！');
      
      // Clear form
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
      // Call the onRegister callback if provided
      if (onRegister) {
        onRegister();
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>文舆世界 - 用户注册</h2>
        
        {successMessage && (
          <div style={{ 
            backgroundColor: '#d4edda', 
            color: '#155724', 
            padding: '10px', 
            borderRadius: '4px', 
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            {successMessage}
          </div>
        )}
        
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
            {errors.username && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>{errors.username}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">邮箱:</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              value={formData.email} 
              onChange={handleInputChange} 
              required 
            />
            {errors.email && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>{errors.email}</div>}
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
            {errors.password && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>{errors.password}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">确认密码:</label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword"
              value={formData.confirmPassword} 
              onChange={handleInputChange} 
              required 
            />
            {errors.confirmPassword && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>{errors.confirmPassword}</div>}
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }}>注册</button>
          
          <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
            <span>已有账号？ </span>
            <a href="/user/login" style={{ color: '#3498db', textDecoration: 'none' }}>立即登录</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserRegister;