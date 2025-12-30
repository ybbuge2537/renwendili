import React, { useState } from 'react';

const LoginPage = ({ onLoginSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.identifier.trim()) {
      newErrors.identifier = '用户名/邮箱/电话不能为空';
    }
    
    if (!formData.password) {
      newErrors.password = '密码不能为空';
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
    
    // Clear global error message
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:5001/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            identifier: formData.identifier,
            password: formData.password
          })
        });
        
        if (response.ok) {
      const data = await response.json();
      console.log('登录成功:', data);
      // 保存用户信息到localStorage
      localStorage.setItem('loggedInUser', JSON.stringify(data.user));
      
      // 调用登录成功回调
      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }
    } else {
            const errorData = await response.json();
            setErrorMessage(errorData.message || '登录失败，请检查您的用户名/邮箱/电话和密码');
          }
      } catch (error) {
        console.error('登录请求失败:', error);
        setErrorMessage('登录请求失败，请稍后重试');
      }
    } else {
      setErrorMessage('请检查输入信息');
    }
  };

  return (
      <div className="login-form" style={{ position: 'relative' }}>
        <button className="login-modal-close" onClick={onClose} style={{ position: 'absolute', top: '5px', right: '5px', background: 'none', border: 'none', fontSize: '24px', color: '#999', cursor: 'pointer', padding: '5px', lineHeight: '1', zIndex: '10' }}>×</button>
        <h2>文舆世界 - 用户登录</h2>
        
        {errorMessage && (
          <div className="error-message">{errorMessage}</div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="identifier">用户名/邮箱/电话:</label>
            <input 
              type="text" 
              id="identifier" 
              name="identifier"
              value={formData.identifier} 
              onChange={handleInputChange} 
              required 
              placeholder="请输入用户名、邮箱或电话"
            />
            {errors.identifier && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>{errors.identifier}</div>}
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
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }}>登录</button>
          
          <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
            <span>还没有账号？ </span>
            <a href="/user/register" style={{ color: '#3498db', textDecoration: 'none' }}>立即注册</a>
          </div>
        </form>
      </div>
  );
};

export default LoginPage;