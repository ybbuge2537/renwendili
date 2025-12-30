import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CMSLayout from '../../components/cms/CMSLayout.js';
import { isAdmin } from '../../services/permission.js';
import { userApi } from '../../services/api.js';
import './UsersPage.css';

function UsersPage() {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  // 检查用户是否有权限访问用户管理页面
  useEffect(() => {
    if (!loggedInUser) {
      navigate('/cms/login');
    } else if (!isAdmin(loggedInUser)) {
      navigate('/cms/dashboard');
    }
  }, [loggedInUser, navigate]);

  // 用户管理
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });
  
  // 筛选和搜索状态
  const [filterRole, setFilterRole] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // 批量删除状态
  const [selectedUsers, setSelectedUsers] = useState([]);
  
  // 密码强度状态
  const [passwordStrength, setPasswordStrength] = useState('');

  // 从API获取用户数据
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await userApi.getAllUsers();
        // 转换API返回的数据结构以匹配前端需求
        const formattedUsers = usersData.map(user => ({
          id: user.user_id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          role: user.role,
          createdAt: user.create_time ? new Date(user.create_time).toISOString().split('T')[0] : '',
          // 默认所有用户都是启用状态
          status: user.status || 'active'
        }));
        setUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
      } catch (error) {
        console.error('获取用户列表失败:', error);
        // 失败时显示空列表
        setUsers([]);
        setFilteredUsers([]);
      }
    };

    fetchUsers();
  }, []);

  // 用户管理功能
  const handleAddUser = async (e) => {
    e.preventDefault();
    
    // 弹出确认与取消窗口
    if (window.confirm('确定要添加此用户吗？其他详细信息可由用户登录后自行补全。')) {
      try {
        // 调用API添加用户
        const userData = {
          username: newUser.username,
          password: newUser.password, // 密码将在后端进行加密处理
          email: newUser.email,
          phone: '', // 暂时留空，由用户自己补全
          role: newUser.role,
          status: 'active' // 新用户默认启用
        };
        
        const addedUser = await userApi.createUser(userData);
        
        // 更新成功后更新用户列表
        const formattedUser = {
          id: addedUser.user_id,
          username: addedUser.username,
          email: addedUser.email,
          phone: addedUser.phone,
          role: addedUser.role,
          createdAt: addedUser.create_time ? new Date(addedUser.create_time).toISOString().split('T')[0] : '',
          status: addedUser.status || 'active'
        };
        
        setUsers([...users, formattedUser]);
        setNewUser({ username: '', email: '', password: '', role: 'user' });
        setShowAddUserModal(false);
        alert('用户添加成功！');
      } catch (error) {
        console.error('添加用户失败:', error);
        alert('添加用户失败，请稍后重试');
      }
    }
  };

  const handleDeleteUser = async (id) => {
    // 弹出确认与取消窗口
    if (window.confirm('确定要删除此用户吗？此操作不可恢复。')) {
      try {
        // 调用API删除用户
        await userApi.deleteUser(id);
        // 删除成功后更新用户列表
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
      role: user.role
    });
    setShowEditUserModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    // 弹出确认与取消窗口
    if (window.confirm('确定要更新此用户信息吗？')) {
      try {
        // 调用API更新用户
        const updatedUser = await userApi.updateUser(currentUser.id, newUser);
        
        // 更新成功后更新用户列表
        const updatedUsers = users.map(user => {
          if (user.id === currentUser.id) {
            return {
              id: updatedUser.user_id,
              username: updatedUser.username,
              email: updatedUser.email,
              phone: updatedUser.phone,
              role: updatedUser.role,
              createdAt: updatedUser.create_time ? new Date(updatedUser.create_time).toISOString().split('T')[0] : ''
            };
          }
          return user;
        })
        setUsers(updatedUsers);
        setShowEditUserModal(false);
        setCurrentUser(null);
        setNewUser({ username: '', email: '', role: 'user' });
        alert('用户信息更新成功！');
      } catch (error) {
        console.error('更新用户失败:', error);
        alert('更新用户失败，请稍后重试');
      }
    }
  };
  
  // 处理用户输入变化
  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
    
    // 密码强度校验
    if (name === 'password') {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
    }
  };
  
  // 密码强度检查函数
  const checkPasswordStrength = (password) => {
    if (password.length === 0) return '';
    if (password.length < 6) return 'weak';
    if (password.length < 8) return 'medium';
    if (/[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password)) {
      return password.length > 10 ? 'strong' : 'medium';
    }
    return 'medium';
  };
  
  // 获取密码强度文本和样式
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
  
  // 筛选和搜索逻辑
  useEffect(() => {
    let result = [...users];
    
    // 角色筛选
    if (filterRole !== 'all') {
      result = result.filter(user => user.role === filterRole);
    }
    
    // 搜索查询
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user => 
        user.username.toLowerCase().includes(query) || 
        user.email.toLowerCase().includes(query)
      );
    }
    
    setFilteredUsers(result);
  }, [filterRole, searchQuery, users]);
  
  // 处理角色筛选变化
  const handleFilterRoleChange = (e) => {
    setFilterRole(e.target.value);
  };
  
  // 处理搜索查询变化
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // 处理用户状态切换
  const handleToggleUserStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    
    // 弹出确认窗口
    if (window.confirm(`确定要${newStatus === 'active' ? '启用' : '禁用'}该用户吗？`)) {
      try {
        // 调用API更新用户状态
        await userApi.updateUser(user.id, { status: newStatus });
        
        // 更新成功后更新用户列表
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
  
  // 批量删除功能
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
    
    // 弹出确认窗口
    if (window.confirm(`确定要删除选中的${selectedUsers.length}个用户吗？此操作不可恢复。`)) {
      try {
        // 批量删除用户，逐个调用API
        for (const userId of selectedUsers) {
          await userApi.deleteUser(userId);
        }
        
        // 更新用户列表
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

  return (
    <CMSLayout>
      <div className="users-page">
        <div className="main-header">
          <h1>用户管理</h1>
          {/* 搜索功能 */}
          <div className="header-search">
            <input 
              type="text" 
              placeholder="搜索用户名或邮箱..." 
              value={searchQuery} 
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </div>
        {/* 操作栏：添加用户、批量删除、角色筛选 */}
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
                    <td className="user-username">{user.username}</td>
                    <td className="user-email">{user.email}</td>
                    <td className="user-phone">{user.phone || '-'}</td>
                    <td className="user-role">
                      <span className={`role-badge role-${user.role}`}>{user.role}</span>
                    </td>
                    <td className="user-created-at">{user.createdAt}</td>
                    <td className="user-status">
                      <button 
                        className={`status-button status-${user.status}`}
                        onClick={() => handleToggleUserStatus(user)}
                      >
                        {user.status === 'active' ? '启用' : '禁用'}
                      </button>
                    </td>
                    <td className="actions">
                      <button className="edit-button" onClick={() => handleEditUser(user)}>编辑</button>
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

        {/* 添加用户模态框 */}
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
                  <label htmlFor="user-password">初始密码</label>
                  <input
                    type="password"
                    id="user-password"
                    name="password"
                    value={newUser.password}
                    onChange={handleUserInputChange}
                    placeholder="请输入初始密码"
                    required
                  />
                  {newUser.password.length > 0 && (
                    <div className="password-strength" style={{ marginTop: '4px' }}>
                      <span style={{ color: getPasswordStrengthInfo().color }}>
                        密码强度: {getPasswordStrengthInfo().text}
                      </span>
                    </div>
                  )}
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
                    <option value="admin">管理员</option>
                    <option value="editor">编辑</option>
                    <option value="writer">作者</option>
                    <option value="viewer">查看者</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button type="button" className="cancel-button" onClick={() => setShowAddUserModal(false)}>
                    取消
                  </button>
                  <button type="submit" className="save-button">
                    保存
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 编辑用户模态框 */}
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
                  <label htmlFor="edit-user-username">用户名</label>
                  <input
                    type="text"
                    id="edit-user-username"
                    name="username"
                    value={newUser.username}
                    onChange={handleUserInputChange}
                    placeholder="请输入用户名"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-user-email">邮箱</label>
                  <input
                    type="email"
                    id="edit-user-email"
                    name="email"
                    value={newUser.email}
                    onChange={handleUserInputChange}
                    placeholder="请输入邮箱"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-user-role">角色</label>
                  <select
                    id="edit-user-role"
                    name="role"
                    value={newUser.role}
                    onChange={handleUserInputChange}
                    required
                  >
                    <option value="admin">管理员</option>
                    <option value="editor">编辑</option>
                    <option value="writer">作者</option>
                    <option value="viewer">查看者</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button type="button" className="cancel-button" onClick={() => setShowEditUserModal(false)}>
                    取消
                  </button>
                  <button type="submit" className="save-button">
                    更新
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