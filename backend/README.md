# openclaw-backend

一个轻量后端服务，提供：

- 文献检索（arXiv / CrossRef）
- AI 代理（MiniMax OpenAI 兼容接口）
- LaTeX 编译（本地引擎或 fallback）
- SQLite 持久化（收藏论文 / 对话历史）

## 运行

在 PowerShell 中：

```powershell
cd d:\openclaw-backend

d:\jdk-24\bin\javac.exe -cp sqlite-jdbc.jar Main.java

$env:PORT="8080"
$env:OPENAI_API_KEY="sk-api-xxxxxxxxxxxxxxxxxxxxxxxx"
$env:OPENAI_BASE_URL="https://api.minimax.chat/v1"
$env:OPENAI_MODEL="abab6.5s-chat"

d:\jdk-24\bin\java.exe -cp ".;sqlite-jdbc.jar;slf4j-api.jar" Main
```

启动后访问：`http://localhost:8080/health`
