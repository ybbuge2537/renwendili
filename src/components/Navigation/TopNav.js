import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navigationMenu } from '../../data/navigation';
import { isAdmin, isEditorOrHigher, isWriterOrHigher } from '../../services/permission';

const TopNav = ({ onHamburgerClick, onShowLoginModal, loggedInUser, onLogout }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [expandedMenu, setExpandedMenu] = useState(null);
  const location = useLocation();

  // 根据当前路径设置激活的菜单
  useEffect(() => {
    const path = location.pathname;
    const active = navigationMenu.find(menu => 
      path === menu.path || 
      menu.children?.some(child => path.startsWith(child.path))
    );
    if (active) {
      setActiveMenu(active.id);
    }
  }, [location.pathname]);

  // 角色映射函数，将导航数据中的角色映射到权限服务中的角色
  const mapRoleToPermissionRole = (role) => {
    switch(role) {
      case 'visitor': return 'viewer';
      case 'creator': return 'writer';
      case 'user': return 'user';
      case 'admin': return 'admin';
      default: return 'viewer';
    }
  };

  // 检查用户是否有权限访问菜单项
  const hasPermission = (menuItem) => {
    if (!menuItem.permissions) return true;
    
    if (!loggedInUser) {
      // 未登录用户只有visitor权限
      return menuItem.permissions.includes('visitor');
    }

    const userRole = mapRoleToPermissionRole(loggedInUser.role);
    
    // 检查用户角色是否在菜单项的权限列表中
    return menuItem.permissions.some(permission => {
      const mappedPermission = mapRoleToPermissionRole(permission);
      return userRole === mappedPermission ||
             (isAdmin(loggedInUser) && mappedPermission === 'admin') ||
             (isEditorOrHigher(loggedInUser) && (mappedPermission === 'editor' || mappedPermission === 'writer' || mappedPermission === 'user' || mappedPermission === 'viewer')) ||
             (isWriterOrHigher(loggedInUser) && (mappedPermission === 'writer' || mappedPermission === 'user' || mappedPermission === 'viewer'));
    });
  };

  // 处理菜单展开/收起
  const handleMenuToggle = (menuId) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
  };

  // 处理退出登录
  const handleLogout = () => {
    onLogout();
    window.location.href = '/';
  };

  return (
    <div className="top-nav">
      {/* 移动端汉堡菜单按钮 */}
      <button className="hamburger-btn" onClick={onHamburgerClick}>
        ☰
      </button>

      {/* 平台logo */}
      <div className="nav-logo">
        <Link to="/">
          <h1>文舆世界</h1>
          <p className="nav-subtitle">齐赏华夏文明</p>
        </Link>
      </div>

      {/* 导航菜单 */}
      <div className="nav-menu">
        {navigationMenu
          .filter(menu => hasPermission(menu))
          .map(menu => (
            <div key={menu.id} className="nav-item">
              <button 
                className={`nav-link ${activeMenu === menu.id ? 'active' : ''}`}
                onClick={() => menu.children ? handleMenuToggle(menu.id) : null}
              >
                <span className="nav-icon">{menu.icon}</span>
                <span className="nav-text">{menu.name}</span>
                {menu.children && (
                  <span className={`nav-arrow ${expandedMenu === menu.id ? 'expanded' : ''}`}>
                    ▼
                  </span>
                )}
              </button>

              {/* 二级菜单 */}
              {menu.children && expandedMenu === menu.id && (
                <div className="dropdown-menu">
                  {menu.children
                    .filter(child => hasPermission(child))
                    .map(child => (
                      <Link 
                        key={child.id} 
                        to={child.path}
                        className="dropdown-item"
                        onClick={() => setExpandedMenu(null)}
                      >
                        {child.name}
                      </Link>
                    ))
                  }
                </div>
              )}
            </div>
          ))
        }
      </div>

      {/* 右侧操作区 */}
      <div className="nav-actions">
        {/* 搜索框 */}
        <div className="search-box">
          <input type="text" placeholder="搜索地点、文化、历史..." />
          <button className="search-btn">🔍</button>
        </div>

        {/* 用户信息/登录按钮 */}
        {loggedInUser ? (
          <div className="user-info">
            <span className="welcome-text">欢迎, </span>
            <Link to="/user/profile" className="username-link">{loggedInUser.username}</Link>
            <button className="logout-btn" onClick={handleLogout}>退出</button>
          </div>
        ) : (
          <div className="auth-buttons">
            <button className="login-btn" onClick={onShowLoginModal}>登录</button>
            <Link to="/user/register" className="register-btn">注册</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopNav;
