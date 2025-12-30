import React, { useState } from 'react';
import bcrypt from 'bcryptjs';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [validationStatus, setValidationStatus] = useState({});
  
  // Debounce function to delay API calls
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };
  
  // Check username uniqueness
  const checkUsernameUnique = async (username) => {
    if (!username.trim()) return;
    
    try {
      const response = await fetch(`http://localhost:5001/api/users/username/${username}`);
      if (response.ok) {
        setValidationStatus(prev => ({ ...prev, username: 'exists' }));
        setErrors(prev => ({ ...prev, username: '用户名已存在' }));
      } else {
        setValidationStatus(prev => ({ ...prev, username: 'unique' }));
        if (errors.username === '用户名已存在') {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.username;
            return newErrors;
          });
        }
      }
    } catch (error) {
      console.error('检查用户名唯一性失败:', error);
    }
  };
  
  // Check email uniqueness
  const checkEmailUnique = async (email) => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    
    try {
      const response = await fetch(`http://localhost:5001/api/users/email/${email}`);
      if (response.ok) {
        setValidationStatus(prev => ({ ...prev, email: 'exists' }));
        setErrors(prev => ({ ...prev, email: '邮箱已存在' }));
      } else {
        setValidationStatus(prev => ({ ...prev, email: 'unique' }));
        if (errors.email === '邮箱已存在') {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.email;
            return newErrors;
          });
        }
      }
    } catch (error) {
      console.error('检查邮箱唯一性失败:', error);
    }
  };
  
  // Check phone uniqueness
  const checkPhoneUnique = async (phone) => {
    if (!phone.trim()) return;
    
    try {
      const response = await fetch(`http://localhost:5001/api/users/phone/${phone}`);
      if (response.ok) {
        setValidationStatus(prev => ({ ...prev, phone: 'exists' }));
        setErrors(prev => ({ ...prev, phone: '电话已存在' }));
      } else {
        setValidationStatus(prev => ({ ...prev, phone: 'unique' }));
        if (errors.phone === '电话已存在') {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.phone;
            return newErrors;
          });
        }
      }
    } catch (error) {
      console.error('检查电话唯一性失败:', error);
    }
  };
  
  // Debounced validation functions
  const debouncedCheckUsername = debounce(checkUsernameUnique, 500);
  const debouncedCheckEmail = debounce(checkEmailUnique, 500);
  const debouncedCheckPhone = debounce(checkPhoneUnique, 500);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = '用户名不能为空';
    } else if (validationStatus.username === 'exists') {
      newErrors.username = '用户名已存在';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '邮箱不能为空';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    } else if (validationStatus.email === 'exists') {
      newErrors.email = '邮箱已存在';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = '电话不能为空';
    } else if (validationStatus.phone === 'exists') {
      newErrors.phone = '电话已存在';
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
    
    // Real-time uniqueness validation
    if (name === 'username') {
      debouncedCheckUsername(value);
    } else if (name === 'email') {
      debouncedCheckEmail(value);
    } else if (name === 'phone') {
      debouncedCheckPhone(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(formData.password, 10);
        
        // Prepare user data with default values
        const userData = {
          username: formData.username,
          password_hash: hashedPassword,
          email: formData.email,
          phone: formData.phone, // Use actual phone value from form
          role: 'user' // Default role as user
        };
        
        // Send data to server
        const response = await fetch('http://localhost:5001/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
        
        if (response.ok) {
          const newUser = await response.json();
          console.log('注册成功:', newUser);
          setSuccessMessage('注册成功！欢迎加入文舆世界！');
          
          // Clear form
          setFormData({
            username: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: ''
          });
          
          // Clear validation status and errors
          setValidationStatus({});
          setErrors({});
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || '注册失败');
        }
      } catch (error) {
        console.error('注册错误:', error);
        setErrors({ submit: error.message });
        // Clear success message if there was one
        setSuccessMessage('');
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
            <label htmlFor="phone">电话:</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone"
              value={formData.phone} 
              onChange={handleInputChange} 
              required
            />
            {errors.phone && <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px' }}>{errors.phone}</div>}
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

export default RegisterPage;