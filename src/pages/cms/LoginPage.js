import React, { useState } from 'react';
import './LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    // 简单的表单验证
    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }

    // 这里应该调用API进行登录验证
    // 暂时使用模拟数据
    if (username === 'admin' && password === 'admin123') {
      // 登录成功，保存用户信息到localStorage
      localStorage.setItem('loggedInUser', JSON.stringify({ username, role: 'admin' }));
      // 重定向到CMS仪表盘
      window.location.href = '/cms/dashboard';
    } else {
      setError('用户名或密码错误');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>全球人文地理CMS后台登录</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
            />
          </div>
          <button type="submit" className="login-button">登录</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;