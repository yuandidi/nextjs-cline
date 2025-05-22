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

#### 目录结构

```
frontend/
├── prisma/                # Prisma ORM 配置和数据库种子脚本
├── public/                # 静态资源 (图片、SVG 等)
└── src/
    ├── app/               # Next.js App Router 页面和路由
    │   ├── api/           # API 路由 (后端功能)
    │   ├── blog/          # 博客文章页面
    │   ├── admin/         # 管理界面
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

### 后端架构

后端功能通过 Next.js API Routes 实现，提供 RESTful API 接口，并使用 Prisma ORM 与数据库交互。

#### 技术栈

- **API**: Next.js API Routes
- **ORM**: Prisma 6.8.2
- **数据库**: SQLite (开发环境)
- **内容解析**: gray-matter (解析 Markdown 前置元数据)

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
