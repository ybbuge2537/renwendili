# 开发进度保存说明

## 目的
本文档旨在规范开发团队在项目开发过程中如何记录和保存开发进度，确保进度数据的一致性、完整性和可追溯性。

## 文件结构
项目开发进度保存在 `dev_progress` 文件夹下的 `progress.json` 文件中，其结构如下：

```json
{
  "project_overview": {},      // 项目概览
  "progress_overview": {},    // 进度概览
  "task_list": [],            // 任务列表
  "completed_work": [],       // 已完成工作记录
  "todo_list": [],            // 待办事项
  "issues_and_risks": []      // 问题和风险
}
```

## 字段详细说明

### 1. project_overview
项目基本信息概述

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| project_name | string | 项目名称 | "文舆世界" |
| description | string | 项目描述 | "聚焦全球人文信息的知识共享工具" |
| technical_stack | object | 技术栈 | 包含frontend、map_library等子字段 |
| website_name_candidates | array | 网站名称候选 | ["文舆世界", "寰文地图"] |

### 2. progress_overview
项目整体进度概览

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| current_phase | string | 当前阶段 | "核心功能实现" |
| start_date | string | 开始日期 | "2025-12-27" |
| completion_percentage | number | 完成百分比 | 90 |
| last_updated | string | 最后更新时间 | "2025-12-28T23:00:00" |
| next_milestone | string | 下一里程碑 | "完善与优化" |

### 3. task_list
项目任务列表

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| id | string | 任务ID | "task_001" |
| name | string | 任务名称 | "项目初始化" |
| description | string | 任务描述 | "创建React项目结构，安装必要依赖" |
| status | string | 任务状态 | "completed" / "pending" |
| start_date | string | 开始日期 | "2025-12-27" |
| end_date | string | 结束日期 | "2025-12-27" |
| responsible | string | 负责人 | "AI开发者" |
| completion_percentage | number | 完成百分比 | 100 |

### 4. completed_work
已完成工作记录（核心保存部分）

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| id | string | 工作ID | "work_001" |
| description | string | 工作描述 | "创建package.json并配置依赖" |
| completion_date | string | 完成日期 | "2025-12-27" |
| related_tasks | array | 关联任务 | ["task_001"] |

### 5. todo_list
待办事项

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| id | string | 待办ID | "todo_001" |
| description | string | 待办描述 | "开发社区互动功能" |
| priority | string | 优先级 | "low" / "medium" / "high" |
| due_date | string | 截止日期 | null |
| related_tasks | array | 关联任务 | ["task_007"] |

### 6. issues_and_risks
问题和风险

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| id | string | 问题/风险ID | "issue_001" |
| description | string | 描述 | "create-react-app已弃用" |
| status | string | 状态 | "resolved" / "open" |
| resolution | string | 解决方案 | "已手动创建项目结构" |
| mitigation | string | 缓解措施 | "建议进行商标查询" |

## 开发进度保存流程

1. **确定工作内容**：明确完成的具体工作任务
2. **生成工作ID**：按照"work_XXX"格式生成唯一ID（XXX为3位数字，从001开始递增）
3. **填写完成日期**：使用YYYY-MM-DD格式（如：2025-12-28）
4. **关联任务**：填写与该工作相关的任务ID（从task_list中获取）
5. **更新时间戳**：将progress_overview中的last_updated字段更新为当前时间（ISO格式）

## 保存示例

### 新增已完成工作记录
```json
{
  "id": "work_024",
  "description": "创建文章编辑主要模板，实现可复用的ArticleEditor组件",
  "completion_date": "2025-12-28",
  "related_tasks": ["task_006"]
}
```

### 更新最后更新时间
```json
"last_updated": "2025-12-28T23:00:00"
```

## 注意事项

1. **ID唯一性**：所有ID（task_XXX、work_XXX、todo_XXX、issue_XXX）必须唯一，不得重复
2. **格式一致性**：日期格式必须为YYYY-MM-DD，时间戳格式必须为ISO格式
3. **描述清晰**：工作描述应简洁明了，准确反映完成的工作内容
4. **及时更新**：完成工作后应立即更新进度记录，确保数据时效性
5. **关联正确**：确保completed_work中的related_tasks字段与task_list中的任务ID正确对应
6. **JSON格式**：确保更新后的progress.json文件符合JSON格式规范

## 进度可视化
项目提供了开发进度可视化页面 `progress_visualization.html`，可直接在浏览器中打开查看项目进度的可视化展示。

---

**版本**：1.0  
**最后更新**：2025-12-28