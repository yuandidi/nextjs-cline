# 飞书文档集成指南

本指南将帮助您将飞书知识库中的文档集成到您的博客系统中。飞书作为唯一的数据源，所有内容编辑都在飞书中进行，然后同步到网站。

## 功能概述

- 从飞书知识库导出文档为Markdown格式
- 将导出的文档导入到数据库中
- 在网站上展示飞书文档，与博客文章保持一致的风格
- 支持搜索飞书文档

## 准备工作

1. 确保您已经在飞书开放平台创建了应用，并获取了以下信息：
   - App ID
   - App Secret
   - 知识库空间ID

2. 在项目根目录创建或编辑`.env`文件，添加以下配置：

```
FEISHU_APP_ID=your_app_id
FEISHU_APP_SECRET=your_app_secret
FEISHU_SPACE_ID=your_space_id
```

## 使用方法

### 1. 一键同步（推荐）

执行以下命令，一键完成从飞书导出到数据库导入的全过程：

```bash
npm run feishu:sync
```

这个命令会自动执行以下步骤：
1. 从飞书知识库导出文档
2. 将导出的文档导入到数据库中

### 2. 分步操作

如果您希望分步执行，可以使用以下命令：

#### 从飞书导出文档

```bash
npm run feishu:export
```

这将把飞书知识库中的文档导出为Markdown格式，保存在`src/content/feishu/`目录下。

#### 将导出的文档导入到数据库

```bash
npm run feishu:import
```

这将解析`src/content/feishu/`目录下的Markdown文件，提取标题、摘要等信息，并保存到数据库中。

### 3. 数据库初始状态

数据库初始状态为空，没有任何文章。所有文章都将通过飞书导出功能添加。

示例文章文件仍然保留在`src/content/blog/`目录下，但不会被导入到数据库中。您可以将它们作为参考，或者直接删除。

## 文件结构

- `scripts/feishu-export/index.js`: 飞书导出脚本
- `scripts/import-feishu-to-db.js`: 数据库导入脚本
- `scripts/feishu-sync.js`: 一键同步脚本
- `src/content/feishu/`: 飞书导出的Markdown文件存放目录
- `src/app/feishu/`: 飞书文档页面组件
- `src/lib/api-feishu.ts`: 飞书API相关函数

## 自定义

### 修改文档解析逻辑

如果您需要修改文档解析逻辑，可以编辑`scripts/import-feishu-to-db.js`文件，主要关注以下函数：

- `extractTitle`: 从Markdown内容中提取标题
- `extractExcerpt`: 从内容中提取摘要

### 修改页面样式

飞书文档页面的样式与博客页面保持一致。如果您需要修改样式，可以编辑以下文件：

- `src/app/feishu/page.tsx`: 飞书文档列表页面
- `src/app/feishu/[slug]/page.tsx`: 飞书文档详情页面

## 常见问题

### 导出失败

- 检查`.env`文件中的配置是否正确
- 确保飞书应用有权限访问知识库
- 检查网络连接是否正常

### 导入失败

- 确保已经成功导出了文档
- 检查数据库连接是否正常
- 查看导入脚本的错误日志

### 文档显示异常

- 检查Markdown文件格式是否正确
- 确保文档已成功导入到数据库
- 检查页面组件是否正确渲染文档内容
