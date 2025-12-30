import React, { useState, useEffect } from 'react';
import { checkActionPermission } from '../../services/permission';
import { useNavigate } from 'react-router-dom';

// 个人主页组件
const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  
  // 安全中心状态
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState({
    level: '弱',
    color: '#dc3545'
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [loginTimeout, setLoginTimeout] = useState(30); // 默认30分钟
  const [smsVerification, setSmsVerification] = useState(false); // 默认关闭短信验证
  
  // 操作日志状态
  const [logs, setLogs] = useState([]);
  const [logFilters, setLogFilters] = useState({
    timeRange: '7',
    operationType: 'all'
  });
  const [selectedLog, setSelectedLog] = useState(null);
  
  // 消息通知状态
  const [notifications, setNotifications] = useState([]);
  const [activeNotificationTab, setActiveNotificationTab] = useState('all');
  const [emailNotification, setEmailNotification] = useState(true);
  
  // 快捷入口状态
  const [quickAccessItems, setQuickAccessItems] = useState([]);
  const [isEditingQuickAccess, setIsEditingQuickAccess] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  // 初始化快捷入口
  useEffect(() => {
    if (user) {
      // 获取用户的快捷入口配置或使用默认配置
      const savedQuickAccess = localStorage.getItem(`quickAccess_${user.id}`);
      if (savedQuickAccess) {
        setQuickAccessItems(JSON.parse(savedQuickAccess));
      } else {
        // 默认快捷入口配置
        const defaultItems = [
          { id: 'dashboard', name: '仪表盘', url: '/dashboard', permission: 'dashboard' },
          { id: 'articles', name: '文章管理', url: '/articles', addUrl: '/articles/add', permission: 'articles', actions: ['view', 'add'] },
          { id: 'media', name: '媒体管理', url: '/media', addUrl: '/media/upload', permission: 'media', actions: ['view', 'upload'] },
          { id: 'categories', name: '分类管理', url: '/categories', addUrl: '/categories/add', permission: 'categories', actions: ['view', 'add'] },
          { id: 'users', name: '用户管理', url: '/users', addUrl: '/users/add', permission: 'users', actions: ['view', 'add'] },
          { id: 'settings', name: '系统设置', url: '/settings', permission: 'settings', actions: ['view'] }
        ];
        setQuickAccessItems(defaultItems);
      }
    }
  }, [user]);

  // 拖拽开始
  const handleDragStart = (index) => {
    setDraggedItem(index);
  };

  // 拖拽放置
  const handleDrop = (dropIndex) => {
    if (draggedItem === null) return;

    const newItems = [...quickAccessItems];
    const [dragged] = newItems.splice(draggedItem, 1);
    newItems.splice(dropIndex, 0, dragged);

    setQuickAccessItems(newItems);
    setDraggedItem(null);
  };
  
  const navigate = useNavigate();

  // 获取当前登录用户信息
  useEffect(() => {
    const fetchUserInfo = () => {
      try {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
          const userData = JSON.parse(loggedInUser);
          setUser(userData);
          
          // 生成模拟操作日志数据
          const mockLogs = [
            { id: 1, time: new Date(Date.now() - 1000 * 60 * 60).toISOString(), content: '修改了个人信息', result: 'success', ip: '192.168.1.1', type: 'profile' },
            { id: 2, time: new Date(Date.now() - 1000 * 60 * 120).toISOString(), content: '登录系统', result: 'success', ip: '192.168.1.1', type: 'security' },
            { id: 3, time: new Date(Date.now() - 1000 * 60 * 180).toISOString(), content: '提交了文章《测试文章》', result: 'success', ip: '192.168.1.1', type: 'content' },
            { id: 4, time: new Date(Date.now() - 1000 * 60 * 240).toISOString(), content: '上传了图片', result: 'success', ip: '192.168.1.1', type: 'content' },
            { id: 5, time: new Date(Date.now() - 1000 * 60 * 300).toISOString(), result: 'error', ip: '192.168.1.2', type: 'security', content: '尝试登录失败' },
            { id: 6, time: new Date(Date.now() - 1000 * 60 * 360).toISOString(), content: '修改了密码', result: 'success', ip: '192.168.1.1', type: 'security' },
            { id: 7, time: new Date(Date.now() - 1000 * 60 * 420).toISOString(), content: '编辑了文章《测试文章》', result: 'success', ip: '192.168.1.1', type: 'content' },
          ];
          setLogs(mockLogs);
          
          // 生成模拟消息通知数据
          const mockNotifications = [
            { id: 1, title: '文章审核结果', content: '您的文章《测试文章》已通过审核', time: new Date(Date.now() - 1000 * 60 * 30).toISOString(), read: false },
            { id: 2, title: '系统更新提醒', content: '系统将于今晚23:00进行维护更新', time: new Date(Date.now() - 1000 * 60 * 120).toISOString(), read: false },
            { id: 3, title: '密码即将过期', content: '您的密码将在7天后过期，请及时修改', time: new Date(Date.now() - 1000 * 60 * 240).toISOString(), read: true },
            { id: 4, title: '新的评论回复', content: '有人回复了您在《测试文章》上的评论', time: new Date(Date.now() - 1000 * 60 * 360).toISOString(), read: true },
            { id: 5, title: '权限变更通知', content: '您的角色已更新为编辑', time: new Date(Date.now() - 1000 * 60 * 480).toISOString(), read: true },
          ];
          setNotifications(mockNotifications);
        } else {
          // 用户未登录，跳转到登录页
          navigate('/login');
        }
      } catch (err) {
        setError('获取用户信息失败');
        console.error('获取用户信息失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  // 当用户数据变化时，更新编辑表单的初始值
  useEffect(() => {
    if (user) {
      setEditForm({
        email: user.email || '',
        phone: user.phone || '',
        department: user.department || ''
      });
      setAvatarPreview(null);
    }
  }, [user, isEditing]);

  // 获取角色名称
  const getRoleName = (role) => {
    const roleNames = {
      admin: 'admin',
      editor: 'editor',
      writer: 'writer',
      viewer: 'viewer',
      user: 'user'
    };
    return roleNames[role] || role;
  };

  // 获取快捷入口图标
  const getQuickAccessIcon = (id) => {
    const icons = {
      'dashboard': '📊', 'articles': '📝', 'media': '🖼️', 
      'categories': '🏷️', 'users': '👥', 'settings': '⚙️',
      'article-create': '📝', 'article-list': '📋', 'media-upload': '📤',
      'user-info': '👤', 'security-setting': '🔒'
    };
    return icons[id] || '📌';
  };

  // 获取快捷入口描述
  const getQuickAccessDescription = (id) => {
    const descriptions = {
      'dashboard': '查看仪表盘', 'articles': '文章管理', 
      'media': '媒体管理', 'categories': '分类管理', 
      'users': '用户管理', 'settings': '系统设置',
      'article-create': '快速创建新文章', 'article-list': '查看所有文章',
      'media-upload': '上传媒体文件', 'user-info': '管理个人信息',
      'security-setting': '修改安全设置'
    };
    return descriptions[id] || '';
  };

  // 表单验证
  const validateForm = () => {
    const errors = {};
    
    // 邮箱验证
    if (!editForm.email) {
      errors.email = '邮箱不能为空';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      errors.email = '邮箱格式不正确';
    }
    
    // 手机号验证（可选，但如果填写则需要格式正确）
    if (editForm.phone && !/^1[3-9]\d{9}$/.test(editForm.phone)) {
      errors.phone = '手机号格式不正确';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除对应字段的验证错误
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // 处理头像上传
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件');
        return;
      }
      
      // 检查文件大小（限制为2MB）
      if (file.size > 2 * 1024 * 1024) {
        alert('图片大小不能超过2MB');
        return;
      }
      
      // 创建预览
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 保存编辑
  const saveEdit = () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      // 更新用户数据
      const updatedUser = {
        ...user,
        ...editForm,
        update_time: new Date().toISOString()
      };
      
      // 如果有新头像，这里可以添加上传逻辑
      if (avatarPreview) {
        // 实际项目中这里应该上传到服务器，这里简化处理
        updatedUser.avatar = avatarPreview;
      }
      
      // 保存到localStorage
      localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
      
      // 更新状态
      setUser(updatedUser);
      setIsEditing(false);
      alert('个人信息更新成功');
    } catch (err) {
      console.error('保存失败:', err);
      alert('保存失败，请稍后重试');
    }
  };

  // 取消编辑
  const cancelEdit = () => {
    setIsEditing(false);
    setValidationErrors({});
    setAvatarPreview(null);
  };

  // 处理日志筛选
  const handleLogFilterChange = (filterName, value) => {
    setLogFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // 执行日志筛选
  const applyLogFilters = () => {
    // 筛选逻辑（实际项目中应该调用后端API）
    console.log('应用筛选条件:', logFilters);
  };

  // 导出日志
  const exportLogs = () => {
    // 导出日志逻辑（实际项目中应该调用后端API）
    alert('导出日志功能已触发');
  };

  // 查看日志详情
  const viewLogDetail = (log) => {
    setSelectedLog(selectedLog && selectedLog.id === log.id ? null : log);
  };

  // 处理密码修改
  const handlePasswordChange = () => {
    const errors = {};
    
    // 验证旧密码（实际项目中应该与后端验证）
    if (!passwordForm.oldPassword) {
      errors.oldPassword = '请输入旧密码';
    }
    
    // 验证新密码
    if (!passwordForm.newPassword) {
      errors.newPassword = '请输入新密码';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = '密码长度不能少于8位';
    } else if (!(/[a-z]/.test(passwordForm.newPassword) || /[A-Z]/.test(passwordForm.newPassword)) || !/\d/.test(passwordForm.newPassword)) {
      errors.newPassword = '密码需包含字母和数字';
    } else if (!/[^a-zA-Z0-9]/.test(passwordForm.newPassword)) {
      errors.newPassword = '密码需包含特殊字符';
    }
    
    // 验证确认密码
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = '请确认新密码';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = '两次输入的密码不一致';
    }
    
    setPasswordErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      // 密码修改逻辑（实际项目中应该调用后端API）
      try {
        // 更新用户密码
        const updatedUser = {
          ...user,
          password_updated_time: new Date().toISOString()
        };
        
        // 保存到localStorage
        localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
        
        // 更新用户状态
        setUser(updatedUser);
        
        // 清空表单
        setPasswordForm({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        alert('密码修改成功');
      } catch (err) {
        console.error('密码修改失败:', err);
        alert('密码修改失败，请稍后重试');
      }
    }
  };

  // 消息通知功能
  const markNotificationAsRead = (notificationId) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === notificationId ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== notificationId)
    );
  };

  const deleteAllNotifications = () => {
    setNotifications([]);
  };





  if (loading) {
    return <div className="user-profile-loading">加载中...</div>;
  }

  if (error) {
    return <div className="user-profile-error">{error}</div>;
  }

  if (!user) {
    return <div className="user-profile-error">用户未登录</div>;
  }

  return (
    <div className="user-profile-page">
      {/* 头部信息卡片 */}
      <div className="profile-header-card">
        <div className="avatar-large">
          {user.avatar ? (
            <img src={user.avatar} alt={user.username} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            user.username?.charAt(0)?.toUpperCase() || 'U'
          )}
        </div>
        <div className="header-info">
          <h1>个人主页</h1>
          <h2>{user.username}</h2>
          <div className={`role-badge role-${user.role}`}>{getRoleName(user.role)}</div>
          <div className="join-date">加入时间: {new Date(user.create_time).toLocaleDateString()}</div>
          <div className="last-login">最后登录: {user.last_login_time ? new Date(user.last_login_time).toLocaleString() : '从未登录'}</div>
          {user.last_login_ip && <div className="last-login-ip">登录IP: {user.last_login_ip}</div>}
        </div>
        <div className="header-actions">
          {activeTab === 'profile' && (
            <button 
              className="btn btn-primary" 
              onClick={() => setIsEditing(true)}
            >
              编辑个人信息
            </button>
          )}
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          个人资料
        </button>
        <button 
          className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          安全中心
        </button>
        <button 
          className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('logs')}
        >
          操作日志
        </button>
        <button 
          className={`tab-btn ${activeTab === 'permissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('permissions')}
        >
          权限说明
        </button>
        <button 
          className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          消息通知
        </button>
        <button 
          className={`tab-btn ${activeTab === 'quickAccess' ? 'active' : ''}`}
          onClick={() => setActiveTab('quickAccess')}
        >
          快捷入口
        </button>
      </div>

      {/* 标签页内容 */}
      <div className="tab-content">
        {/* 个人资料标签页 */}
        {activeTab === 'profile' && (
          <div className="user-profile-info">
            <h2>基本信息</h2>
            
            {isEditing ? (
              <div className="profile-edit-form">
                {/* 头像上传 */}
                <div className="form-group avatar-group">
                  <label>头像</label>
                  <div className="avatar-upload-container">
                    <div className="avatar-preview">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="预览" />
                      ) : user.avatar ? (
                        <img src={user.avatar} alt={user.username} />
                      ) : (
                        <div className="avatar-placeholder">
                          {user.username?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    <div className="avatar-upload-btn">
                      <input 
                        type="file" 
                        id="avatar-upload" 
                        accept="image/*" 
                        onChange={handleAvatarUpload} 
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="avatar-upload" className="btn btn-secondary">
                        选择图片
                      </label>
                    </div>
                    <p className="avatar-hint">支持JPG、PNG格式，大小不超过2MB</p>
                  </div>
                </div>
                
                {/* 表单字段 */}
                <div className="form-grid">
                  <div className="form-group">
                    <label>用户名</label>
                    <input 
                      type="text" 
                      value={user.username} 
                      disabled 
                      className="disabled-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>邮箱 *</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={editForm.email} 
                      onChange={handleInputChange}
                      className={validationErrors.email ? 'error-input' : ''}
                    />
                    {validationErrors.email && <div className="error-message">{validationErrors.email}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label>手机号</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={editForm.phone} 
                      onChange={handleInputChange}
                      className={validationErrors.phone ? 'error-input' : ''}
                    />
                    {validationErrors.phone && <div className="error-message">{validationErrors.phone}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label>所属部门</label>
                    <input 
                      type="text" 
                      name="department" 
                      value={editForm.department} 
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>角色</label>
                    <input 
                      type="text" 
                      value={getRoleName(user.role)} 
                      disabled 
                      className="disabled-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>注册时间</label>
                    <input 
                      type="text" 
                      value={new Date(user.create_time).toLocaleString()} 
                      disabled 
                      className="disabled-input"
                    />
                  </div>
                </div>
                
                {/* 表单操作按钮 */}
                <div className="form-actions">
                  <button className="btn btn-primary" onClick={saveEdit}>保存修改</button>
                  <button className="btn btn-secondary" onClick={cancelEdit}>取消</button>
                </div>
              </div>
            ) : (
              /* 静态信息显示 */
              <div className="info-grid">
                <div className="info-item">
                  <label>用户名:</label>
                  <span>{user.username}</span>
                </div>
                <div className="info-item editable">
                  <label>邮箱:</label>
                  <span>{user.email}</span>
                  <span className="edit-icon">✏️</span>
                </div>
                <div className="info-item editable">
                  <label>电话:</label>
                  <span>{user.phone || '未设置'}</span>
                  <span className="edit-icon">✏️</span>
                </div>
                <div className="info-item editable">
                  <label>所属部门:</label>
                  <span>{user.department || '未设置'}</span>
                  <span className="edit-icon">✏️</span>
                </div>
                <div className="info-item">
                  <label>角色:</label>
                  <span className={`role-${user.role}`}>{getRoleName(user.role)}</span>
                </div>
                <div className="info-item">
                  <label>注册时间:</label>
                  <span>{new Date(user.create_time).toLocaleString()}</span>
                </div>
                {user.update_time && (
                  <div className="info-item">
                    <label>最后更新:</label>
                    <span>{new Date(user.update_time).toLocaleString()}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 安全中心标签页 */}
        {activeTab === 'security' && (
          <div className="user-profile-security">
            <h2>安全中心</h2>
            
            {/* 密码修改 */}
            <div className="security-card">
              <h3>密码管理</h3>
              <div className="security-form">
                <div className="form-group">
                  <label>旧密码</label>
                  <input 
                    type="password" 
                    placeholder="请输入旧密码" 
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                  />
                  {passwordErrors.oldPassword && <div className="error-message">{passwordErrors.oldPassword}</div>}
                </div>
                <div className="form-group">
                  <label>新密码</label>
                  <input 
                    type="password" 
                    placeholder="请输入新密码" 
                    value={passwordForm.newPassword}
                    onChange={(e) => {
                      const newPassword = e.target.value;
                      setPasswordForm({...passwordForm, newPassword});
                       
                      // 密码强度检查
                      let strength = { level: '弱', color: '#dc3545' };
                      if (newPassword.length >= 8) {
                        if (/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) && /\d/.test(newPassword) && /[^a-zA-Z0-9]/.test(newPassword)) {
                          strength = { level: '强', color: '#28a745' };
                        } else if ((/[a-z]/.test(newPassword) || /[A-Z]/.test(newPassword)) && /\d/.test(newPassword)) {
                          strength = { level: '中', color: '#ffc107' };
                        }
                      }
                      setPasswordStrength(strength);
                    }}
                  />
                  <div className="password-strength">
                    <div className="strength-bar" style={{ width: passwordForm.newPassword ? 
                      (passwordStrength.level === '弱' ? '33%' : 
                       passwordStrength.level === '中' ? '66%' : '100%') : '0%',
                      backgroundColor: passwordStrength.color }}></div>
                    <div className="strength-text" style={{ color: passwordStrength.color }}>{passwordStrength.level}</div>
                  </div>
                  <p className="password-hint">密码需包含8位以上字母、数字和特殊字符</p>
                  {passwordErrors.newPassword && <div className="error-message">{passwordErrors.newPassword}</div>}
                </div>
                <div className="form-group">
                  <label>确认新密码</label>
                  <input 
                    type="password" 
                    placeholder="请再次输入新密码" 
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  />
                  {passwordErrors.confirmPassword && <div className="error-message">{passwordErrors.confirmPassword}</div>}
                </div>
                <button className="btn btn-primary" onClick={handlePasswordChange}>修改密码</button>
              </div>
            </div>
            
            {/* 登录设置 */}
            <div className="security-card">
              <h3>登录设置</h3>
              <div className="form-group">
                <label>登录超时时间</label>
                <select 
                  value={loginTimeout}
                  onChange={(e) => setLoginTimeout(parseInt(e.target.value))}
                >
                  <option value="15">15分钟</option>
                  <option value="30">30分钟</option>
                  <option value="60">60分钟</option>
                </select>
              </div>
              <div className="form-group">
                <label>登录短信验证</label>
                <div className="toggle-switch">
                  <input 
                    type="checkbox" 
                    id="sms-verification" 
                    checked={smsVerification}
                    onChange={(e) => setSmsVerification(e.target.checked)}
                    disabled={!user.phone}
                  />
                  <label htmlFor="sms-verification"></label>
                </div>
                <span className="toggle-label">{user.phone ? '已绑定手机号，可以开启' : '未绑定手机号，无法开启'}</span>
              </div>
            </div>
            
            {/* 绑定管理 */}
            <div className="security-card">
              <h3>绑定管理</h3>
              <div className="binding-list">
                <div className="binding-item">
                  <div className="binding-info">
                    <h4>邮箱绑定</h4>
                    <p>{user.email}</p>
                  </div>
                  <button className="btn btn-secondary" disabled>已绑定</button>
                </div>
                <div className="binding-item">
                  <div className="binding-info">
                    <h4>手机绑定</h4>
                    <p>{user.phone || '未绑定'}</p>
                  </div>
                  <button className="btn btn-primary">
                    {user.phone ? '解绑' : '绑定'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 操作日志标签页 */}
        {activeTab === 'logs' && (
          <div className="user-profile-logs">
            <h2>操作日志</h2>
            
            {/* 日志筛选 */}
            <div className="logs-filters cms-card">
              <div className="filter-group">
                <label>时间范围:</label>
                <select 
                  value={logFilters.timeRange}
                  onChange={(e) => handleLogFilterChange('timeRange', e.target.value)}
                >
                  <option value="7">近7天</option>
                  <option value="30">近30天</option>
                  <option value="custom">自定义时间</option>
                </select>
              </div>
              <div className="filter-group">
                <label>操作类型:</label>
                <select 
                  value={logFilters.operationType}
                  onChange={(e) => handleLogFilterChange('operationType', e.target.value)}
                >
                  <option value="all">全部操作类型</option>
                  <option value="content">内容管理</option>
                  <option value="security">安全设置</option>
                  <option value="profile">个人信息</option>
                </select>
              </div>
              <div className="filter-actions">
                <button className="btn btn-primary" onClick={applyLogFilters}>筛选</button>
                <button className="btn btn-secondary" onClick={exportLogs}>导出Excel</button>
              </div>
            </div>
            
            {/* 日志列表 */}
            <div className="logs-list">
              {logs.map((log, index) => (
                <div key={log.id} className={`log-item cms-card ${log.result} ${index % 2 === 0 ? 'even' : 'odd'}`}>
                  <div className="log-header" onClick={() => viewLogDetail(log)}>
                    <div className="log-basic-info">
                      <div className="log-content">{log.content}</div>
                      <div className="log-meta">
                        <span className="log-time">{new Date(log.time).toLocaleString()}</span>
                        <span className="log-ip">IP: {log.ip}</span>
                        <span className={`log-result result-${log.result}`}>
                          {log.result === 'success' ? '成功' : '失败'}
                        </span>
                      </div>
                    </div>
                    <div className="log-expand-btn">
                      <button className="btn btn-sm btn-secondary">
                        {selectedLog && selectedLog.id === log.id ? '收起' : '详情'}
                      </button>
                    </div>
                  </div>
                  
                  {/* 日志详情 */}
                  {selectedLog && selectedLog.id === log.id && (
                    <div className="log-detail">
                      <div className="log-detail-item">
                        <span className="detail-label">操作时间:</span>
                        <span className="detail-value">{new Date(log.time).toLocaleString()}</span>
                      </div>
                      <div className="log-detail-item">
                        <span className="detail-label">操作内容:</span>
                        <span className="detail-value">{log.content}</span>
                      </div>
                      <div className="log-detail-item">
                        <span className="detail-label">操作结果:</span>
                        <span className={`detail-value result-${log.result}`}>
                          {log.result === 'success' ? '成功' : '失败'}
                        </span>
                      </div>
                      <div className="log-detail-item">
                        <span className="detail-label">操作类型:</span>
                        <span className="detail-value">
                          {log.type === 'content' ? '内容管理' : 
                           log.type === 'security' ? '安全设置' : '个人信息'}
                        </span>
                      </div>
                      <div className="log-detail-item">
                        <span className="detail-label">IP地址:</span>
                        <span className="detail-value">{log.ip}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* 消息通知标签页 */}
        {activeTab === 'notifications' && (
          <div className="user-profile-notifications">
            <h2>消息通知</h2>
            
            {/* 通知标签和批量操作 */}
            <div className="notification-header">
              <div className="notification-tabs">
                <button 
                  className={`tab-btn ${activeNotificationTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveNotificationTab('all')}
                >
                  全部
                  <span className="notification-count">({notifications.length})</span>
                </button>
                <button 
                  className={`tab-btn ${activeNotificationTab === 'unread' ? 'active' : ''}`}
                  onClick={() => setActiveNotificationTab('unread')}
                >
                  未读
                  <span className="notification-count">
                    ({notifications.filter(n => !n.read).length})
                  </span>
                </button>
                <button 
                  className={`tab-btn ${activeNotificationTab === 'read' ? 'active' : ''}`}
                  onClick={() => setActiveNotificationTab('read')}
                >
                  已读
                  <span className="notification-count">
                    ({notifications.filter(n => n.read).length})
                  </span>
                </button>
              </div>
              
              <div className="notification-batch-actions">
                <button className="btn btn-sm btn-secondary" onClick={markAllNotificationsAsRead}>
                  全部标记已读
                </button>
                <button className="btn btn-sm btn-danger" onClick={deleteAllNotifications}>
                  清空通知
                </button>
              </div>
            </div>
            
            {/* 通知设置 */}
            <div className="notification-settings cms-card">
              <div className="settings-item">
                <label htmlFor="email-notification">邮件通知同步</label>
                <div className="toggle-switch">
                  <input 
                    type="checkbox" 
                    id="email-notification" 
                    checked={emailNotification}
                    onChange={(e) => setEmailNotification(e.target.checked)}
                  />
                  <label htmlFor="email-notification"></label>
                </div>
              </div>
            </div>
            
            {/* 通知列表 */}
            <div className="notifications-list">
              {(() => {
                // 根据当前标签筛选通知
                let filteredNotifications = notifications;
                if (activeNotificationTab === 'unread') {
                  filteredNotifications = notifications.filter(n => !n.read);
                } else if (activeNotificationTab === 'read') {
                  filteredNotifications = notifications.filter(n => n.read);
                }
                
                // 按时间倒序排序
                filteredNotifications.sort((a, b) => new Date(b.time) - new Date(a.time));
                
                return filteredNotifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item cms-card ${notification.read ? 'read' : 'unread'}`}
                    onClick={() => notification.read || markNotificationAsRead(notification.id)}
                  >
                    <div className="notification-content">
                      <h4>{notification.title}</h4>
                      <p>{notification.content}</p>
                      <div className="notification-time">
                        {new Date(notification.time).toLocaleString()}
                      </div>
                    </div>
                    <div className="notification-actions">
                      {!notification.read && (
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            markNotificationAsRead(notification.id);
                          }}
                        >
                          标记已读
                        </button>
                      )}
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        删除
                      </button>
                    </div>
                  </div>
                ));
              })()}
              
              {/* 空状态 */}
              {(() => {
                let filteredCount = notifications.length;
                if (activeNotificationTab === 'unread') {
                  filteredCount = notifications.filter(n => !n.read).length;
                } else if (activeNotificationTab === 'read') {
                  filteredCount = notifications.filter(n => n.read).length;
                }
                
                return filteredCount === 0 && (
                  <div className="empty-notifications">
                    <p>暂无通知</p>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* 权限说明标签页 */}
        {activeTab === 'permissions' && (
          <div className="user-profile-permissions">
            <h2>权限说明</h2>
            
            {/* 角色信息 */}
            <div className="role-info-card cms-card">
              <h3>角色信息</h3>
              <div className="role-name-badge">
                <div className={`role-badge role-${user.role}`}>{getRoleName(user.role)}</div>
                <div className="role-description highlight">
                  {user.role === 'admin' && '系统管理员：拥有所有权限，包括用户管理、角色分配等高级功能'}
                  {user.role === 'editor' && '编辑：负责文章创作、编辑和媒体上传'}
                  {user.role === 'writer' && '作者：负责文章创作和提交'}
                  {user.role === 'viewer' && '查看者：只能浏览内容，不能进行编辑操作'}
                  {user.role === 'user' && '普通用户：拥有基础的内容浏览和评论权限'}
                </div>
              </div>
            </div>

            {/* 权限矩阵表 */}
            <div className="permission-matrix-card cms-card">
              <h3>权限矩阵表</h3>
              <div className="permission-matrix-table">
                <table>
                  <thead>
                    <tr>
                      <th>模块</th>
                      <th>查看</th>
                      <th>新增</th>
                      <th>编辑</th>
                      <th>删除</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* 文章管理 */}
                    <tr>
                      <td>文章管理</td>
                      <td className={`permission-cell ${checkActionPermission(user, 'article', 'view') ? 'granted' : 'denied'}`} title="查看文章列表和详情">
                        {checkActionPermission(user, 'article', 'view') ? '✓' : '✗'}
                      </td>
                      <td className={`permission-cell ${checkActionPermission(user, 'article', 'add') ? 'granted' : 'denied'}`} title="创建新文章">
                        {checkActionPermission(user, 'article', 'add') ? '✓' : '✗'}
                      </td>
                      <td className={`permission-cell ${checkActionPermission(user, 'article', 'edit') ? 'granted' : 'denied'}`} title="编辑已存在的文章">
                        {checkActionPermission(user, 'article', 'edit') ? '✓' : '✗'}
                      </td>
                      <td className={`permission-cell ${checkActionPermission(user, 'article', 'delete') ? 'granted' : 'denied'}`} title="删除文章">
                        {checkActionPermission(user, 'article', 'delete') ? '✓' : '✗'}
                      </td>
                    </tr>
                    
                    {/* 媒体库 */}
                    <tr>
                      <td>媒体库</td>
                      <td className={`permission-cell ${checkActionPermission(user, 'media', 'view') ? 'granted' : 'denied'}`} title="查看媒体文件">
                        {checkActionPermission(user, 'media', 'view') ? '✓' : '✗'}
                      </td>
                      <td className={`permission-cell ${checkActionPermission(user, 'media', 'upload') ? 'granted' : 'denied'}`} title="上传媒体文件">
                        {checkActionPermission(user, 'media', 'upload') ? '✓' : '✗'}
                      </td>
                      <td className={`permission-cell ${checkActionPermission(user, 'media', 'edit') ? 'granted' : 'denied'}`} title="编辑媒体文件信息">
                        {checkActionPermission(user, 'media', 'edit') ? '✓' : '✗'}
                      </td>
                      <td className={`permission-cell ${checkActionPermission(user, 'media', 'delete') ? 'granted' : 'denied'}`} title="删除媒体文件">
                        {checkActionPermission(user, 'media', 'delete') ? '✓' : '✗'}
                      </td>
                    </tr>
                    
                    {/* 分类管理 */}
                    <tr>
                      <td>分类管理</td>
                      <td className={`permission-cell ${checkActionPermission(user, 'category', 'view') ? 'granted' : 'denied'}`} title="查看分类列表">
                        {checkActionPermission(user, 'category', 'view') ? '✓' : '✗'}
                      </td>
                      <td className={`permission-cell ${checkActionPermission(user, 'category', 'add') ? 'granted' : 'denied'}`} title="创建新分类">
                        {checkActionPermission(user, 'category', 'add') ? '✓' : '✗'}
                      </td>
                      <td className={`permission-cell ${checkActionPermission(user, 'category', 'edit') ? 'granted' : 'denied'}`} title="编辑分类信息">
                        {checkActionPermission(user, 'category', 'edit') ? '✓' : '✗'}
                      </td>
                      <td className={`permission-cell ${checkActionPermission(user, 'category', 'delete') ? 'granted' : 'denied'}`} title="删除分类">
                        {checkActionPermission(user, 'category', 'delete') ? '✓' : '✗'}
                      </td>
                    </tr>
                    
                    {/* 用户管理 */}
                    <tr>
                      <td>用户管理</td>
                      <td className={`permission-cell ${checkActionPermission(user, 'user', 'view') ? 'granted' : 'denied'}`} title="查看用户列表">
                        {checkActionPermission(user, 'user', 'view') ? '✓' : '✗'}
                      </td>
                      <td className={`permission-cell ${checkActionPermission(user, 'user', 'add') ? 'granted' : 'denied'}`} title="创建新用户">
                        {checkActionPermission(user, 'user', 'add') ? '✓' : '✗'}
                      </td>
                      <td className={`permission-cell ${checkActionPermission(user, 'user', 'edit') ? 'granted' : 'denied'}`} title="编辑用户信息">
                        {checkActionPermission(user, 'user', 'edit') ? '✓' : '✗'}
                      </td>
                      <td className={`permission-cell ${checkActionPermission(user, 'user', 'delete') ? 'granted' : 'denied'}`} title="删除用户">
                        {checkActionPermission(user, 'user', 'delete') ? '✓' : '✗'}
                      </td>
                    </tr>
                    
                    {/* 角色管理 */}
                    <tr>
                      <td>角色管理</td>
                      <td className={`permission-cell ${checkActionPermission(user, 'role', 'view') ? 'granted' : 'denied'}`} title="查看角色列表">
                        {checkActionPermission(user, 'role', 'view') ? '✓' : '✗'}
                      </td>
                      <td className={`permission-cell ${checkActionPermission(user, 'role', 'add') ? 'granted' : 'denied'}`} title="创建新角色">
                        {checkActionPermission(user, 'role', 'add') ? '✓' : '✗'}
                      </td>
                      <td className={`permission-cell ${checkActionPermission(user, 'role', 'edit') ? 'granted' : 'denied'}`} title="编辑角色权限">
                        {checkActionPermission(user, 'role', 'edit') ? '✓' : '✗'}
                      </td>
                      <td className={`permission-cell ${checkActionPermission(user, 'role', 'delete') ? 'granted' : 'denied'}`} title="删除角色">
                        {checkActionPermission(user, 'role', 'delete') ? '✓' : '✗'}
                      </td>
                    </tr>
                  </tbody>
                </table>
                
                {/* 权限变更记录 */}
                <div className="permission-change-record">
                  <h4>权限变更记录</h4>
                  <div className="change-record-item">
                    <div className="record-time">{user.permission_update_time ? new Date(user.permission_update_time).toLocaleString() : '从未变更'}</div>
                    <div className="record-by">调整人: {user.permission_updated_by || '系统默认'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 快捷入口标签页 */}
        {activeTab === 'quickAccess' && (
          <div className="user-profile-quick-access">
            <h2>快捷入口</h2>
            
            {/* 快捷入口列表 */}
            <div className="quick-access-section">
              <div className="quick-access-header">
                <h3>我的快捷入口</h3>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setIsEditingQuickAccess(!isEditingQuickAccess)}
                >
                  {isEditingQuickAccess ? '保存' : '自定义排序'}
                </button>
              </div>
              
              <div className="quick-access-grid">
                {quickAccessItems.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`quick-access-card cms-card ${isEditingQuickAccess ? 'draggable' : ''}`}
                    draggable={isEditingQuickAccess}
                    onDragStart={() => handleDragStart(index)}
                    onDrop={() => handleDrop(index)}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => !isEditingQuickAccess && navigate(item.url)}
                  >
                    <div className="quick-access-icon">
                      {getQuickAccessIcon(item.id)}
                    </div>
                    <div className="quick-access-content">
                      <h4>{item.name}</h4>
                      <p className="quick-access-description">
                        {getQuickAccessDescription(item.id)}
                      </p>
                      {isEditingQuickAccess && (
                        <div className="quick-access-drag-handle">
                          ⋮⋮
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;