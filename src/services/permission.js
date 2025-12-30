// 权限控制服务

// 定义角色权限
const permissions = {
  // 管理员：拥有所有权限
  admin: {
    pages: {
      dashboard: true,
      articles: true,
      media: true,
      categories: true,
      users: true,
      settings: true
    },
    actions: {
      article: {
        view: true,
        add: true,
        edit: true,
        delete: true
      },
      media: {
        view: true,
        upload: true,
        delete: true
      },
      category: {
        view: true,
        add: true,
        edit: true,
        delete: true
      },
      user: {
        view: true,
        add: true,
        edit: true,
        delete: true
      },
      setting: {
        view: true,
        edit: true
      }
    }
  },
  // 普通用户：基础权限
  user: {
    pages: {
      dashboard: false,
      articles: false,
      media: false,
      categories: false,
      users: false,
      settings: false
    },
    actions: {
      article: {
        view: true,
        add: false,
        edit: false,
        delete: false
      },
      media: {
        view: true,
        upload: false,
        delete: false
      },
      category: {
        view: true,
        add: false,
        edit: false,
        delete: false
      },
      user: {
        view: false,
        add: false,
        edit: false,
        delete: false
      },
      setting: {
        view: false,
        edit: false
      }
    }
  },
  // 编辑：可以管理文章、媒体、分类，但不能管理用户和系统设置
  editor: {
    pages: {
      dashboard: true,
      articles: true,
      media: true,
      categories: true,
      users: false,
      settings: false
    },
    actions: {
      article: {
        view: true,
        add: true,
        edit: true,
        delete: true
      },
      media: {
        view: true,
        upload: true,
        delete: true
      },
      category: {
        view: true,
        add: true,
        edit: true,
        delete: true
      },
      user: {
        view: false,
        add: false,
        edit: false,
        delete: false
      },
      setting: {
        view: false,
        edit: false
      }
    }
  },
  // 作者：只能创建和编辑自己的文章
  writer: {
    pages: {
      dashboard: true,
      articles: true,
      media: true,
      categories: true,
      users: false,
      settings: false
    },
    actions: {
      article: {
        view: true,
        add: true,
        edit: true,  // 但需要额外检查是否是自己的文章
        delete: true  // 但需要额外检查是否是自己的文章
      },
      media: {
        view: true,
        upload: true,
        delete: true  // 但需要额外检查是否是自己上传的媒体
      },
      category: {
        view: true,
        add: false,
        edit: false,
        delete: false
      },
      user: {
        view: false,
        add: false,
        edit: false,
        delete: false
      },
      setting: {
        view: false,
        edit: false
      }
    }
  },
  // 查看者：只能查看内容
  viewer: {
    pages: {
      dashboard: true,
      articles: true,
      media: true,
      categories: true,
      users: false,
      settings: false
    },
    actions: {
      article: {
        view: true,
        add: false,
        edit: false,
        delete: false
      },
      media: {
        view: true,
        upload: false,
        delete: false
      },
      category: {
        view: true,
        add: false,
        edit: false,
        delete: false
      },
      user: {
        view: false,
        add: false,
        edit: false,
        delete: false
      },
      setting: {
        view: false,
        edit: false
      }
    }
  }
};

// 检查用户是否有权限访问页面
export const checkPagePermission = (user, page) => {
  if (!user || !user.role) {
    return false;
  }
  
  const rolePermissions = permissions[user.role];
  if (!rolePermissions) {
    return false;
  }
  
  return rolePermissions.pages[page] || false;
};

// 检查用户是否有权限执行操作
export const checkActionPermission = (user, module, action) => {
  if (!user || !user.role) {
    return false;
  }
  
  const rolePermissions = permissions[user.role];
  if (!rolePermissions) {
    return false;
  }
  
  const modulePermissions = rolePermissions.actions[module];
  if (!modulePermissions) {
    return false;
  }
  
  return modulePermissions[action] || false;
};

// 获取用户权限信息
export const getUserPermissions = (user) => {
  if (!user || !user.role) {
    return null;
  }
  
  return permissions[user.role] || null;
};

// 检查用户是否是管理员
export const isAdmin = (user) => {
  return user && user.role === 'admin';
};

// 检查用户是否是编辑或更高权限
export const isEditorOrHigher = (user) => {
  return user && (user.role === 'admin' || user.role === 'editor');
};

// 检查用户是否是作者或更高权限
export const isWriterOrHigher = (user) => {
  return user && (user.role === 'admin' || user.role === 'editor' || user.role === 'writer');
};

// 检查用户是否可以编辑特定文章（作者只能编辑自己的文章）
export const canEditArticle = (user, article) => {
  // 管理员和编辑可以编辑所有文章
  if (isEditorOrHigher(user)) {
    return true;
  }
  
  // 作者只能编辑自己的文章
  if (user.role === 'writer' && article && article.authorId === user.id) {
    return true;
  }
  
  return false;
};

// 检查用户是否可以删除特定文章（作者只能删除自己的文章）
export const canDeleteArticle = (user, article) => {
  // 管理员和编辑可以删除所有文章
  if (isEditorOrHigher(user)) {
    return true;
  }
  
  // 作者只能删除自己的文章
  if (user.role === 'writer' && article && article.authorId === user.id) {
    return true;
  }
  
  return false;
};

export default {
  checkPagePermission,
  checkActionPermission,
  getUserPermissions,
  isAdmin,
  isEditorOrHigher,
  isWriterOrHigher,
  canEditArticle,
  canDeleteArticle
};