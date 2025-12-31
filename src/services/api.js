// API服务文件

// API基础URL
// 使用环境变量或默认值（与后端配置保持一致）
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// 通用请求函数
async function request(url, options = {}) {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// 用户管理API
export const userApi = {
  // 获取所有用户
  getAllUsers: async () => {
    return await request('/users');
  },

  // 获取用户列表（支持分页、筛选、排序）
  getUsers: async (options = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });
    return await request(`/users?${queryParams.toString()}`);
  },

  // 获取单个用户
  getUserById: async (id) => {
    return await request(`/users/${id}`);
  },

  // 创建用户
  createUser: async (userData) => {
    return await request('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // 更新用户
  updateUser: async (id, userData) => {
    return await request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  },

  // 删除用户
  deleteUser: async (id) => {
    return await request(`/users/${id}`, {
      method: 'DELETE'
    });
  },

  // 批量删除用户
  batchDeleteUsers: async (ids) => {
    return await request('/users/batch-delete', {
      method: 'DELETE',
      body: JSON.stringify({ ids })
    });
  },

  // 更新用户状态
  updateUserStatus: async (id, status) => {
    return await request(`/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  // 批量更新用户状态
  batchUpdateUserStatus: async (ids, status) => {
    return await request('/users/batch-status', {
      method: 'PUT',
      body: JSON.stringify({ ids, status })
    });
  },

  // 重置用户密码
  resetPassword: async (id, newPassword) => {
    return await request(`/users/${id}/reset-password`, {
      method: 'PUT',
      body: JSON.stringify({ newPassword })
    });
  },

  // 锁定用户
  lockUser: async (id) => {
    return await request(`/users/${id}/lock`, {
      method: 'PUT'
    });
  },

  // 解锁用户
  unlockUser: async (id) => {
    return await request(`/users/${id}/unlock`, {
      method: 'PUT'
    });
  },

  // 获取用户统计信息
  getUserStats: async () => {
    return await request('/users/stats');
  },

  // 用户登录
  login: async (credentials) => {
    return await request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  // 用户登出
  logout: async () => {
    return await request('/users/logout', {
      method: 'POST'
    });
  },

  // 修改密码
  changePassword: async (oldPassword, newPassword) => {
    return await request('/users/change-password', {
      method: 'PUT',
      body: JSON.stringify({ oldPassword, newPassword })
    });
  }
};

// 角色管理API
export const roleApi = {
  // 获取所有角色
  getAllRoles: async () => {
    return await request('/roles');
  },

  // 获取角色列表（支持分页、筛选）
  getRoles: async (options = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });
    return await request(`/roles?${queryParams.toString()}`);
  },

  // 获取单个角色
  getRoleById: async (id) => {
    return await request(`/roles/${id}`);
  },

  // 创建角色
  createRole: async (roleData) => {
    return await request('/roles', {
      method: 'POST',
      body: JSON.stringify(roleData)
    });
  },

  // 更新角色
  updateRole: async (id, roleData) => {
    return await request(`/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roleData)
    });
  },

  // 删除角色
  deleteRole: async (id) => {
    return await request(`/roles/${id}`, {
      method: 'DELETE'
    });
  },

  // 分配权限给角色
  assignPermissions: async (roleId, permissionIds) => {
    return await request(`/roles/${roleId}/permissions`, {
      method: 'POST',
      body: JSON.stringify({ permissionIds })
    });
  },

  // 获取角色的所有权限
  getRolePermissions: async (roleId) => {
    return await request(`/roles/${roleId}/permissions`);
  },

  // 获取所有权限
  getAllPermissions: async () => {
    return await request('/permissions');
  }
};

// 文章管理API
export const articleApi = {
  // 获取所有文章（兼容旧接口）
  getAllArticles: async () => {
    return await request('/articles/all');
  },

  // 获取文章列表（支持分页、筛选、排序）
  getArticles: async (options = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });
    return await request(`/articles?${queryParams.toString()}`);
  },

  // 获取单个文章
  getArticleById: async (id) => {
    return await request(`/articles/${id}`);
  },

  // 创建文章
  createArticle: async (articleData) => {
    return await request('/articles', {
      method: 'POST',
      body: JSON.stringify(articleData)
    });
  },

  // 更新文章
  updateArticle: async (id, articleData) => {
    return await request(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(articleData)
    });
  },

  // 删除文章
  deleteArticle: async (id) => {
    return await request(`/articles/${id}`, {
      method: 'DELETE'
    });
  },

  // 变更文章状态
  changeArticleStatus: async (id, newStatus, authorId) => {
    return await request(`/articles/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ newStatus, authorId })
    });
  },

  // 获取文章版本历史
  getArticleVersions: async (id) => {
    return await request(`/articles/${id}/versions`);
  },

  // 获取作者文章统计
  getAuthorArticleStats: async (authorId) => {
    return await request(`/articles/author/${authorId}/stats`);
  },

  // 根据作者ID获取文章
  getArticlesByAuthor: async (authorId) => {
    return await request(`/articles/author/${authorId}`);
  },

  // 根据地域ID获取文章
  getArticlesByRegion: async (regionId) => {
    return await request(`/articles/region/${regionId}`);
  },

  // 搜索文章
  searchArticles: async (keyword) => {
    return await request(`/articles/search/${keyword}`);
  }
};

// 其他API模块可以在这里添加
export default {
  userApi,
  articleApi,
  roleApi
};
