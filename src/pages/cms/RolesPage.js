import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CMSLayout from '../../components/cms/CMSLayout.js';
import { isAdmin } from '../../services/permission.js';
import { roleApi } from '../../services/api.js';
import './RolesPage.css';

function RolesPage() {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  useEffect(() => {
    if (!loggedInUser) {
      navigate('/cms/login');
    } else if (!isAdmin(loggedInUser)) {
      navigate('/cms/dashboard');
    }
  }, [loggedInUser, navigate]);

  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: []
  });

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await roleApi.getAllRoles();
        const formattedRoles = rolesData.map(role => ({
          id: role.role_id,
          name: role.role_name,
          description: role.role_description || '',
          createdAt: role.create_time ? new Date(role.create_time).toISOString().split('T')[0] : '',
          userCount: role.user_count || 0
        }));
        setRoles(formattedRoles);
        setFilteredRoles(formattedRoles);
      } catch (error) {
        console.error('获取角色列表失败:', error);
        setRoles([]);
        setFilteredRoles([]);
      }
    };

    const fetchPermissions = async () => {
      try {
        const permissionsData = await roleApi.getAllPermissions();
        setPermissions(permissionsData);
      } catch (error) {
        console.error('获取权限列表失败:', error);
        setPermissions([]);
      }
    };

    fetchRoles();
    fetchPermissions();
  }, []);

  useEffect(() => {
    let result = [...roles];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(role => 
        role.name.toLowerCase().includes(query) || 
        role.description.toLowerCase().includes(query)
      );
    }

    setFilteredRoles(result);
  }, [searchQuery, roles]);

  const handleAddRole = async (e) => {
    e.preventDefault();

    if (window.confirm('确定要添加此角色吗？')) {
      try {
        const roleData = {
          role_name: newRole.name,
          description: newRole.description
        };

        const addedRole = await roleApi.createRole(roleData);

        const formattedRole = {
          id: addedRole.role_id,
          name: addedRole.role_name,
          description: addedRole.role_description || '',
          createdAt: addedRole.create_time ? new Date(addedRole.create_time).toISOString().split('T')[0] : '',
          userCount: 0
        };

        setRoles([...roles, formattedRole]);
        setNewRole({ name: '', description: '', permissions: [] });
        setShowAddRoleModal(false);
        alert('角色添加成功！');
      } catch (error) {
        console.error('添加角色失败:', error);
        alert('添加角色失败，请稍后重试');
      }
    }
  };

  const handleDeleteRole = async (id) => {
    if (window.confirm('确定要删除此角色吗？此操作不可恢复。')) {
      try {
        await roleApi.deleteRole(id);
        setRoles(roles.filter(role => role.id !== id));
        alert('角色删除成功！');
      } catch (error) {
        console.error('删除角色失败:', error);
        alert('删除角色失败，请稍后重试');
      }
    }
  };

  const handleEditRole = (role) => {
    setCurrentRole(role);
    setNewRole({
      name: role.name,
      description: role.description,
      permissions: []
    });
    setShowEditRoleModal(true);
  };

  const handleUpdateRole = async (e) => {
    e.preventDefault();

    if (window.confirm('确定要更新此角色信息吗？')) {
      try {
        const roleData = {
          role_name: newRole.name,
          description: newRole.description
        };

        const updatedRole = await roleApi.updateRole(currentRole.id, roleData);

        const updatedRoles = roles.map(role => {
          if (role.id === currentRole.id) {
            return {
              ...role,
              name: updatedRole.role_name,
              description: updatedRole.role_description
            };
          }
          return role;
        });

        setRoles(updatedRoles);
        setShowEditRoleModal(false);
        setCurrentRole(null);
        setNewRole({ name: '', description: '', permissions: [] });
        alert('角色信息更新成功！');
      } catch (error) {
        console.error('更新角色失败:', error);
        alert('更新角色失败，请稍后重试');
      }
    }
  };

  const handleManagePermissions = async (role) => {
    try {
      const rolePermissions = await roleApi.getRolePermissions(role.id);
      setCurrentRole(role);
      setNewRole({
        name: role.name,
        description: role.description,
        permissions: rolePermissions.map(p => p.permission_id)
      });
      setShowPermissionModal(true);
    } catch (error) {
      console.error('获取角色权限失败:', error);
      alert('获取角色权限失败，请稍后重试');
    }
  };

  const handleSavePermissions = async () => {
    try {
      await roleApi.assignPermissions(currentRole.id, newRole.permissions);
      setShowPermissionModal(false);
      setCurrentRole(null);
      alert('权限分配成功！');
    } catch (error) {
      console.error('分配权限失败:', error);
      alert('分配权限失败，请稍后重试');
    }
  };

  const handlePermissionToggle = (permissionId) => {
    setNewRole(prev => {
      const newPermissions = prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId];
      return { ...prev, permissions: newPermissions };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRole(prev => ({ ...prev, [name]: value }));
  };

  return (
    <CMSLayout>
      <div className="roles-page">
        <div className="main-header">
          <h1>角色管理</h1>
          <div className="header-search">
            <input 
              type="text" 
              placeholder="搜索角色名称或描述..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="action-bar">
          <button className="add-button" onClick={() => setShowAddRoleModal(true)}>
            + 添加角色
          </button>
        </div>

        <div className="content-container">
          <div className="roles-table-container">
            <table className="roles-table">
              <thead>
                <tr>
                  <th>角色ID</th>
                  <th>角色名称</th>
                  <th>描述</th>
                  <th>用户数量</th>
                  <th>创建时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoles.map(role => (
                  <tr key={role.id}>
                    <td className="role-id">{role.id}</td>
                    <td className="role-name">{role.name}</td>
                    <td className="role-description">{role.description || '-'}</td>
                    <td className="role-user-count">{role.userCount}</td>
                    <td className="role-created-at">{role.createdAt}</td>
                    <td className="actions">
                      <button className="edit-button" onClick={() => handleEditRole(role)}>编辑</button>
                      <button className="permission-button" onClick={() => handleManagePermissions(role)}>权限</button>
                      <button className="delete-button" onClick={() => handleDeleteRole(role.id)}>
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 添加角色模态框 */}
        {showAddRoleModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>添加新角色</h2>
                <button className="close-button" onClick={() => setShowAddRoleModal(false)}>
                  ×
                </button>
              </div>
              <form onSubmit={handleAddRole} className="role-form">
                <div className="form-group">
                  <label htmlFor="role-name">角色名称</label>
                  <input
                    type="text"
                    id="role-name"
                    name="name"
                    value={newRole.name}
                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                    placeholder="请输入角色名称"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="role-description">描述</label>
                  <textarea
                    id="role-description"
                    name="description"
                    value={newRole.description}
                    onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                    placeholder="请输入角色描述（可选）"
                    rows="3"
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="cancel-button" onClick={() => setShowAddRoleModal(false)}>
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

        {/* 编辑角色模态框 */}
        {showEditRoleModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>编辑角色</h2>
                <button className="close-button" onClick={() => setShowEditRoleModal(false)}>
                  ×
                </button>
              </div>
              <form onSubmit={handleUpdateRole} className="role-form">
                <div className="form-group">
                  <label htmlFor="edit-role-name">角色名称</label>
                  <input
                    type="text"
                    id="edit-role-name"
                    name="name"
                    value={newRole.name}
                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                    placeholder="请输入角色名称"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="edit-role-description">描述</label>
                  <textarea
                    id="edit-role-description"
                    name="description"
                    value={newRole.description}
                    onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                    placeholder="请输入角色描述（可选）"
                    rows="3"
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="cancel-button" onClick={() => setShowEditRoleModal(false)}>
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

        {/* 权限管理模态框 */}
        {showPermissionModal && (
          <div className="modal-overlay">
            <div className="modal modal-large">
              <div className="modal-header">
                <h2>管理权限 - {currentRole?.name}</h2>
                <button className="close-button" onClick={() => setShowPermissionModal(false)}>
                  ×
                </button>
              </div>
              <div className="permission-form">
                <div className="permissions-list">
                  {permissions.length > 0 ? (
                    permissions.map(permission => (
                      <div key={permission.permission_id} className="permission-item">
                        <label className="permission-label">
                          <input
                            type="checkbox"
                            checked={newRole.permissions.includes(permission.permission_id)}
                            onChange={() => handlePermissionToggle(permission.permission_id)}
                            className="permission-checkbox"
                          />
                          <span className="permission-name">{permission.permission_name}</span>
                          <span className="permission-description">{permission.description || ''}</span>
                        </label>
                      </div>
                    ))
                  ) : (
                    <div className="no-permissions">暂无权限数据</div>
                  )}
                </div>

                <div className="form-actions">
                  <button type="button" className="cancel-button" onClick={() => setShowPermissionModal(false)}>
                    取消
                  </button>
                  <button type="button" className="save-button" onClick={handleSavePermissions}>
                    保存权限
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CMSLayout>
  );
}

export default RolesPage;
