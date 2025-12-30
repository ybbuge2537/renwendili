// API服务层，模拟与MySQL数据库的通信

// 模拟异步请求延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 用户管理API
const userAPI = {
  // 获取所有用户
  getAllUsers: async () => {
    await delay(100);
    // 模拟从数据库获取用户数据
    return fetch('/api/users')
      .then(response => response.json())
      .catch(async () => {
        // 如果API调用失败，返回模拟数据
        return (await import('../data/users.json')).default.users;
      });
  },

  // 根据ID获取用户
  getUserById: async (id) => {
    await delay(100);
    return fetch(`/api/users/${id}`)
      .then(response => response.json())
      .catch(async () => {
        const users = (await import('../data/users.json')).default.users;
        return users.find(user => user.id === id);
      });
  },

  // 根据用户名获取用户
  getUserByUsername: async (username) => {
    await delay(100);
    return fetch(`/api/users?username=${username}`)
      .then(response => response.json())
      .then(users => users[0])
      .catch(async () => {
        const users = (await import('../data/users.json')).default.users;
        return users.find(user => user.username === username);
      });
  },

  // 创建用户
  createUser: async (userData) => {
    await delay(200);
    return fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .catch(async () => {
      // 模拟创建用户
      const users = (await import('../data/users.json')).default.users;
      const newUser = {
        ...userData,
        id: `user_${(users.length + 1).toString().padStart(3, '0')}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'active'
      };
      return newUser;
    });
  },

  // 更新用户
  updateUser: async (id, userData) => {
    await delay(200);
    return fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .catch(async () => {
      // 模拟更新用户
      const users = (await import('../data/users.json')).default.users;
      const user = users.find(u => u.id === id);
      if (user) {
        return {
          ...user,
          ...userData,
          updated_at: new Date().toISOString()
        };
      }
      return null;
    });
  },

  // 删除用户
  deleteUser: async (id) => {
    await delay(200);
    return fetch(`/api/users/${id}`, { method: 'DELETE' })
      .then(response => response.status === 204)
      .catch(async () => {
        // 模拟删除用户
        const users = (await import('../data/users.json')).default.users;
        const index = users.findIndex(user => user.id === id);
        return index !== -1;
      });
  }
};

// 地域管理API
const regionAPI = {
  // 获取所有地域
  getAllRegions: async () => {
    await delay(100);
    return fetch('/api/regions')
      .then(response => response.json())
      .catch(async () => {
        // 模拟从数据库获取地域数据
        const locations = await import('../data/locations.json').then(mod => mod.default.locations);
        // 转换为数据库设计的地域格式
        return locations.map(location => ({
          region_id: location.id,
          region_name: location.name.zh,
          parent_id: null, // 简化处理，实际应根据数据结构设置
          location: `POINT(${location.coordinates.lng} ${location.coordinates.lat})`,
          population: location.population || null,
          language: location.language || null,
          description: location.description.zh
        }));
      });
  },

  // 根据ID获取地域
  getRegionById: async (id) => {
    await delay(100);
    return fetch(`/api/regions/${id}`)
      .then(response => response.json())
      .catch(async () => {
        const locations = await import('../data/locations.json').then(mod => mod.default.locations);
        const location = locations.find(loc => loc.id === id);
        if (location) {
          return {
            region_id: location.id,
            region_name: location.name.zh,
            parent_id: null,
            location: `POINT(${location.coordinates.lng} ${location.coordinates.lat})`,
            population: location.population || null,
            language: location.language || null,
            description: location.description.zh
          };
        }
        return null;
      });
  },

  // 创建地域
  createRegion: async (regionData) => {
    await delay(200);
    return fetch('/api/regions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regionData)
    })
    .then(response => response.json())
    .catch(async () => {
      // 模拟创建地域
      const locations = (await import('../data/locations.json')).default.locations;
      const newRegion = {
        ...regionData,
        region_id: `loc_${(locations.length + 1).toString().padStart(3, '0')}`
      };
      return newRegion;
    });
  },

  // 更新地域
  updateRegion: async (id, regionData) => {
    await delay(200);
    return fetch(`/api/regions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regionData)
    })
    .then(response => response.json())
    .catch(async () => {
      // 模拟更新地域
      const locations = (await import('../data/locations.json')).default.locations;
      const location = locations.find(loc => loc.id === id);
      if (location) {
        return {
          ...location,
          ...regionData
        };
      }
      return null;
    });
  },

  // 删除地域
  deleteRegion: async (id) => {
    await delay(200);
    return fetch(`/api/regions/${id}`, { method: 'DELETE' })
      .then(response => response.status === 204)
      .catch(async () => {
        // 模拟删除地域
        const locations = (await import('../data/locations.json')).default.locations;
        const index = locations.findIndex(loc => loc.id === id);
        return index !== -1;
      });
  }
};

// 专题管理API
const topicAPI = {
  // 获取所有专题
  getAllTopics: async () => {
    await delay(100);
    return fetch('/api/topics')
      .then(response => response.json())
      .catch(async () => {
        // 模拟从数据库获取专题数据
        const articles = (await import('../data/articles.json')).default.articles;
        // 转换为数据库设计的专题格式
        return articles.map(article => ({
          topic_id: article.id,
          title: article.title.zh,
          cover_url: article.cover_image,
          content: article.content.zh,
          region_id: article.location_id || null,
          author_id: article.author_id,
          status: article.status,
          create_time: article.created_at,
          update_time: article.updated_at
        }));
      });
  },

  // 根据ID获取专题
  getTopicById: async (id) => {
    await delay(100);
    return fetch(`/api/topics/${id}`)
      .then(response => response.json())
      .catch(async () => {
        const articles = (await import('../data/articles.json')).default.articles;
        const article = articles.find(art => art.id === id);
        if (article) {
          return {
            topic_id: article.id,
            title: article.title.zh,
            cover_url: article.cover_image,
            content: article.content.zh,
            region_id: article.location_id || null,
            author_id: article.author_id,
            status: article.status,
            create_time: article.created_at,
            update_time: article.updated_at
          };
        }
        return null;
      });
  },

  // 创建专题
  createTopic: async (topicData) => {
    await delay(200);
    return fetch('/api/topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(topicData)
    })
    .then(response => response.json())
    .catch(async () => {
      // 模拟创建专题
      const articles = (await import('../data/articles.json')).default.articles;
      const newTopic = {
        ...topicData,
        topic_id: `article_${(articles.length + 1).toString().padStart(4, '0')}`,
        create_time: new Date().toISOString(),
        update_time: new Date().toISOString()
      };
      return newTopic;
    });
  },

  // 更新专题
  updateTopic: async (id, topicData) => {
    await delay(200);
    return fetch(`/api/topics/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(topicData)
    })
    .then(response => response.json())
    .catch(async () => {
      // 模拟更新专题
      const articles = (await import('../data/articles.json')).default.articles;
      const article = articles.find(art => art.id === id);
      if (article) {
        return {
          ...article,
          ...topicData,
          update_time: new Date().toISOString()
        };
      }
      return null;
    });
  },

  // 删除专题
  deleteTopic: async (id) => {
    await delay(200);
    return fetch(`/api/topics/${id}`, { method: 'DELETE' })
      .then(response => response.status === 204)
      .catch(async () => {
        // 模拟删除专题
        const articles = (await import('../data/articles.json')).default.articles;
        const index = articles.findIndex(art => art.id === id);
        return index !== -1;
      });
  }
};

// 用户贡献API
const userContributionAPI = {
  // 获取所有用户贡献
  getAllContributions: async () => {
    await delay(100);
    return fetch('/api/user-contributions')
      .then(response => response.json())
      .catch(() => {
        // 返回模拟数据
        return [];
      });
  },

  // 创建用户贡献
  createContribution: async (contributionData) => {
    await delay(200);
    return fetch('/api/user-contributions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contributionData)
    })
    .then(response => response.json())
    .catch(() => {
      // 模拟创建用户贡献
      return {
        ...contributionData,
        contribution_id: `contrib_${Date.now()}`,
        create_time: new Date().toISOString(),
        status: '待审核'
      };
    });
  },

  // 更新用户贡献状态
  updateContributionStatus: async (id, status, auditorId) => {
    await delay(200);
    return fetch(`/api/user-contributions/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, auditor_id: auditorId, audit_time: new Date().toISOString() })
    })
    .then(response => response.json())
    .catch(() => {
      // 模拟更新贡献状态
      return {
        id,
        status,
        auditor_id: auditorId,
        audit_time: new Date().toISOString()
      };
    });
  }
};

// 角色和权限管理API
const rolePermissionAPI = {
  // 获取所有角色
  getAllRoles: async () => {
    await delay(100);
    return fetch('/api/roles')
      .then(response => response.json())
      .catch(async () => {
        return (await import('../data/users.json')).default.roles;
      });
  },

  // 获取所有权限
  getAllPermissions: async () => {
    await delay(100);
    return fetch('/api/permissions')
      .then(response => response.json())
      .catch(async () => {
        return (await import('../data/users.json')).default.permissions;
      });
  },

  // 获取角色权限关联
  getRolePermissions: async (roleId) => {
    await delay(100);
    return fetch(`/api/roles/${roleId}/permissions`)
      .then(response => response.json())
      .catch(async () => {
        const rolePermissions = (await import('../data/users.json')).default.role_permissions;
        return rolePermissions.filter(rp => rp.role_id === roleId).map(rp => rp.permission_id);
      });
  },

  // 更新角色权限
  updateRolePermissions: async (roleId, permissionIds) => {
    await delay(200);
    return fetch(`/api/roles/${roleId}/permissions`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ permission_ids: permissionIds })
    })
    .then(response => response.json())
    .catch(() => {
      // 模拟更新角色权限
      return { role_id: roleId, permission_ids: permissionIds };
    });
  },

  // 创建角色
  createRole: async (roleData) => {
    await delay(200);
    return fetch('/api/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roleData)
    })
    .then(response => response.json())
    .catch(async () => {
      // 模拟创建角色
      const roles = (await import('../data/users.json')).default.roles;
      const newRole = {
        ...roleData,
        id: `role_${(roles.length + 1).toString().padStart(3, '0')}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return newRole;
    });
  },

  // 更新角色
  updateRole: async (id, roleData) => {
    await delay(200);
    return fetch(`/api/roles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roleData)
    })
    .then(response => response.json())
    .catch(async () => {
      // 模拟更新角色
      const roles = (await import('../data/users.json')).default.roles;
      const role = roles.find(r => r.id === id);
      if (role) {
        return {
          ...role,
          ...roleData,
          updated_at: new Date().toISOString()
        };
      }
      return null;
    });
  },

  // 删除角色
  deleteRole: async (id) => {
    await delay(200);
    return fetch(`/api/roles/${id}`, { method: 'DELETE' })
      .then(response => response.status === 204)
      .catch(async () => {
        // 模拟删除角色
        const roles = (await import('../data/users.json')).default.roles;
        const index = roles.findIndex(role => role.id === id);
        return index !== -1;
      });
  }
};

// 导出所有API
const apiService = {
  user: userAPI,
  region: regionAPI,
  topic: topicAPI,
  userContribution: userContributionAPI,
  rolePermission: rolePermissionAPI
};

export default apiService;
