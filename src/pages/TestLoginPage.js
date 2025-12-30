// 测试登录状态检查页面
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.js';

const TestLoginPage = () => {
  const [localStorageData, setLocalStorageData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // 检查localStorage
    const loggedInUser = localStorage.getItem('loggedInUser');
    setLocalStorageData(loggedInUser);
    
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      setIsLoggedIn(true);
      setUserInfo(parsedUser);
    }
  }, []);

  // 模拟登录测试
  const handleTestLogin = () => {
    const mockUser = {
      user_id: 15,
      username: 'testuser3',
      email: 'test3@example.com',
      phone: '13800138000',
      role: 'user'
    };
    
    localStorage.setItem('loggedInUser', JSON.stringify(mockUser));
    setLocalStorageData(JSON.stringify(mockUser));
    setIsLoggedIn(true);
    setUserInfo(mockUser);
    
    alert('测试登录成功，已保存用户信息到localStorage');
  };

  // 模拟退出测试
  const handleTestLogout = () => {
    localStorage.removeItem('loggedInUser');
    setLocalStorageData(null);
    setIsLoggedIn(false);
    setUserInfo(null);
    
    alert('测试退出成功，已清除localStorage用户信息');
  };

  return (
    <div className="test-login-page">
      <Navbar />
      <div className="test-content">
        <h2>登录状态测试页面</h2>
        
        <div className="test-section">
          <h3>localStorage 信息</h3>
          <pre>{localStorageData ? localStorageData : '没有找到用户信息'}</pre>
        </div>

        <div className="test-section">
          <h3>登录状态</h3>
          <p>{isLoggedIn ? '已登录' : '未登录'}</p>
        </div>

        <div className="test-section">
          <h3>用户信息</h3>
          {userInfo ? (
            <div>
              <p>用户名: {userInfo.username}</p>
              <p>邮箱: {userInfo.email}</p>
              <p>电话: {userInfo.phone}</p>
              <p>角色: {userInfo.role}</p>
            </div>
          ) : (
            <p>没有用户信息</p>
          )}
        </div>

        <div className="test-buttons">
          <button onClick={handleTestLogin}>测试登录</button>
          <button onClick={handleTestLogout}>测试退出</button>
        </div>
      </div>

      <style jsx>{`
        .test-login-page {
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        
        .test-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
          border-radius: 8px;
        }
        
        .test-section {
          margin-bottom: 20px;
          padding: 15px;
          background-color: white;
          border-radius: 4px;
        }
        
        pre {
          background-color: #eee;
          padding: 10px;
          border-radius: 4px;
          overflow-x: auto;
        }
        
        .test-buttons {
          display: flex;
          gap: 10px;
        }
        
        button {
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default TestLoginPage;