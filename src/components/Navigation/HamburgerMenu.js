import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navigationMenu } from '../../data/navigation';
import { isAdmin, isEditorOrHigher, isWriterOrHigher } from '../../services/permission';

const HamburgerMenu = ({ isOpen, onClose }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [expandedMenus, setExpandedMenus] = useState({});
  const location = useLocation();

  // 检查用户是否已登录
  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    if (user) {
      setLoggedInUser(JSON.parse(user));
    }
  }, []);

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

  // 切换菜单展开状态
  const toggleMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  // 处理菜单项点击
  const handleMenuItemClick = () => {
    onClose();
    setExpandedMenus({});
  };

  // 处理退出登录
  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setLoggedInUser(null);
    onClose();
    window.location.href = '/';
  };

  // 递归渲染菜单（支持三级）
  const renderMenuItems = (menuItems, level = 0) => {
    return (
      <ul className={`menu-level-${level}`}>
        {menuItems
          .filter(item => hasPermission(item))
          .map(item => (
            <li key={item.id} className={`menu-item ${level > 0 ? 'submenu-item' : ''}`}>
              {item.children ? (
                <div className="menu-with-children">
                  <button 
                    className={`menu-link ${activeMenu === item.id ? 'active' : ''}`}
                    onClick={() => toggleMenu(item.id)}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    <span className="menu-text">{item.name}</span>
                    <span className={`menu-arrow ${expandedMenus[item.id] ? 'expanded' : ''}`}>
                      {expandedMenus[item.id] ? '▼' : '▶'}
                    </span>
                  </button>
                  {expandedMenus[item.id] && (
                    <div className="submenu">
                      {renderMenuItems(item.children, level + 1)}
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  to={item.path}
                  className={`menu-link ${activeMenu === item.id ? 'active' : ''}`}
                  onClick={handleMenuItemClick}
                >
                  <span className="menu-icon">{item.icon || '•'}</span>
                  <span className="menu-text">{item.name}</span>
                </Link>
              )}
            </li>
          ))
        }
      </ul>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="hamburger-menu-overlay">
      <div className="hamburger-menu">
        {/* 关闭按钮 */}
        <button className="menu-close-btn" onClick={onClose}>
          ✕
        </button>

        {/* 菜单内容 */}
        <div className="menu-content">
          {/* 用户信息 */}
          <div className="menu-user-info">
            {loggedInUser ? (
              <div className="logged-in-user">
                <p className="welcome-text">欢迎, {loggedInUser.username}</p>
                <button className="logout-btn" onClick={handleLogout}>退出登录</button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/user/login" className="login-btn" onClick={onClose}>登录</Link>
                <Link to="/user/register" className="register-btn" onClick={onClose}>注册</Link>
              </div>
            )}
          </div>

          {/* 导航菜单 */}
          <div className="mobile-nav">
            {renderMenuItems(navigationMenu)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HamburgerMenu;
