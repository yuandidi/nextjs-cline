# 二次元博客 (Anime Blog)

一个使用 Next.js 和 Prisma 构建的现代化博客平台，专注于动漫、游戏、编程和二次元文化。

## 项目架构

### 前端架构

本项目使用 Next.js 15 构建，采用 App Router 架构，结合 React 19 和 TypeScript 提供类型安全和现代化的开发体验。

#### 技术栈

- **框架**: Next.js 15.3.2 (App Router)
- **UI 库**: React 19.0.0
- **样式**: Tailwind CSS 3.4.0 + PostCSS
- **类型系统**: TypeScript
- **内容渲染**: next-mdx-remote 5.0.0
- **字体**: Noto Sans JP, Quicksand (通过 @fontsource)
- **进度条**: NProgress
- **身份验证**: NextAuth.js (Auth.js)

#### 目录结构

```
frontend/
├── prisma/                # Prisma ORM 配置和数据库种子脚本
├── public/                # 静态资源 (图片、SVG 等)
└── src/
    ├── app/               # Next.js App Router 页面和路由
    │   ├── api/           # API 路由 (后端功能)
    │   │   ├── auth/      # 身份验证 API
    │   ├── blog/          # 博客文章页面
    │   ├── admin/         # 管理界面
    │   ├── login/         # 登录页面
    │   ├── register/      # 注册页面
    │   └── tags/          # 标签页面
    ├── components/        # React 组件
    ├── content/           # 博客内容 (MDX 文件)
    └── lib/               # 工具函数和 API 客户端
```

#### 主要组件

- **Header**: 导航栏组件，包含网站标题和主要导航链接
- **Footer**: 页脚组件
- **BlogPostCard**: 博客文章卡片组件，用于首页和标签页展示
- **MDXContent**: Markdown/MDX 内容渲染组件
- **PostForm**: 博客文章创建和编辑表单
- **SearchBar**: 搜索功能组件
- **TagList**: 标签列表组件
- **DarkModeToggle**: 暗色模式切换组件
- **LoadingProvider**: 加载状态管理组件
- **CoverImage**: 封面图片组件
- **SessionProvider**: 会话管理组件

### 后端架构

后端功能通过 Next.js API Routes 实现，提供 RESTful API 接口，并使用 Prisma ORM 与数据库交互。

#### 技术栈

- **API**: Next.js API Routes
- **ORM**: Prisma 6.8.2
- **数据库**: SQLite (开发环境)
- **内容解析**: gray-matter (解析 Markdown 前置元数据)
- **身份验证**: NextAuth.js (Auth.js)
- **密码加密**: bcrypt

#### API 路由

- **/api/posts**: 博客文章 CRUD 操作
  - GET: 获取所有文章
  - POST: 创建新文章
- **/api/posts/[slug]**: 单篇文章操作
  - GET: 获取单篇文章
  - PUT: 更新文章
  - DELETE: 删除文章
- **/api/tags**: 标签操作
  - GET: 获取所有标签
- **/api/auth/[...nextauth]**: NextAuth.js API 路由
- **/api/auth/register**: 用户注册 API

### 数据库模型

使用 Prisma ORM 定义的数据模型:

#### Post 模型

```prisma
model Post {
  id         Int      @id @default(autoincrement())
  slug       String   @unique
  title      String
  date       DateTime
  excerpt    String
  coverImage String?
  content    String
  tags       Tag[]    @relation("PostToTag")
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

#### Tag 模型

```prisma
model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[] @relation("PostToTag")
}
```

### 数据流

1. **内容创建流程**:
   - 通过管理界面创建/编辑文章
   - PostForm 组件收集数据
   - 调用 API 客户端函数 (createPost/updatePost)
   - API 路由处理请求并使用 Prisma 存储到数据库

2. **内容展示流程**:
   - 页面组件通过 getPostBySlug/getAllPosts 函数获取数据
   - 这些函数首先尝试从 API 获取数据
   - 如果 API 请求失败，回退到示例数据
   - 数据传递给相应的组件进行渲染

3. **搜索和过滤**:
   - 通过标签系统实现内容分类
   - 搜索功能在客户端实现，过滤已加载的文章

## 特色功能

- **响应式设计**: 适配各种屏幕尺寸的现代化界面
- **暗色模式**: 支持亮色/暗色主题切换
- **MDX 支持**: 在 Markdown 中使用 React 组件
- **标签系统**: 通过标签对内容进行分类和过滤
- **管理界面**: 内置内容管理系统，无需额外后台
- **SEO 优化**: 使用 Next.js 的元数据 API 优化搜索引擎收录
- **二次元主题**: 专为动漫和二次元内容设计的 UI
- **用户认证系统**: 支持用户注册、登录和基于角色的权限控制
- **社交登录**: 支持 GitHub OAuth 登录

## 身份验证系统

本项目使用 NextAuth.js (Auth.js) 实现了一套完整的身份验证系统，包括用户注册、登录、权限控制等功能。

### 功能特点

- 用户注册和登录
- 基于角色的权限控制（普通用户和管理员）
- 保护管理员路由
- 安全的密码存储（使用 bcrypt 加密）
- JWT 会话管理
- GitHub OAuth 社交登录

### 设置说明

#### 环境变量

项目根目录下的 `.env` 文件包含以下环境变量：

```
NEXTAUTH_SECRET=your_nextauth_secret_key_here
NEXTAUTH_URL=http://localhost:3000
```

请确保将 `NEXTAUTH_SECRET` 更改为一个安全的随机字符串，用于 JWT 加密。

#### 数据库迁移

项目使用 Prisma ORM 管理数据库。已经添加了必要的身份验证模型到 `prisma/schema.prisma` 文件中。

如果需要重新创建数据库，请运行：

```bash
npx prisma migrate reset --force
```

#### 创建管理员用户

提供了一个脚本来创建管理员用户：

```bash
npx ts-node scripts/create-admin.ts <email> <password> [name]
```

例如：

```bash
npx ts-node scripts/create-admin.ts admin@example.com password123 管理员
```

### 使用说明

#### 用户注册

访问 `/register` 路由可以注册新用户。注册表单包括：

- 姓名
- 电子邮件
- 密码
- 确认密码

#### 用户登录

访问 `/login` 路由可以登录已有账户。登录表单包括：

- 电子邮件
- 密码

#### 权限控制

系统实现了基于角色的权限控制：

- 普通用户：可以访问公共页面
- 管理员用户：可以访问管理员页面（`/admin` 路由）

中间件 (`src/middleware.ts`) 负责路由保护，确保只有已登录的用户可以访问受保护的路由，只有管理员可以访问管理员路由。

#### 前端集成

Header 组件已更新，根据用户登录状态显示不同的导航选项：

- 未登录用户：显示"登录"链接
- 已登录用户：显示用户名和"退出"按钮
- 管理员用户：额外显示"管理"链接

### 社交登录

#### GitHub 登录

本系统已集成 GitHub OAuth 登录功能，允许用户使用其 GitHub 账户进行登录和注册。

##### 配置步骤

1. 在 GitHub 上创建 OAuth 应用：
   - 访问 GitHub 设置 -> Developer settings -> OAuth Apps -> New OAuth App
   - 填写应用信息：
     - Application name: 您的应用名称
     - Homepage URL: 您的网站首页 URL
     - Application description: 简短描述（可选）
     - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`（生产环境需更改为实际域名）

2. 获取 Client ID 和 Client Secret

3. 在 `.env` 文件中添加以下环境变量：
   ```
   GITHUB_ID=your_github_client_id
   GITHUB_SECRET=your_github_client_secret
   ```

4. 重启应用以使配置生效

##### 常见问题排查

如果在使用 GitHub 登录时遇到问题，请检查以下几点：

1. **确保 NEXTAUTH_SECRET 已正确设置**：
   - 在 `.env` 文件中，将 `NEXTAUTH_SECRET=your_nextauth_secret_key_here` 替换为一个真实的随机字符串
   - 可以使用以下命令生成一个安全的随机字符串：
     ```bash
     node -e "console.log(crypto.randomBytes(32).toString('hex'))"
     ```

2. **验证 GitHub OAuth 应用配置**：
   - 确保 Authorization callback URL 完全匹配 `http://localhost:3000/api/auth/callback/github`
   - 检查 Client ID 和 Client Secret 是否正确复制到 `.env` 文件中

3. **检查数据库连接**：
   - 确保数据库已正确迁移：
     ```bash
     npx prisma migrate reset --force
     ```
   - 验证数据库文件权限是否正确

4. **查看调试日志**：
   - 在开发环境中，NextAuth.js 会输出调试日志
   - 检查控制台是否有任何错误消息

5. **回调页面问题**：
   - 如果认证后停留在 `/api/auth/callback/github` 页面，可能是因为回调处理出现问题
   - 尝试重新启动开发服务器：
     ```bash
     npm run dev
     ```

### 安全注意事项

- 确保 `NEXTAUTH_SECRET` 是一个强随机字符串
- 定期更新依赖包以修复安全漏洞
- 考虑在生产环境中使用更强大的数据库（如 PostgreSQL）
- 生产环境中使用 HTTPS 保护 OAuth 回调
- 定期审查授权的应用和权限

## 开发指南

### 环境要求

- Node.js 18.0.0 或更高版本
- npm 9.0.0 或更高版本

### 安装步骤

1. 克隆仓库
   ```bash
   git clone <repository-url>
   cd blog/frontend
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 设置数据库
   ```bash
   npx prisma migrate dev --name init
   npm run seed
   ```

4. 启动开发服务器
   ```bash
   npm run dev
   ```

5. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
npm run build
npm start
```

## 部署指南

本项目可以部署到任何支持 Node.js 的平台，推荐使用 Vercel 进行部署:

1. 在 Vercel 上导入项目
2. 配置环境变量 (如需要)
3. 部署

对于数据库，生产环境建议使用:
- PostgreSQL (通过 Vercel Postgres)
- MySQL (通过 PlanetScale)
- 或其他 Prisma 支持的数据库

## 贡献指南

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

[MIT](LICENSE)
