import React, { useState, useEffect } from 'react';
import { userApi } from '../../services/api.js';

const LoginPage = ({ onLoginSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    captchaCode: ''
  });
  
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [captchaData, setCaptchaData] = useState(null);
  const [captchaId, setCaptchaId] = useState('');

  const fetchCaptcha = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/auth/captcha');
      const data = await response.json();
      setCaptchaData(data.captchaImage);
      setCaptchaId(data.captchaId);
    } catch (error) {
      console.error('获取验证码失败:', error);
      setErrorMessage('获取验证码失败，请刷新页面重试');
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.identifier.trim()) {
      newErrors.identifier = '用户名/邮箱/电话不能为空';
    }
    
    if (!formData.password) {
      newErrors.password = '密码不能为空';
    }
    
    if (!formData.captchaCode.trim()) {
      newErrors.captchaCode = '验证码不能为空';
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
        const verifyResponse = await fetch('http://localhost:5001/api/auth/verify-captcha', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            captchaId,
            captchaCode: formData.captchaCode
          })
        });
        
        if (!verifyResponse.ok) {
          const errorData = await verifyResponse.json();
          setErrorMessage(errorData.message || '验证码验证失败');
          fetchCaptcha();
          return;
        }
        
        const data = await userApi.login({
          identifier: formData.identifier,
          password: formData.password
        });
        
        localStorage.setItem('loggedInUser', JSON.stringify(data.user));
        
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
      } catch (error) {
        console.error('登录请求失败:', error);
        setErrorMessage(error.message || '登录请求失败，请稍后重试');
        fetchCaptcha();
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
          
          <div className="form-group">
            <label htmlFor="captchaCode">验证码:</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input 
                type="text" 
                id="captchaCode" 
                name="captchaCode"
                value={formData.captchaCode} 
                onChange={handleInputChange} 
                placeholder="请输入验证码"
                required
                style={{ flex: 1 }}
              />
              <div 
                dangerouslySetInnerHTML={{ __html: captchaData }} 
                onClick={fetchCaptcha}
                style={{ 
                  cursor: 'pointer', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  padding: '5px',
                  minWidth: '120px',
                  textAlign: 'center'
                }}
                title="点击刷新验证码"
              />
            </div>
            {errors.captchaCode && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>{errors.captchaCode}</div>}
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