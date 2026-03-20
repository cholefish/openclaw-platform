
  # AI Research Tool Platform (龙虾黑客松参赛作品)

这是一个一站式智能科研工具平台，深度整合了文献检索、LaTeX 在线编译、AI 写作助手以及科研图表动态生成等功能。本项目专为“MiniMax 科研工具赛道”打造，旨在解决科研人员在多工具间频繁切换的痛点。

## ✨ 核心特性

- **文献检索与 RAG**：集成 arXiv 与 CrossRef 接口，支持论文搜索与一键收藏，并通过大模型对文献摘要进行结构化解读。
- **智能 LaTeX 工作区**：内置 Monaco 编辑器，支持实时代码高亮与错误定位。创新的“行内 AI 伴写”功能，允许用户选中段落一键进行学术润色和扩写。
- **AI 动态图表生成**：利用 MiniMax 强大的代码生成能力，将自然语言描述动态转换为 Mermaid 架构图或流程图。
- **持久化工作流**：基于 SQLite 实现本地数据持久化，确保用户的文献收藏和对话历史在刷新或重启后不丢失。

## 🚀 快速开始

本项目采用前后端分离架构。

### 1. 启动后端 (Java)

确保你的机器上安装了 JDK 17+。

```bash
cd d:\openclaw-backend
# 编译
javac -cp sqlite-jdbc.jar Main.java
# 配置环境变量 (请替换为你自己的 API Key)
$env:PORT="8080"
$env:OPENAI_API_KEY="sk-api-xxxxxxxxxxxxxxxxxxxxxxxx"
$env:OPENAI_BASE_URL="https://api.minimax.chat/v1"
$env:OPENAI_MODEL="abab6.5s-chat"
# 运行
java -cp ".;sqlite-jdbc.jar;slf4j-api.jar" Main
```
后端将监听在 `http://localhost:8080`。

### 2. 启动前端 (React + Vite)

确保你的机器上安装了 Node.js (推荐 v20+)。

```bash
cd d:\Airesearchtoolplatform1
npm install
npm run dev
```
前端开发服务器将启动在 `http://localhost:5173`。

## 📖 API 文档 (核心接口)

| 接口路径 | 方法 | 说明 |
| :--- | :--- | :--- |
| `/api/papers/search` | POST | 搜索 arXiv 或 CrossRef 文献 |
| `/api/papers/save` | POST | 将选中文献存入本地 SQLite 数据库 |
| `/api/papers/saved` | GET | 获取用户收藏的文献列表 |
| `/api/agent/chat` | POST | 代理请求大模型，附带聊天记录持久化 |
| `/api/agent/history` | GET | 获取 AI 助手历史对话记录 |
| `/api/latex/compile` | POST | 发送 LaTeX 源码到后端进行编译并返回 PDF Base64 流 |

## 🛡️ 架构与技术栈

- **前端**：React 18, Vite, Tailwind CSS, shadcn/ui, Monaco Editor, Mermaid.js
- **后端**：Java 17 (原生 HttpServer), SQLite JDBC
- **AI 引擎**：MiniMax API (`abab6.5s-chat` 模型)
  