import React, { useState, useEffect } from 'react';
import CMSNavbar from '../components/CMSNavbar.js';
import dataManager from '../data/dataManager.js';

const CMSUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    password: '',
    role_id: '',
    phone: '',
    status: 'active'
  });

  useEffect(() => {
    const allUsers = dataManager.getAllUsers();
    const allRoles = dataManager.getAllRoles();
    setUsers(allUsers);
    setFilteredUsers(allUsers);
    setRoles(allRoles);
  }, []);

  useEffect(() => {
    let result = users;
    if (searchQuery) {
      result = result.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (roleFilter) {
      result = result.filter(user => user.role_id === roleFilter);
    }
    if (statusFilter) {
      result = result.filter(user => user.status === statusFilter);
    }
    setFilteredUsers(result);
  }, [searchQuery, roleFilter, statusFilter, users]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRoleFilter = (e) => {
    setRoleFilter(e.target.value);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleUserSelect = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(userId => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const handleBulkEnable = () => {
    selectedUsers.forEach(id => {
      dataManager.updateUser(id, { status: 'active' });
    });
    setUsers(dataManager.getAllUsers());
    setSelectedUsers([]);
  };

  const handleBulkDisable = () => {
    selectedUsers.forEach(id => {
      dataManager.updateUser(id, { status: 'inactive' });
    });
    setUsers(dataManager.getAllUsers());
    setSelectedUsers([]);
  };

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setUserForm({
        username: user.username,
        email: user.email,
        password: '',
        role_id: user.role_id,
        phone: user.phone || '',
        status: user.status
      });
    } else {
      setEditingUser(null);
      setUserForm({
        username: '',
        email: '',
        password: '',
        role_id: roles.length > 0 ? roles[0].id : '',
        phone: '',
        status: 'active'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const userData = { ...userForm };
    if (!userData.password) {
      // 如果密码为空，不更新密码
      delete userData.password;
    }
    
    if (editingUser) {
      dataManager.updateUser(editingUser.id, userData);
    } else {
      // 新用户必须设置密码
      if (!userData.password) {
        alert('新用户必须设置密码');
        return;
      }
      // 简单的密码加密模拟
      userData.password = 'encrypted_' + userData.password;
      dataManager.addUser(userData);
    }
    
    setUsers(dataManager.getAllUsers());
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('确定要删除该用户吗？')) {
      dataManager.deleteUser(id);
      setUsers(dataManager.getAllUsers());
    }
  };

  const handleResetPassword = (id) => {
    if (window.confirm('确定要重置该用户的密码吗？')) {
      // 生成随机密码
      const randomPassword = Math.random().toString(36).substring(2, 10);
      // 简单的密码加密模拟
      const encryptedPassword = 'encrypted_' + randomPassword;
      dataManager.updateUser(id, { password: encryptedPassword });
      alert(`密码已重置为：${randomPassword}`);
    }
  };

  return (
    <div className="cms-container">
      <CMSNavbar />
      <div className="cms-content">
        <div className="cms-sidebar">
          <h3>管理菜单</h3>
          <div className="cms-sidebar-nav">
            <a href="/cms/dashboard" className="cms-nav-link">仪表板</a>
            <a href="/cms/articles" className="cms-nav-link">文章管理</a>
            <a href="/cms/media" className="cms-nav-link">媒体管理</a>
            <a href="/cms/categories" className="cms-nav-link">分类管理</a>
            <a href="/cms/tags" className="cms-nav-link">标签管理</a>
            <a href="/cms/locations" className="cms-nav-link">位置管理</a>
            <a href="/cms/users" className="cms-nav-link active">用户管理</a>
            <a href="/cms/roles" className="cms-nav-link">角色管理</a>
            <a href="/cms/settings" className="cms-nav-link">系统设置</a>
            <a href="/" className="cms-nav-link">退出登录</a>
          </div>
        </div>
        <div className="cms-main-content">
          <div className="cms-card">
            <div className="card-header">
              <h2>用户管理</h2>
              <button className="btn btn-primary" onClick={() => handleOpenModal()}>添加用户</button>
            </div>
            <div className="card-body">
              <div className="users-filters">
                <div className="filter-group">
                  <input 
                    type="text" 
                    placeholder="搜索用户名或邮箱..." 
                    value={searchQuery}
                    onChange={handleSearch}
                    className="search-input"
                  />
                </div>
                <div className="filter-group">
                  <select 
                    value={roleFilter} 
                    onChange={handleRoleFilter}
                    className="role-filter"
                  >
                    <option value="">所有角色</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
                <div className="filter-group">
                  <select 
                    value={statusFilter} 
                    onChange={handleStatusFilter}
                    className="status-filter"
                  >
                    <option value="">所有状态</option>
                    <option value="active">活跃</option>
                    <option value="inactive">禁用</option>
                  </select>
                </div>
              </div>
              
              <div className="bulk-actions">
                <button 
                  className="btn btn-success" 
                  onClick={handleBulkEnable}
                  disabled={selectedUsers.length === 0}
                >
                  批量启用
                </button>
                <button 
                  className="btn btn-warning" 
                  onClick={handleBulkDisable}
                  disabled={selectedUsers.length === 0}
                >
                  批量禁用
                </button>
              </div>
              
              <table className="users-table">
                <thead>
                  <tr>
                    <th><input 
                      type="checkbox" 
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(filteredUsers.map(user => user.id));
                        } else {
                          setSelectedUsers([]);
                        }
                      }}
                    /></th>
                    <th>用户名</th>
                    <th>邮箱</th>
                    <th>角色</th>
                    <th>手机</th>
                    <th>状态</th>
                    <th>注册时间</th>
                    <th>最后登录</th>
                    <th>登录IP</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => {
                    const userRole = roles.find(role => role.id === user.role_id);
                    return (
                      <tr key={user.id}>
                        <td>
                          <input 
                            type="checkbox" 
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleUserSelect(user.id)}
                          />
                        </td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{userRole ? userRole.name : '未知'}</td>
                        <td>{user.phone || '-'}</td>
                        <td>
                          <span className={`status-badge status-${user.status}`}>
                            {user.status === 'active' && '活跃'}
                            {user.status === 'inactive' && '禁用'}
                          </span>
                        </td>
                        <td>{new Date(user.created_at).toLocaleString()}</td>
                        <td>{user.last_login_time ? new Date(user.last_login_time).toLocaleString() : '-'}</td>
                        <td>{user.last_login_ip || '-'}</td>
                        <td className="user-actions">
                          <button className="action-btn edit-btn" onClick={() => handleOpenModal(user)}>编辑</button>
                          <button className="action-btn reset-btn" onClick={() => handleResetPassword(user.id)}>重置密码</button>
                          {user.status === 'active' && (
                            <button className="action-btn disable-btn" onClick={() => dataManager.updateUser(user.id, { status: 'inactive' })}>禁用</button>
                          )}
                          {user.status === 'inactive' && (
                            <button className="action-btn enable-btn" onClick={() => dataManager.updateUser(user.id, { status: 'active' })}>启用</button>
                          )}
                          <button className="action-btn delete-btn" onClick={() => handleDelete(user.id)}>删除</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingUser ? '编辑用户' : '添加用户'}</h3>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label htmlFor="username">用户名</label>
                <input 
                  type="text" 
                  id="username" 
                  name="username" 
                  value={userForm.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">邮箱</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={userForm.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">密码{editingUser ? '（不填则保持不变）' : ''}</label>
                <input 
                  type="password" 
                  id="password" 
                  name="password" 
                  value={userForm.password}
                  onChange={handleInputChange}
                  required={!editingUser}
                />
              </div>
              <div className="form-group">
                <label htmlFor="role_id">角色</label>
                <select 
                  id="role_id" 
                  name="role_id" 
                  value={userForm.role_id}
                  onChange={handleInputChange}
                  required
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="phone">手机号</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  value={userForm.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="status">状态</label>
                <select 
                  id="status" 
                  name="status" 
                  value={userForm.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="active">活跃</option>
                  <option value="inactive">禁用</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>取消</button>
                <button type="submit" className="btn btn-primary">保存</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CMSUserManagement;
