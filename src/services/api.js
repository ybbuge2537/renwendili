// API服务文件

// API基础URL
const API_BASE_URL = 'http://localhost:5001/api';

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
  }
};

// 文章管理API
export const articleApi = {
  // 获取所有文章
  getAllArticles: async () => {
    return await request('/articles');
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
  }
};

// 其他API模块可以在这里添加
export default {
  userApi,
  articleApi
};
