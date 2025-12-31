// API服务层，与后端API通信

// API基础URL
const API_BASE_URL = 'http://localhost:5001/api';

// 通用请求函数
const request = async (url, options = {}) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);
    
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('API请求超时:', url);
      throw new Error('请求超时，请稍后重试');
    }
    console.error('API请求失败:', error);
    throw error;
  }
};

// 地域管理API
const regionAPI = {
  // 获取所有地域
  getAllRegions: async () => {
    return await request('/regions');
  },

  // 根据ID获取地域
  getRegionById: async (id) => {
    return await request(`/regions/${id}`);
  },

  // 创建地域
  createRegion: async (regionData) => {
    return await request('/regions', {
      method: 'POST',
      body: JSON.stringify(regionData)
    });
  },

  // 更新地域
  updateRegion: async (id, regionData) => {
    return await request(`/regions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(regionData)
    });
  },

  // 删除地域
  deleteRegion: async (id) => {
    return await request(`/regions/${id}`, {
      method: 'DELETE'
    });
  },

  // 获取子地域
  getChildRegions: async (parentId) => {
    return await request(`/regions/parent/${parentId}`);
  }
};

// 专题管理API
const topicAPI = {
  // 获取所有专题
  getAllTopics: async () => {
    return await request('/topics');
  },

  // 根据ID获取专题
  getTopicById: async (id) => {
    return await request(`/topics/${id}`);
  },

  // 创建专题
  createTopic: async (topicData) => {
    return await request('/topics', {
      method: 'POST',
      body: JSON.stringify(topicData)
    });
  },

  // 更新专题
  updateTopic: async (id, topicData) => {
    return await request(`/topics/${id}`, {
      method: 'PUT',
      body: JSON.stringify(topicData)
    });
  },

  // 删除专题
  deleteTopic: async (id) => {
    return await request(`/topics/${id}`, {
      method: 'DELETE'
    });
  },

  // 根据作者ID获取专题
  getTopicsByAuthor: async (authorId) => {
    return await request(`/topics/author/${authorId}`);
  },

  // 根据地域ID获取专题
  getTopicsByRegion: async (regionId) => {
    return await request(`/topics/region/${regionId}`);
  },

  // 搜索专题
  searchTopics: async (keyword) => {
    return await request(`/topics/search/${keyword}`);
  }
};

// 文章管理API
const articleAPI = {
  // 获取所有文章
  getAllArticles: async () => {
    return await request('/articles');
  },

  // 根据ID获取文章
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

// 用户管理API
const userAPI = {
  // 获取所有用户
  getAllUsers: async () => {
    return await request('/users');
  },

  // 根据ID获取用户
  getUserById: async (id) => {
    return await request(`/users/${id}`);
  },

  // 根据用户名获取用户
  getUserByUsername: async (username) => {
    return await request(`/users/username/${username}`);
  },

  // 根据邮箱获取用户
  getUserByEmail: async (email) => {
    return await request(`/users/email/${email}`);
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

  // 根据角色获取用户
  getUsersByRole: async (role) => {
    return await request(`/users/role/${role}`);
  }
};

// 导出所有API
const apiService = {
  region: regionAPI,
  topic: topicAPI,
  article: articleAPI,
  user: userAPI
};

export default apiService;