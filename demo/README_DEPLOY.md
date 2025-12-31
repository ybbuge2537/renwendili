# 文舆世界 - 部署指南

## 环境要求

- Node.js >= 14.x
- npm >= 6.x
- MySQL >= 5.7

## 快速开始

### 1. 环境配置

复制环境配置模板并根据实际情况修改：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置数据库连接和其他参数：

```env
# 前端配置
REACT_APP_API_URL=http://your-server-ip:5001/api

# 后端配置
PORT=5001

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# JWT配置（如果需要）
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

### 2. 安装依赖

```bash
npm install --production
```

### 3. 数据库初始化

执行数据库表创建脚本：

```bash
node backend/createTables.js
```

### 4. 启动应用

#### 方法一：直接启动（适合测试）

```bash
npm run server
```

应用将在 http://localhost:5001 运行

#### 方法二：使用 PM2 启动（推荐生产环境）

```bash
# 全局安装 PM2
npm install -g pm2

# 使用 PM2 启动应用
pm run server:pm2

# 查看应用状态
pm run server:status

# 停止应用
npm run server:stop
```

### 5. 访问应用

在浏览器中访问：http://your-server-ip:5001

## 项目结构

```
├── backend/           # 后端代码
│   ├── config/       # 配置文件
│   ├── models/       # 数据模型
│   ├── routes/       # API路由
│   ├── services/     # 服务层
│   ├── sql/          # SQL脚本
│   └── createTables.js  # 数据库表创建脚本
├── build/            # 前端构建文件
├── src/              # 前端源码
├── .env              # 环境配置
├── .env.example      # 环境配置模板
├── server.js         # 后端服务入口
├── package.json      # 项目配置
└── ecosystem.config.js  # PM2配置
```

## API接口

### 文章管理
- GET `/api/articles` - 获取文章列表（支持分页、筛选）
- POST `/api/articles` - 创建文章
- GET `/api/articles/:id` - 获取文章详情
- PUT `/api/articles/:id` - 更新文章
- DELETE `/api/articles/:id` - 删除文章
- PUT `/api/articles/:id/status` - 更新文章状态

### 用户管理
- GET `/api/users` - 获取用户列表
- POST `/api/users` - 创建用户
- GET `/api/users/:id` - 获取用户详情
- PUT `/api/users/:id` - 更新用户
- DELETE `/api/users/:id` - 删除用户

### 地域管理
- GET `/api/regions` - 获取地域列表
- GET `/api/regions/:id` - 获取地域详情

## 常见问题

### Q: 数据库连接失败
A: 请检查 `.env` 文件中的数据库配置是否正确，确保数据库服务正在运行，并且用户有足够的权限。

### Q: 应用无法启动
A: 请检查端口是否被占用，或查看日志文件了解具体错误信息。

### Q: 前端页面无法访问后端API
A: 请检查 `REACT_APP_API_URL` 配置是否正确，确保API服务正在运行。

## 技术支持

如有问题，请联系项目开发团队。
