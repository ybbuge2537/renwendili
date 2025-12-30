import React, { useState, useEffect } from 'react';
import CMSNavbar from '../components/CMSNavbar.js';
import dataManager from '../data/dataManager.js';

const CMSRoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [rolePermissions, setRolePermissions] = useState({});
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [isCopying, setIsCopying] = useState(false);
  const [roleForm, setRoleForm] = useState({
    name: '',
    slug: '',
    description: '',
    is_system: false
  });
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    const allRoles = dataManager.getAllRoles();
    const allPermissions = dataManager.getAllPermissions();
    const allRolePermissions = dataManager.getAllRolePermissions();
    
    setRoles(allRoles);
    setFilteredRoles(allRoles);
    setPermissions(allPermissions);
    
    // 将角色权限转换为map结构便于查找
    const rolePermMap = {};
    allRolePermissions.forEach(rolePerm => {
      rolePermMap[rolePerm.role_id] = rolePerm.permission_ids;
    });
    setRolePermissions(rolePermMap);
  }, []);

  useEffect(() => {
    let result = roles;
    if (searchQuery) {
      result = result.filter(role => 
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredRoles(result);
  }, [searchQuery, roles]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleOpenModal = (role = null, copy = false) => {
    if (role) {
      setEditingRole(role);
      if (copy) {
        setIsCopying(true);
        setRoleForm({
          name: `${role.name} (副本)`,
          slug: `${role.slug}_copy`,
          description: `${role.description} (副本)`,
          is_system: false
        });
      } else {
        setIsCopying(false);
        setRoleForm({
          name: role.name,
          slug: role.slug,
          description: role.description,
          is_system: role.is_system
        });
      }
    } else {
      setEditingRole(null);
      setIsCopying(false);
      setRoleForm({
        name: '',
        slug: '',
        description: '',
        is_system: false
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
    setIsCopying(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoleForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const roleData = { ...roleForm };
    
    if (editingRole && !isCopying) {
      // 系统角色不能修改为非系统角色
      if (editingRole.is_system && !roleData.is_system) {
        alert('系统角色不能修改为非系统角色');
        return;
      }
      dataManager.updateRole(editingRole.id, roleData);
    } else {
      // 新角色或复制角色，系统角色默认为false
      roleData.is_system = false;
      dataManager.addRole(roleData);
    }
    
    setRoles(dataManager.getAllRoles());
    handleCloseModal();
  };

  const handleDelete = (id) => {
    const role = roles.find(r => r.id === id);
    if (role.is_system) {
      alert('系统角色不能删除');
      return;
    }
    
    // 检查是否有用户使用该角色
    const users = dataManager.getAllUsers();
    const usersWithRole = users.filter(user => user.role_id === id);
    if (usersWithRole.length > 0) {
      alert(`该角色下有 ${usersWithRole.length} 个用户，删除前请先迁移这些用户的角色`);
      return;
    }
    
    if (window.confirm('确定要删除该角色吗？')) {
      dataManager.deleteRole(id);
      setRoles(dataManager.getAllRoles());
    }
  };

  const handleOpenPermissionModal = (role) => {
    setSelectedRole(role);
    // 获取该角色已有的权限
    const currentPermissions = rolePermissions[role.id] || [];
    setSelectedPermissions(currentPermissions);
    setIsPermissionModalOpen(true);
  };

  const handleClosePermissionModal = () => {
    setIsPermissionModalOpen(false);
    setSelectedRole(null);
    setSelectedPermissions([]);
  };

  const handlePermissionChange = (permissionId) => {
    if (selectedPermissions.includes(permissionId)) {
      setSelectedPermissions(selectedPermissions.filter(id => id !== permissionId));
    } else {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    }
  };

  const handlePermissionSubmit = () => {
    if (selectedRole) {
      dataManager.updateRolePermissions(selectedRole.id, selectedPermissions);
      // 更新本地状态
      const updatedRolePermissions = { ...rolePermissions };
      updatedRolePermissions[selectedRole.id] = selectedPermissions;
      setRolePermissions(updatedRolePermissions);
      handleClosePermissionModal();
    }
  };

  // 按模块对权限进行分组
  const permissionsByModule = permissions.reduce((acc, perm) => {
    if (!acc[perm.module]) {
      acc[perm.module] = [];
    }
    acc[perm.module].push(perm);
    return acc;
  }, {});

  const moduleNames = {
    'content': '内容管理',
    'user': '用户管理',
    'permission': '权限控制',
    'system': '系统设置'
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
            <a href="/cms/users" className="cms-nav-link">用户管理</a>
            <a href="/cms/roles" className="cms-nav-link active">角色管理</a>
            <a href="/cms/settings" className="cms-nav-link">系统设置</a>
            <a href="/" className="cms-nav-link">退出登录</a>
          </div>
        </div>
        <div className="cms-main-content">
          <div className="cms-card">
            <div className="card-header">
              <h2>角色管理</h2>
              <button className="btn btn-primary" onClick={() => handleOpenModal()}>添加角色</button>
            </div>
            <div className="card-body">
              <div className="roles-filters">
                <div className="filter-group">
                  <input 
                    type="text" 
                    placeholder="搜索角色名称或描述..." 
                    value={searchQuery}
                    onChange={handleSearch}
                    className="search-input"
                  />
                </div>
              </div>
              
              <table className="roles-table">
                <thead>
                  <tr>
                    <th>角色名称</th>
                    <th>标识</th>
                    <th>描述</th>
                    <th>类型</th>
                    <th>用户数量</th>
                    <th>创建时间</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoles.map(role => (
                    <tr key={role.id}>
                      <td>{role.name}</td>
                      <td>{role.slug}</td>
                      <td>{role.description}</td>
                      <td>
                        <span className={`role-type-badge ${role.is_system ? 'system-role' : 'custom-role'}`}>
                          {role.is_system ? '系统角色' : '自定义角色'}
                        </span>
                      </td>
                      <td>{role.user_count || 0}</td>
                      <td>{new Date(role.created_at).toLocaleString()}</td>
                      <td className="role-actions">
                        <button className="action-btn edit-btn" onClick={() => handleOpenModal(role)}>编辑</button>
                        <button className="action-btn copy-btn" onClick={() => handleOpenModal(role, true)}>复制</button>
                        <button className="action-btn permission-btn" onClick={() => handleOpenPermissionModal(role)}>权限</button>
                        {!role.is_system && (
                          <button className="action-btn delete-btn" onClick={() => handleDelete(role.id)}>删除</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* 角色编辑/添加模态框 */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{isCopying ? '复制角色' : (editingRole ? '编辑角色' : '添加角色')}</h3>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label htmlFor="name">角色名称</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={roleForm.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="slug">角色标识（英文）</label>
                <input 
                  type="text" 
                  id="slug" 
                  name="slug" 
                  value={roleForm.slug}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">角色描述</label>
                <textarea 
                  id="description" 
                  name="description" 
                  value={roleForm.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    name="is_system" 
                    checked={roleForm.is_system}
                    onChange={(e) => setRoleForm(prev => ({ ...prev, is_system: e.target.checked }))}
                    disabled={editingRole && editingRole.is_system}
                  />
                  系统角色
                </label>
                {editingRole && editingRole.is_system && <span className="system-role-hint">（系统角色不可修改）</span>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>取消</button>
                <button type="submit" className="btn btn-primary">保存</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* 权限分配模态框 */}
      {isPermissionModalOpen && selectedRole && (
        <div className="modal-overlay">
          <div className="modal permission-modal">
            <div className="modal-header">
              <h3>分配权限 - {selectedRole.name}</h3>
              <button className="modal-close" onClick={handleClosePermissionModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="permission-groups">
                {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
                  <div key={module} className="permission-module">
                    <h4 className="module-title">{moduleNames[module] || module}</h4>
                    <div className="permission-list">
                      {modulePermissions.map(permission => (
                        <div key={permission.id} className="permission-item">
                          <label>
                            <input 
                              type="checkbox" 
                              checked={selectedPermissions.includes(permission.id)}
                              onChange={() => handlePermissionChange(permission.id)}
                            />
                            {permission.name}
                          </label>
                          <span className="permission-description">{permission.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleClosePermissionModal}>取消</button>
                <button type="button" className="btn btn-primary" onClick={handlePermissionSubmit}>保存权限</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CMSRoleManagement;
