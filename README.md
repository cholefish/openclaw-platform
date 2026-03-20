# OpenClaw Research Tool Platform (Monorepo)

该仓库将前端与后端放在同一个仓库目录中，便于黑客松交付与复现。

## 目录结构

- `frontend/`：React + Vite 前端（LaTeX 工作区 / 文献检索 / AI 助手 / AI 出图）
- `backend/`：Java 后端（API 网关 + SQLite 持久化 + LaTeX 编译 + MiniMax 代理）

## 本地运行

### 1) 启动后端

在 PowerShell 中：

```powershell
cd D:\openclaw-platform\backend

# 需要准备 sqlite-jdbc.jar 与 slf4j-api.jar（本仓库默认不提交 jar）
d:\jdk-24\bin\javac.exe -cp sqlite-jdbc.jar Main.java

$env:PORT="8080"
$env:OPENAI_API_KEY="sk-api-xxxxxxxxxxxxxxxxxxxxxxxx"
$env:OPENAI_BASE_URL="https://api.minimax.chat/v1"
$env:OPENAI_MODEL="abab6.5s-chat"

d:\jdk-24\bin\java.exe -cp ".;sqlite-jdbc.jar;slf4j-api.jar" Main
```

健康检查：`http://localhost:8080/health`

### 2) 启动前端

```powershell
cd D:\openclaw-platform\frontend
npm install
npm run dev
```

访问：`http://localhost:5173`

## 核心 API

- `POST /api/papers/search`：检索 arXiv/CrossRef
- `POST /api/papers/analyze`：对论文标题+摘要做结构化中文解读
- `POST /api/papers/save` / `GET /api/papers/saved`：收藏持久化
- `POST /api/agent/chat` / `GET /api/agent/history`：AI 对话与历史
- `POST /api/latex/compile`：LaTeX 编译返回 PDF Base64

