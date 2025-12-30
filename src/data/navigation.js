// 导航菜单数据结构
export const navigationMenu = [
  {
    id: 'home',
    name: '首页',
    path: '/',
    icon: '🏠',
    permissions: ['visitor', 'user', 'creator', 'admin'],
    children: [
      {
        id: 'home-carousel',
        name: '轮播专题',
        path: '/home/carousel',
        permissions: ['visitor', 'user', 'creator', 'admin']
      },
      {
        id: 'home-recommendations',
        name: '热门推荐',
        path: '/home/recommendations',
        permissions: ['visitor', 'user', 'creator', 'admin']
      },
      {
        id: 'home-quick-access',
        name: '快捷入口',
        path: '/home/quick-access',
        permissions: ['visitor', 'user', 'creator', 'admin']
      }
    ]
  },
  {
    id: 'knowledge',
    name: '知识资源',
    path: '/knowledge',
    icon: '📚',
    permissions: ['visitor', 'user', 'creator', 'admin'],
    children: [
      {
        id: 'knowledge-regional',
        name: '区域地理',
        path: '/knowledge/regional',
        permissions: ['visitor', 'user', 'creator', 'admin'],
        children: [
          {
            id: 'knowledge-regional-china',
            name: '中国地理',
            path: '/knowledge/regional/china',
            permissions: ['visitor', 'user', 'creator', 'admin']
          },
          {
            id: 'knowledge-regional-world',
            name: '世界地理',
            path: '/knowledge/regional/world',
            permissions: ['visitor', 'user', 'creator', 'admin']
          }
        ]
      },
      {
        id: 'knowledge-cultural',
        name: '文化地理',
        path: '/knowledge/cultural',
        permissions: ['visitor', 'user', 'creator', 'admin'],
        children: [
          {
            id: 'knowledge-cultural-customs',
            name: '民俗',
            path: '/knowledge/cultural/customs',
            permissions: ['visitor', 'user', 'creator', 'admin']
          },
          {
            id: 'knowledge-cultural-architecture',
            name: '建筑',
            path: '/knowledge/cultural/architecture',
            permissions: ['visitor', 'user', 'creator', 'admin']
          },
          {
            id: 'knowledge-cultural-language',
            name: '语言',
            path: '/knowledge/cultural/language',
            permissions: ['visitor', 'user', 'creator', 'admin']
          }
        ]
      },
      {
        id: 'knowledge-economic',
        name: '经济地理',
        path: '/knowledge/economic',
        permissions: ['visitor', 'user', 'creator', 'admin']
      },
      {
        id: 'knowledge-history',
        name: '历史地理',
        path: '/knowledge/history',
        permissions: ['visitor', 'user', 'creator', 'admin']
      },
      {
        id: 'knowledge-tourism',
        name: '旅游地理',
        path: '/knowledge/tourism',
        permissions: ['visitor', 'user', 'creator', 'admin']
      },
      {
        id: 'knowledge-graph',
        name: '知识图谱',
        path: '/knowledge/graph',
        permissions: ['visitor', 'user', 'creator', 'admin']
      },
      {
        id: 'knowledge-resources',
        name: '资源库',
        path: '/knowledge/resources',
        permissions: ['visitor', 'user', 'creator', 'admin']
      }
    ]
  },
  {
    id: 'community',
    name: '社区互动',
    path: '/community',
    icon: '👥',
    permissions: ['user', 'creator', 'admin'],
    children: [
      {
        id: 'community-qa',
        name: '问答广场',
        path: '/community/qa',
        permissions: ['user', 'creator', 'admin']
      },
      {
        id: 'community-forum',
        name: '专题论坛',
        path: '/community/forum',
        permissions: ['user', 'creator', 'admin']
      },
      {
        id: 'community-groups',
        name: '小组社群',
        path: '/community/groups',
        permissions: ['user', 'creator', 'admin']
      }
    ]
  },
  {
    id: 'creation',
    name: '创作中心',
    path: '/creation',
    icon: '✍️',
    permissions: ['creator', 'admin'],
    children: [
      {
        id: 'creation-article',
        name: '发布文章',
        path: '/creation/article',
        permissions: ['creator', 'admin']
      },
      {
        id: 'creation-resource',
        name: '上传资源',
        path: '/creation/resource',
        permissions: ['creator', 'admin']
      },
      {
        id: 'creation-drafts',
        name: '草稿箱',
        path: '/creation/drafts',
        permissions: ['creator', 'admin']
      }
    ]
  },
  {
    id: 'profile',
    name: '个人中心',
    path: '/user/profile',
    icon: '👤',
    permissions: ['user', 'creator', 'admin'],
    children: [
      {
        id: 'profile-content',
        name: '我的内容',
        path: '/user/profile/content',
        permissions: ['user', 'creator', 'admin']
      },
      {
        id: 'profile-collections',
        name: '收藏夹',
        path: '/user/profile/collections',
        permissions: ['user', 'creator', 'admin']
      },
      {
        id: 'profile-points',
        name: '积分与等级',
        path: '/user/profile/points',
        permissions: ['user', 'creator', 'admin']
      },
      {
        id: 'profile-settings',
        name: '账号设置',
        path: '/user/profile/settings',
        permissions: ['user', 'creator', 'admin']
      }
    ]
  },
  {
    id: 'about',
    name: '关于平台',
    path: '/about',
    icon: 'ℹ️',
    permissions: ['visitor', 'user', 'creator', 'admin'],
    children: [
      {
        id: 'about-intro',
        name: '平台介绍',
        path: '/about/intro',
        permissions: ['visitor', 'user', 'creator', 'admin']
      },
      {
        id: 'about-guide',
        name: '使用指南',
        path: '/about/guide',
        permissions: ['visitor', 'user', 'creator', 'admin']
      },
      {
        id: 'about-feedback',
        name: '反馈建议',
        path: '/about/feedback',
        permissions: ['visitor', 'user', 'creator', 'admin']
      },
      {
        id: 'about-contact',
        name: '联系我们',
        path: '/about/contact',
        permissions: ['visitor', 'user', 'creator', 'admin']
      }
    ]
  },
  {
    id: 'admin',
    name: '管理员后台',
    path: '/cms/dashboard',
    icon: '⚙️',
    permissions: ['admin'],
    children: [
      {
        id: 'admin-dashboard',
        name: '仪表盘',
        path: '/cms/dashboard',
        permissions: ['admin']
      },
      {
        id: 'admin-articles',
        name: '文章管理',
        path: '/cms/articles',
        permissions: ['admin']
      },
      {
        id: 'admin-categories',
        name: '分类管理',
        path: '/cms/categories',
        permissions: ['admin']
      },
      {
        id: 'admin-users',
        name: '用户管理',
        path: '/cms/users',
        permissions: ['admin']
      },
      {
        id: 'admin-media',
        name: '媒体管理',
        path: '/cms/media',
        permissions: ['admin']
      },
      {
        id: 'admin-settings',
        name: '系统设置',
        path: '/cms/settings',
        permissions: ['admin']
      }
    ]
  }
];

// 移动端底部快捷入口
export const mobileBottomNav = [
  {
    id: 'mobile-home',
    name: '首页',
    path: '/',
    icon: '🏠'
  },
  {
    id: 'mobile-knowledge',
    name: '知识',
    path: '/knowledge',
    icon: '📚'
  },
  {
    id: 'mobile-community',
    name: '社区',
    path: '/community',
    icon: '👥'
  },
  {
    id: 'mobile-profile',
    name: '我的',
    path: '/user/profile',
    icon: '👤'
  }
];
