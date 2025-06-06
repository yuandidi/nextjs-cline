# 飞书知识库一体化同步工具

这个工具用于将飞书知识库的内容同步到博客系统中，并处理飞书中已删除的文章。

## 功能特点

- **一体化设计**：单一脚本完成所有同步操作
- 从飞书知识库导出文档
- 将导出的文档导入到数据库中
- **自动处理飞书中已删除的文章**
- **自动添加新增的文章**
- **自动更新已有文章**
- 保持数据库与飞书知识库的内容完全同步

## 使用方法

### 环境配置

1. 确保已创建`.env`文件，并填写以下必要的环境变量：
   ```
   FEISHU_APP_ID=your_app_id
   FEISHU_APP_SECRET=your_app_secret
   FEISHU_SPACE_ID=your_space_id
   ```

2. 可选的环境变量：
   ```
   OUTPUT_DIR=path/to/output/directory  # 默认为 src/content/feishu
   BASE_URL=/blog/feishu                # 默认为 /blog/feishu
   URL_STYLE=nested                     # 默认为 nested
   ROOT_NODE_TOKEN=your_root_node_token # 如果需要指定根节点
   ```

### 运行同步

执行以下命令运行一体化同步工具：

```bash
node scripts/feishu-export-all-in-one.js
```

## 工作原理

### 同步过程

1. **获取数据库中现有的飞书文章**
   - 查询数据库中所有类型为`feishu`的文章
   - 记录这些文章的slug和标题

2. **从飞书导出文档**
   - 使用`feishu-pages`工具从飞书知识库导出内容
   - 处理导出的内容，提取标题、摘要等信息
   - 将处理后的内容保存到`src/content/feishu`目录

3. **处理已删除的文章**
   - 比较数据库中的文章和飞书导出的文章
   - 找出在数据库中存在但在飞书导出中不存在的文章
   - 从数据库中删除这些文章

4. **导入新增和更新的文章**
   - 处理每个导出的文章文件
   - 提取文章标题和摘要
   - 如果文章已存在，则更新数据库中的记录
   - 如果文章不存在，则创建新记录

### 删除处理逻辑

当飞书中的文章被删除后，传统的同步方式只会添加新文章或更新现有文章，但不会删除已经不存在的文章。这会导致数据库中保留着飞书中已删除的文章。

一体化同步脚本通过以下步骤解决这个问题：

1. 获取数据库中所有飞书文章的slug集合A
2. 获取飞书导出的所有文章的slug集合B
3. 计算差集A-B，即在A中但不在B中的元素，这些就是需要删除的文章
4. 从数据库中删除这些文章

## 注意事项

- 同步过程会删除飞书中已不存在的文章，请确保这是您期望的行为
- 建议在首次使用前备份数据库
- 如果遇到问题，请检查控制台输出的错误信息
