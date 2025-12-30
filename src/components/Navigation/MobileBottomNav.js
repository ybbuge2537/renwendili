import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { mobileBottomNav } from '../../data/navigation';

const MobileBottomNav = () => {
  const [activeTab, setActiveTab] = useState('mobile-home');
  const location = useLocation();

  // 根据当前路径设置激活的标签
  useEffect(() => {
    const path = location.pathname;
    
    if (path === '/') {
      setActiveTab('mobile-home');
    } else if (path.startsWith('/knowledge')) {
      setActiveTab('mobile-knowledge');
    } else if (path.startsWith('/community')) {
      setActiveTab('mobile-community');
    } else if (path.startsWith('/user/profile')) {
      setActiveTab('mobile-profile');
    }
  }, [location.pathname]);

  return (
    <div className="mobile-bottom-nav">
      {mobileBottomNav.map(item => (
        <Link
          key={item.id}
          to={item.path}
          className={`bottom-nav-item ${activeTab === item.id ? 'active' : ''}`}
        >
          <span className="bottom-nav-icon">{item.icon}</span>
          <span className="bottom-nav-text">{item.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default MobileBottomNav;
