# 登录系统使用指南

本项目使用 NextAuth.js (Auth.js) 实现了一套完整的身份验证系统，包括用户注册、登录、权限控制等功能。

## 功能特点

- 用户注册和登录
- 基于角色的权限控制（普通用户和管理员）
- 保护管理员路由
- 安全的密码存储（使用 bcrypt 加密）
- JWT 会话管理

## 技术栈

- Next.js 15.x
- NextAuth.js (Auth.js)
- Prisma ORM
- SQLite 数据库
- TypeScript
- Tailwind CSS

## 设置说明

### 环境变量

项目根目录下的 `.env` 文件包含以下环境变量：

```
NEXTAUTH_SECRET=your_nextauth_secret_key_here
NEXTAUTH_URL=http://localhost:3000
```

请确保将 `NEXTAUTH_SECRET` 更改为一个安全的随机字符串，用于 JWT 加密。

### 数据库迁移

项目使用 Prisma ORM 管理数据库。已经添加了必要的身份验证模型到 `prisma/schema.prisma` 文件中。

如果需要重新创建数据库，请运行：

```bash
npx prisma migrate reset --force
```

### 创建管理员用户

提供了一个脚本来创建管理员用户：

```bash
npx ts-node scripts/create-admin.ts <email> <password> [name]
```

例如：

```bash
npx ts-node scripts/create-admin.ts admin@example.com password123 管理员
```

## 使用说明

### 用户注册

访问 `/register` 路由可以注册新用户。注册表单包括：

- 姓名
- 电子邮件
- 密码
- 确认密码

### 用户登录

访问 `/login` 路由可以登录已有账户。登录表单包括：

- 电子邮件
- 密码

### 权限控制

系统实现了基于角色的权限控制：

- 普通用户：可以访问公共页面
- 管理员用户：可以访问管理员页面（`/admin` 路由）

中间件 (`src/middleware.ts`) 负责路由保护，确保只有已登录的用户可以访问受保护的路由，只有管理员可以访问管理员路由。

### 前端集成

Header 组件已更新，根据用户登录状态显示不同的导航选项：

- 未登录用户：显示"登录"链接
- 已登录用户：显示用户名和"退出"按钮
- 管理员用户：额外显示"管理"链接

## API 端点

### 身份验证 API

- `/api/auth/[...nextauth]` - NextAuth.js API 路由
- `/api/auth/register` - 用户注册 API

## 自定义配置

身份验证配置位于 `src/lib/auth.ts` 文件中，可以根据需要进行自定义：

- 添加更多身份验证提供商（如 Google、GitHub 等）
- 自定义回调函数
- 修改会话处理方式

## 安全注意事项

- 确保 `NEXTAUTH_SECRET` 是一个强随机字符串
- 定期更新依赖包以修复安全漏洞
- 考虑在生产环境中使用更强大的数据库（如 PostgreSQL）
