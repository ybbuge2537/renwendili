# 文舆世界

一个基于React和Leaflet的交互式人文地理知识共享平台，探索世界人文多样性。

## 项目特点

- **地图+内容**双驱动：以交互式地图为入口，整合文字、图片、视频等多维信息
- **UGC+PGC**结合：专业编辑团队产出深度内容，同时开放用户贡献本地人文资料
- **工具+社区**属性：提供地图标注、路线规划等实用工具，辅以用户交流社区

## 核心功能

### 1. 世界人文地图
- 交互式地图：支持按国家/地区、主题筛选
- 分层信息展示：基础层、文化层、历史层、生活层

### 2. 主题专题栏目
- 地域专题：如「丝绸之路沿线人文变迁」「欧洲中世纪城堡文化」
- 文化专题：如「全球茶文化地图」「世界宗教建筑巡礼」
- 热点专题：结合节日或社会事件推出时效性内容

### 3. 用户贡献区
- 「我的足迹」：用户上传旅行中的人文观察
- 「本地故事」：邀请本地用户分享家乡文化细节
- 「问答社区」：用户提问，由专业用户或编辑解答

### 4. 数据工具库
- 人文数据可视化：如「全球语言分布热力图」「各国人均阅读量对比」
- 实用工具：文化旅行路线规划、民俗日历等

## 技术栈

- 前端：React + Leaflet/Mapbox（地图可视化）
- 后端：Node.js + Express（API接口）
- 数据存储：PostgreSQL（地理数据）、MongoDB（非结构化内容）
- 数据处理：Python（网络爬虫、数据清洗）

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

应用将在 http://localhost:3000 启动

### 构建生产版本

```bash
npm run build
```

## 项目结构

```
├── backend/             # 后端代码
│   ├── config/          # 配置文件
│   ├── models/          # 数据模型
│   ├── routes/          # API路由
│   ├── services/        # 服务层
│   └── sql/             # SQL脚本
├── public/              # 静态资源
│   └── index.html       # HTML模板
├── src/                 # 前端代码
│   ├── components/      # React组件
│   │   ├── MapComponent.js  # 核心地图组件
│   │   ├── Navbar.js    # 导航栏组件
│   │   └── Sidebar.js   # 侧边栏组件
│   ├── data/            # 数据文件
│   ├── pages/           # 页面组件
│   ├── services/        # 服务层
│   ├── App.js           # 主应用组件
│   ├── index.js         # 应用入口
│   ├── App.css          # 应用样式
│   └── index.css        # 全局样式
├── 文档/                # 开发设计文档
├── dev_progress/        # 开发进度文件
├── package.json         # 项目配置
└── README.md            # 项目说明
```

## 项目配置

本项目使用统一的配置文件 `config.js` 集中管理所有配置信息，包括服务器端口、数据库连接、API配置等。

### 配置文件结构

```javascript
// config.js
module.exports = {
  server: {
    port: 5000,      // 后端服务端口
    env: 'development' // 环境
  },
  database: {
    host: 'your-database-host',  // 数据库主机
    port: 3306,          // 数据库端口
    user: 'your-database-user',      // 数据库用户名
    password: 'your-database-password', // 数据库密码
    database: 'your-database-name',  // 数据库名称
    // ... 其他数据库配置
  },
  api: {
    baseUrl: 'http://localhost:5000/api', // API基础URL
    version: '1.0.0'                      // API版本
  },
  security: {
    jwtSecret: 'your-secret-key' // JWT密钥
  }
};
```

### 修改配置

#### 直接修改配置文件

可以直接编辑 `config.js` 文件修改默认配置：

```javascript
// 修改后端服务端口为8080
server: {
  port: 8080,
  env: 'development'
}
```

#### 使用环境变量

为了便于不同环境部署，可以使用环境变量覆盖默认配置：

```bash
# 设置后端端口
SERVER_PORT=8080

# 设置数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=my_database

# 设置前端API URL
REACT_APP_API_URL=http://localhost:8080/api

# 启动服务
node backend/server.js
```

### 配置项说明

#### 服务器配置 (server)
- `port`: 后端服务端口（默认：5000）
- `env`: 运行环境（默认：development）

#### 数据库配置 (database)
- `host`: 数据库主机地址
- `port`: 数据库端口（默认：3306）
- `user`: 数据库用户名
- `password`: 数据库密码
- `database`: 数据库名称
- `connectionLimit`: 数据库连接池大小（默认：10）

#### API配置 (api)
- `baseUrl`: API基础URL（前端使用）
- `version`: API版本号

#### 安全配置 (security)
- `jwtSecret`: JWT密钥（用于用户认证）

### 前后端配置一致性

前端API基础URL默认与后端端口保持一致：

```javascript
// config.js 中的API配置
const apiConfig = {
  baseUrl: process.env.REACT_APP_API_URL || `http://localhost:${serverConfig.port}/api`
};
```

如果需要修改前端API URL，可以通过环境变量 `REACT_APP_API_URL` 进行设置。

## 项目部署

### 环境要求

- Node.js 14.x 或更高版本
- npm 6.x 或更高版本
- MySQL 5.7 或更高版本

### 部署步骤

#### 1. 安装依赖

```bash
npm install
```

#### 2. 配置环境变量

复制环境配置模板文件并根据实际情况修改：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置以下参数：

```env
# 前端配置
REACT_APP_API_URL=http://your-domain.com/api

# 后端配置
PORT=5001

# 数据库配置
DB_HOST=your-database-host
DB_PORT=3306
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name

# JWT配置（如果需要）
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d
```

#### 3. 创建数据库表

确保数据库已经创建，然后运行以下命令创建必要的表：

```bash
node backend/createTables.js
```

#### 4. 构建前端项目

```bash
npm run build
```

#### 5. 启动服务器

##### 开发环境

```bash
npm run dev
```

##### 生产环境

使用 PM2 等进程管理器启动服务：

```bash
# 安装 PM2
npm install -g pm2

# 启动服务
npm run build
npm run server
# 或者使用 PM2
pm run build
pm run server
```

## 贡献指南

欢迎贡献内容和代码！请查看[贡献指南](CONTRIBUTING.md)获取更多信息。

## 许可证

MIT License