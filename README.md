# Koa API Template

一个基于 Koa.js 的轻量级账号系统模板，提供完整的用户认证和账号管理功能。

## ✨ 特性

- 🔐 完整的用户认证系统
- 📝 用户账号管理
- 🚀 基于 Koa.js 的高性能架构
- 🎯 RESTful API 设计
- 🔧 简单易用的配置
- 📦 开箱即用的 Docker 支持

## 🛠️ 技术栈

- Koa.js
- MySQL
- JWT 认证
- Docker & Docker Compose

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- MySQL >= 8.0
- Docker (可选)

### 安装

1. 克隆项目
```bash
git clone https://github.com/wangliang01/koa-api-template.git
cd koa-api-template
```

2. 安装依赖
```bash
pnpm install
```

3. 启动项目
```bash
# 开发模式
pnpm  dev

# 生产模式
pnpm start
```

### Docker 部署

使用 Docker Compose 一键部署：

```bash
docker-compose up -d
```

## 📚 API 文档

### 认证相关

#### 登录
- **POST** `/api/auth/login`
```json
{
    "email": "user@example.com",
    "password": "your_password"
}
```

#### 注册
- **POST** `/api/auth/register`
```json
{
    "email": "user@example.com",
    "password": "your_password",
    "name": "User Name"
}
```

## 📝 项目结构

```
.
├── src/
│   ├── controllers/     # 控制器
│   ├── models/         # 数据模型
│   ├── routes/         # 路由定义
│   ├── middleware/     # 中间件
│   ├── config/        # 配置文件
│   └── app.js         # 应用入口
├── mysql/             # MySQL 相关文件
├── test/             # 测试文件
├── .env              # 环境变量
└── docker-compose.yml # Docker 配置
```

## 🔧 配置说明

主要配置项（在 .env 文件中）：

```env
# 服务器配置
PORT=3000
NODE_ENV=development

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_DATABASE=koa_gold_console

# JWT配置
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

## 📄 License

MIT License 