import { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { 
  Download, 
  Upload, 
  Save, 
  Play, 
  Settings, 
  Eye,
  Code,
  SplitSquareVertical,
  Wand2,
  Loader2
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

const defaultLatexContent = `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{graphicx}

\\title{AI科研工具平台}
\\author{ResearchAI}
\\date{March 2026}

\\begin{document}

\\maketitle

\\section{引言}
欢迎使用ResearchAI LaTeX编辑器。这是一个集成AI能力的现代化科研写作工具。

\\section{主要特性}
\\begin{itemize}
    \\item 实时预览
    \\item AI写作辅助
    \\item 智能补全
    \\item 文献管理
\\end{itemize}

\\section{数学公式}
爱因斯坦质能方程：
\\begin{equation}
    E = mc^2
\\end{equation}

薛定谔方程：
\\begin{equation}
    i\\hbar\\frac{\\partial}{\\partial t}\\Psi = \\hat{H}\\Psi
\\end{equation}

\\section{结论}
开始你的科研创作之旅！

\\end{document}`;

export function LatexEditor() {
  const [content, setContent] = useState(defaultLatexContent);
  const [viewMode, setViewMode] = useState<"split" | "code" | "preview">("split");
  const [isCompiling, setIsCompiling] = useState(false);
  const [pdfData, setPdfData] = useState<string | null>(null);
  
  const editorRef = useRef<any>(null);
  const [isAIAssisting, setIsAIAssisting] = useState(false);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleAIAssist = async () => {
    if (!editorRef.current) return;
    
    const selection = editorRef.current.getSelection();
    const selectedText = editorRef.current.getModel().getValueInRange(selection);
    
    if (!selectedText.trim()) {
      toast.warning("请先在左侧编辑器中选中需要润色或扩写的文本段落");
      return;
    }

    setIsAIAssisting(true);
    const loadingToast = toast.loading("AI 正在思考中，请稍候...");

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "你是一个专业的学术论文编辑助手。请对用户提供的文本进行学术润色和优化，使其更符合学术规范，语言更流畅、专业。请直接返回修改后的文本，不要包含任何额外的解释或对话。如果文本中包含 LaTeX 标签，请务必保留。"
            },
            {
              role: "user",
              content: selectedText
            }
          ]
        })
      });

      const data = await res.json();
      if (data.choices && data.choices.length > 0) {
        const polishedText = data.choices[0].message.content.trim();
        
        // Replace the selected text in the editor
        editorRef.current.executeEdits("ai-assistant", [
          {
            range: selection,
            text: polishedText,
            forceMoveMarkers: true
          }
        ]);
        
        setContent(editorRef.current.getValue());
        toast.dismiss(loadingToast);
        toast.success("AI 润色完成，已自动替换！");
      } else {
        toast.dismiss(loadingToast);
        toast.error("AI 未能返回结果，可能触发了安全限制");
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("请求 AI 助手失败，请检查 API 配置或网络");
    } finally {
      setIsAIAssisting(false);
    }
  };

  const handleCompile = async () => {
    setIsCompiling(true);
    try {
      const res = await fetch("/api/latex/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tex: content, engine: "pdflatex" })
      });
      const data = await res.json();
      if (data.ok) {
        setPdfData(`data:application/pdf;base64,${data.pdfBase64}`);
        toast.success("编译成功！");
      } else {
        toast.error("编译失败");
        console.error(data.log);
      }
    } catch (err) {
      toast.error("请求失败");
    } finally {
      setIsCompiling(false);
    }
  };

  const handleSave = () => {
    toast.success("文档已保存");
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Select defaultValue="article">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="report">Report</SelectItem>
              <SelectItem value="book">Book</SelectItem>
              <SelectItem value="beamer">Beamer</SelectItem>
            </SelectContent>
          </Select>
          <div className="h-6 w-px bg-gray-300" />
          <Button variant="ghost" size="sm" onClick={handleSave}>
            <Save className="size-4 mr-2" />
            保存
          </Button>
          <Button variant="ghost" size="sm">
            <Upload className="size-4 mr-2" />
            导入
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="size-4 mr-2" />
            导出
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
            <TabsList>
              <TabsTrigger value="code" className="gap-2">
                <Code className="size-4" />
                代码
              </TabsTrigger>
              <TabsTrigger value="split" className="gap-2">
                <SplitSquareVertical className="size-4" />
                分屏
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2">
                <Eye className="size-4" />
                预览
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="h-6 w-px bg-gray-300" />
          <Button 
            variant="default" 
            size="sm"
            onClick={handleCompile}
            disabled={isCompiling}
          >
            <Play className="size-4 mr-2" />
            {isCompiling ? "编译中..." : "编译"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleAIAssist} disabled={isAIAssisting}>
            {isAIAssisting ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Wand2 className="size-4 mr-2 text-purple-600" />}
            {isAIAssisting ? "润色中..." : "AI 润色选中段落"}
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor */}
        {(viewMode === "code" || viewMode === "split") && (
          <div className={viewMode === "split" ? "w-1/2 border-r border-gray-200" : "w-full"}>
            <Editor
              height="100%"
              defaultLanguage="latex"
              value={content}
              onChange={(value) => setContent(value || "")}
              onMount={handleEditorDidMount}
              theme="vs-light"
              options={{
                fontSize: 14,
                minimap: { enabled: true },
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: "on",
              }}
            />
          </div>
        )}

        {/* Preview */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div className={viewMode === "split" ? "w-1/2 bg-white" : "w-full bg-white"}>
            <div className="h-full overflow-hidden">
              {pdfData ? (
                <iframe src={pdfData} className="w-full h-full border-none" title="PDF Preview" />
              ) : (
                <div className="h-full overflow-auto p-8">
                  <Card className="max-w-4xl mx-auto p-12 shadow-lg">
                    <div className="prose max-w-none">
                      <div className="text-center mb-8">
                        <h1 className="text-3xl font-serif mb-2">AI科研工具平台</h1>
                        <p className="text-gray-600">ResearchAI</p>
                        <p className="text-sm text-gray-500">March 2026</p>
                      </div>

                      <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-500">
                        <p className="text-sm text-blue-900">
                          <Eye className="size-4 inline mr-2" />
                          这是LaTeX文档的初始预览。点击“编译”按钮生成完整的PDF渲染。
                        </p>
                      </div>

                      <h2 className="text-2xl font-serif mb-4">引言</h2>
                      <p className="mb-6">
                        欢迎使用ResearchAI LaTeX编辑器。这是一个集成AI能力的现代化科研写作工具。
                      </p>

                      <h2 className="text-2xl font-serif mb-4">主要特性</h2>
                      <ul className="mb-6 space-y-2">
                        <li>实时预览</li>
                        <li>AI写作辅助</li>
                        <li>智能补全</li>
                        <li>文献管理</li>
                      </ul>

                      <h2 className="text-2xl font-serif mb-4">数学公式</h2>
                      <p className="mb-4">爱因斯坦质能方程：</p>
                      <div className="text-center my-6 text-xl font-serif">
                        <em>E</em> = <em>mc</em>²
                      </div>

                      <p className="mb-4">薛定谔方程：</p>
                      <div className="text-center my-6 text-xl font-serif">
                        <em>iℏ ∂Ψ/∂t = ĤΨ</em>
                      </div>

                      <h2 className="text-2xl font-serif mb-4">结论</h2>
                      <p>开始你的科研创作之旅！</p>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-gray-100 border-t border-gray-200 px-4 py-2 flex items-center justify-between text-xs text-gray-600">
        <div className="flex items-center gap-4">
          <span>行: 1, 列: 1</span>
          <span>UTF-8</span>
          <span>LaTeX</span>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-xs">
            {content.split(/\s+/).length} 词
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {content.length} 字符
          </Badge>
          <span className="text-green-600">● 已保存</span>
        </div>
      </div>
    </div>
  );
}
