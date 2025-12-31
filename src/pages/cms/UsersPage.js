import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CMSLayout from '../../components/cms/CMSLayout.js';
import { isAdmin } from '../../services/permission.js';
import { userApi } from '../../services/api.js';
import './UsersPage.css';

function UsersPage() {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  useEffect(() => {
    if (!loggedInUser) {
      navigate('/cms/login');
    } else if (!isAdmin(loggedInUser)) {
      navigate('/cms/dashboard');
    }
  }, [loggedInUser, navigate]);

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    bio: '',
    role: 'user'
  });
  
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    locked: 0
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userApi.getAllUsers();
        const usersData = response.users || [];
        const formattedUsers = usersData.map(user => ({
          id: user.user_id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar_url,
          bio: user.bio,
          role: user.role,
          status: user.is_enabled ? 'active' : 'inactive',
          createdAt: user.create_time ? new Date(user.create_time).toISOString().split('T')[0] : '',
          lastLoginTime: user.last_login_time ? new Date(user.last_login_time).toISOString().split('T')[0] : '从未登录',
          loginCount: user.login_count || 0,
          failedAttempts: user.login_error_count || 0,
          lockedUntil: null
        }));
        setUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
        
        setUserStats({
          total: formattedUsers.length,
          active: formattedUsers.filter(u => u.status === 'active').length,
          inactive: formattedUsers.filter(u => u.status === 'inactive').length,
          locked: formattedUsers.filter(u => u.lockedUntil && new Date(u.lockedUntil) > new Date()).length
        });
      } catch (error) {
        console.error('获取用户列表失败:', error);
        setUsers([]);
        setFilteredUsers([]);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    if (window.confirm('确定要添加此用户吗？其他详细信息可由用户登录后自行补全。')) {
      try {
        const userData = {
          username: newUser.username,
          password: newUser.password,
          email: newUser.email,
          phone: newUser.phone || '',
          bio: newUser.bio || '',
          role: newUser.role,
          status: 'active'
        };
        
        const addedUser = await userApi.createUser(userData);
        
        const formattedUser = {
          id: addedUser.user_id,
          username: addedUser.username,
          email: addedUser.email,
          phone: addedUser.phone,
          avatar: addedUser.avatar,
          bio: addedUser.bio,
          role: addedUser.role,
          status: addedUser.status || 'active',
          createdAt: addedUser.create_time ? new Date(addedUser.create_time).toISOString().split('T')[0] : '',
          lastLoginTime: '从未登录',
          loginCount: 0,
          failedAttempts: 0,
          lockedUntil: null
        };
        
        setUsers([...users, formattedUser]);
        setNewUser({ username: '', email: '', password: '', phone: '', bio: '', role: 'user' });
        setShowAddUserModal(false);
        alert('用户添加成功！');
      } catch (error) {
        console.error('添加用户失败:', error);
        alert('添加用户失败，请稍后重试');
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('确定要删除此用户吗？此操作不可恢复。')) {
      try {
        await userApi.deleteUser(id);
        setUsers(users.filter(user => user.id !== id));
        alert('用户删除成功！');
      } catch (error) {
        console.error('删除用户失败:', error);
        alert('删除用户失败，请稍后重试');
      }
    }
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setNewUser({
      username: user.username,
      email: user.email,
      phone: user.phone || '',
      bio: user.bio || '',
      role: user.role
    });
    setShowEditUserModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    if (window.confirm('确定要更新此用户信息吗？')) {
      try {
        const updatedUser = await userApi.updateUser(currentUser.id, newUser);
        
        const updatedUsers = users.map(user => {
          if (user.id === currentUser.id) {
            return {
              ...user,
              username: updatedUser.username,
              email: updatedUser.email,
              phone: updatedUser.phone,
              bio: updatedUser.bio,
              role: updatedUser.role
            };
          }
          return user;
        });
        setUsers(updatedUsers);
        setShowEditUserModal(false);
        setCurrentUser(null);
        setNewUser({ username: '', email: '', password: '', phone: '', bio: '', role: 'user' });
        alert('用户信息更新成功！');
      } catch (error) {
        console.error('更新用户失败:', error);
        alert('更新用户失败，请稍后重试');
      }
    }
  };

  const handleResetPassword = (user) => {
    setCurrentUser(user);
    setNewUser({ ...newUser, password: '' });
    setShowResetPasswordModal(true);
  };

  const handleConfirmResetPassword = async (e) => {
    e.preventDefault();
    
    if (window.confirm('确定要重置该用户的密码吗？')) {
      try {
        await userApi.resetPassword(currentUser.id, newUser.password);
        setShowResetPasswordModal(false);
        setCurrentUser(null);
        setNewUser({ ...newUser, password: '' });
        alert('密码重置成功！');
      } catch (error) {
        console.error('重置密码失败:', error);
        alert('重置密码失败，请稍后重试');
      }
    }
  };

  const handleLockUser = async (user) => {
    if (window.confirm('确定要锁定该用户吗？')) {
      try {
        await userApi.lockUser(user.id);
        const updatedUsers = users.map(u => {
          if (u.id === user.id) {
            return { ...u, lockedUntil: new Date(Date.now() + 30 * 60 * 1000).toISOString().split('T')[0] };
          }
          return u;
        });
        setUsers(updatedUsers);
        alert('用户已锁定！');
      } catch (error) {
        console.error('锁定用户失败:', error);
        alert('锁定用户失败，请稍后重试');
      }
    }
  };

  const handleUnlockUser = async (user) => {
    if (window.confirm('确定要解锁该用户吗？')) {
      try {
        await userApi.unlockUser(user.id);
        const updatedUsers = users.map(u => {
          if (u.id === user.id) {
            return { ...u, lockedUntil: null };
          }
          return u;
        });
        setUsers(updatedUsers);
        alert('用户已解锁！');
      } catch (error) {
        console.error('解锁用户失败:', error);
        alert('解锁用户失败，请稍后重试');
      }
    }
  };
  
  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
    }
  };
  
  const checkPasswordStrength = (password) => {
    if (password.length === 0) return '';
    if (password.length < 6) return 'weak';
    if (password.length < 8) return 'medium';
    if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password)) {
      return password.length > 10 ? 'strong' : 'medium';
    }
    return 'medium';
  };
  
  const getPasswordStrengthInfo = () => {
    switch (passwordStrength) {
      case 'weak':
        return { text: '弱', color: '#ff4d4f' };
      case 'medium':
        return { text: '中', color: '#faad14' };
      case 'strong':
        return { text: '强', color: '#52c41a' };
      default:
        return { text: '', color: '' };
    }
  };
  
  useEffect(() => {
    let result = [...users];
    
    if (filterRole !== 'all') {
      result = result.filter(user => user.role === filterRole);
    }
    
    if (filterStatus !== 'all') {
      if (filterStatus === 'locked') {
        result = result.filter(user => user.lockedUntil && new Date(user.lockedUntil) > new Date());
      } else {
        result = result.filter(user => user.status === filterStatus);
      }
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user => 
        user.username.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query) ||
        (user.phone && user.phone.includes(query))
      );
    }
    
    setFilteredUsers(result);
  }, [filterRole, filterStatus, searchQuery, users]);
  
  const handleFilterRoleChange = (e) => {
    setFilterRole(e.target.value);
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleToggleUserStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    
    if (window.confirm(`确定要${newStatus === 'active' ? '启用' : '禁用'}该用户吗？`)) {
      try {
        await userApi.updateUserStatus(user.id, newStatus);
        
        const updatedUsers = users.map(u => {
          if (u.id === user.id) {
            return {
              ...u,
              status: newStatus
            };
          }
          return u;
        });
        
        setUsers(updatedUsers);
        alert(`用户已${newStatus === 'active' ? '启用' : '禁用'}成功！`);
      } catch (error) {
        console.error('更新用户状态失败:', error);
        alert('更新用户状态失败，请稍后重试');
      }
    }
  };
  
  const handleToggleSelectUser = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };
  
  const handleToggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };
  
  const handleBatchDelete = async () => {
    if (selectedUsers.length === 0) {
      alert('请先选择要删除的用户');
      return;
    }
    
    if (window.confirm(`确定要删除选中的${selectedUsers.length}个用户吗？此操作不可恢复。`)) {
      try {
        await userApi.batchDeleteUsers(selectedUsers);
        
        const updatedUsers = users.filter(user => !selectedUsers.includes(user.id));
        setUsers(updatedUsers);
        setSelectedUsers([]);
        alert(`成功删除${selectedUsers.length}个用户！`);
      } catch (error) {
        console.error('批量删除用户失败:', error);
        alert('批量删除用户失败，请稍后重试');
      }
    }
  };

  const strengthInfo = getPasswordStrengthInfo();

  return (
    <CMSLayout>
      <div className="users-page">
        <div className="main-header">
          <h1>用户管理</h1>
          <div className="header-search">
            <input 
              type="text" 
              placeholder="搜索用户名、邮箱或电话..." 
              value={searchQuery} 
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </div>
        
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-label">总用户数:</span>
            <span className="stat-value">{userStats.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">启用:</span>
            <span className="stat-value stat-active">{userStats.active}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">禁用:</span>
            <span className="stat-value stat-inactive">{userStats.inactive}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">锁定:</span>
            <span className="stat-value stat-locked">{userStats.locked}</span>
          </div>
        </div>
        
        <div className="action-bar">
          <button className="add-button" onClick={() => setShowAddUserModal(true)}>
            + 添加用户
          </button>
          {selectedUsers.length > 0 && (
            <button 
              className="batch-delete-button" 
              onClick={handleBatchDelete}
            >
              批量删除 ({selectedUsers.length})
            </button>
          )}
          <div className="filter-section">
            <label htmlFor="filter-role">角色筛选:</label>
            <select 
              id="filter-role" 
              value={filterRole} 
              onChange={handleFilterRoleChange}
              className="filter-select"
            >
              <option value="all">全部角色</option>
              <option value="admin">管理员</option>
              <option value="editor">编辑</option>
              <option value="writer">作者</option>
              <option value="viewer">查看者</option>
            </select>
          </div>
          <div className="filter-section">
            <label htmlFor="filter-status">状态筛选:</label>
            <select 
              id="filter-status" 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">全部状态</option>
              <option value="active">启用</option>
              <option value="inactive">禁用</option>
              <option value="locked">锁定</option>
            </select>
          </div>
        </div>
        
        <div className="content-container">
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>
                    <input 
                      type="checkbox" 
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0} 
                      onChange={handleToggleSelectAll}
                      className="select-all-checkbox"
                    />
                  </th>
                  <th>用户ID</th>
                  <th>用户名</th>
                  <th>邮箱</th>
                  <th>电话</th>
                  <th>角色</th>
                  <th>创建时间</th>
                  <th>最后登录</th>
                  <th>登录次数</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className={selectedUsers.includes(user.id) ? 'selected-row' : ''}>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={selectedUsers.includes(user.id)} 
                        onChange={() => handleToggleSelectUser(user.id)}
                        className="user-select-checkbox"
                      />
                    </td>
                    <td className="user-id">{user.id}</td>
                    <td className="user-username">
                      {user.avatar && (
                        <img 
                          src={user.avatar} 
                          alt={user.username} 
                          className="user-avatar-small"
                        />
                      )}
                      {user.username}
                    </td>
                    <td className="user-email">{user.email}</td>
                    <td className="user-phone">{user.phone || '-'}</td>
                    <td className="user-role">
                      <span className={`role-badge role-${user.role}`}>{user.role}</span>
                    </td>
                    <td className="user-created-at">{user.createdAt}</td>
                    <td className="user-last-login">{user.lastLoginTime}</td>
                    <td className="user-login-count">{user.loginCount}</td>
                    <td className="user-status">
                      {user.lockedUntil && new Date(user.lockedUntil) > new Date() ? (
                        <span className="status-badge status-locked">锁定</span>
                      ) : (
                        <button 
                          className={`status-button status-${user.status}`}
                          onClick={() => handleToggleUserStatus(user)}
                        >
                          {user.status === 'active' ? '启用' : '禁用'}
                        </button>
                      )}
                    </td>
                    <td className="actions">
                      <button className="edit-button" onClick={() => handleEditUser(user)}>编辑</button>
                      <button className="password-button" onClick={() => handleResetPassword(user)}>重置密码</button>
                      {user.lockedUntil && new Date(user.lockedUntil) > new Date() ? (
                        <button className="unlock-button" onClick={() => handleUnlockUser(user)}>解锁</button>
                      ) : (
                        <button className="lock-button" onClick={() => handleLockUser(user)}>锁定</button>
                      )}
                      <button className="delete-button" onClick={() => handleDeleteUser(user.id)}>
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showAddUserModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>添加新用户</h2>
                <button className="close-button" onClick={() => setShowAddUserModal(false)}>
                  ×
                </button>
              </div>
              <form onSubmit={handleAddUser} className="user-form">
                <div className="form-group">
                  <label htmlFor="user-username">用户名</label>
                  <input
                    type="text"
                    id="user-username"
                    name="username"
                    value={newUser.username}
                    onChange={handleUserInputChange}
                    placeholder="请输入用户名"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="user-password">密码</label>
                  <input
                    type="password"
                    id="user-password"
                    name="password"
                    value={newUser.password}
                    onChange={handleUserInputChange}
                    placeholder="请输入密码"
                    required
                  />
                  {passwordStrength && (
                    <div className="password-strength" style={{ color: strengthInfo.color }}>
                      密码强度: {strengthInfo.text}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="user-email">邮箱</label>
                  <input
                    type="email"
                    id="user-email"
                    name="email"
                    value={newUser.email}
                    onChange={handleUserInputChange}
                    placeholder="请输入邮箱"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="user-phone">电话</label>
                  <input
                    type="tel"
                    id="user-phone"
                    name="phone"
                    value={newUser.phone}
                    onChange={handleUserInputChange}
                    placeholder="请输入电话（可选）"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="user-role">角色</label>
                  <select
                    id="user-role"
                    name="role"
                    value={newUser.role}
                    onChange={handleUserInputChange}
                    required
                  >
                    <option value="user">普通用户</option>
                    <option value="editor">编辑</option>
                    <option value="writer">作者</option>
                    <option value="viewer">查看者</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="user-bio">个人简介</label>
                  <textarea
                    id="user-bio"
                    name="bio"
                    value={newUser.bio}
                    onChange={handleUserInputChange}
                    placeholder="请输入个人简介（可选）"
                    rows="3"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-button">
                    添加用户
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setShowAddUserModal(false)}
                  >
                    取消
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEditUserModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>编辑用户</h2>
                <button className="close-button" onClick={() => setShowEditUserModal(false)}>
                  ×
                </button>
              </div>
              <form onSubmit={handleUpdateUser} className="user-form">
                <div className="form-group">
                  <label htmlFor="edit-username">用户名</label>
                  <input
                    type="text"
                    id="edit-username"
                    name="username"
                    value={newUser.username}
                    onChange={handleUserInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-email">邮箱</label>
                  <input
                    type="email"
                    id="edit-email"
                    name="email"
                    value={newUser.email}
                    onChange={handleUserInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-phone">电话</label>
                  <input
                    type="tel"
                    id="edit-phone"
                    name="phone"
                    value={newUser.phone}
                    onChange={handleUserInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-role">角色</label>
                  <select
                    id="edit-role"
                    name="role"
                    value={newUser.role}
                    onChange={handleUserInputChange}
                    required
                  >
                    <option value="user">普通用户</option>
                    <option value="editor">编辑</option>
                    <option value="writer">作者</option>
                    <option value="viewer">查看者</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="edit-bio">个人简介</label>
                  <textarea
                    id="edit-bio"
                    name="bio"
                    value={newUser.bio}
                    onChange={handleUserInputChange}
                    rows="3"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-button">
                    更新用户
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setShowEditUserModal(false)}
                  >
                    取消
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showResetPasswordModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>重置密码</h2>
                <button className="close-button" onClick={() => setShowResetPasswordModal(false)}>
                  ×
                </button>
              </div>
              <form onSubmit={handleConfirmResetPassword} className="user-form">
                <div className="form-group">
                  <label>用户名</label>
                  <input
                    type="text"
                    value={currentUser?.username || ''}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="reset-password">新密码</label>
                  <input
                    type="password"
                    id="reset-password"
                    name="password"
                    value={newUser.password}
                    onChange={handleUserInputChange}
                    placeholder="请输入新密码"
                    required
                  />
                  {passwordStrength && (
                    <div className="password-strength" style={{ color: strengthInfo.color }}>
                      密码强度: {strengthInfo.text}
                    </div>
                  )}
                </div>
                <div className="form-actions">
                  <button type="submit" className="submit-button">
                    重置密码
                  </button>
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setShowResetPasswordModal(false)}
                  >
                    取消
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </CMSLayout>
  );
}

export default UsersPage;
