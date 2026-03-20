import { useState, useEffect, useRef } from "react";
import mermaid from "mermaid";
import {
  BarChart3,
  LineChart,
  PieChart,
  ScatterChart,
  Download,
  Settings,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Loader2
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";

const chartTypes = [
  { name: "流程图 (Mermaid)", icon: BarChart3, value: "mermaid" },
];

export function FigureGenerator() {
  const [chartType, setChartType] = useState("mermaid");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [mermaidCode, setMermaidCode] = useState<string>(`graph TD
    A[输入描述] --> B(MiniMax AI)
    B --> C{生成Mermaid代码}
    C -->|成功| D[前端动态渲染图表]
    C -->|失败| E[返回错误提示]
  `);
  
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({ startOnLoad: true, theme: 'default' });
  }, []);

  useEffect(() => {
    if (mermaidRef.current && mermaidCode) {
      mermaidRef.current.removeAttribute('data-processed');
      mermaid.contentLoaded();
    }
  }, [mermaidCode]);

  const handleGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error("请输入图表描述");
      return;
    }
    
    setIsGenerating(true);
    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "你是一个科研图表生成助手。请根据用户的描述，直接输出Mermaid图表代码（不要使用 markdown 的 ```mermaid 包裹，直接输出代码本身）。不要包含任何解释性的文本，只输出Mermaid代码。"
            },
            {
              role: "user",
              content: aiPrompt
            }
          ],
          temperature: 0.1
        })
      });
      
      const data = await res.json();
      if (data.choices && data.choices.length > 0) {
        let code = data.choices[0].message.content;
        // 清理可能包含的 markdown 标记
        code = code.replace(/```mermaid\n?/g, '').replace(/```\n?/g, '').trim();
        setMermaidCode(code);
        toast.success("图表生成成功！");
      } else {
        toast.error("生成失败，AI 未返回有效代码或超出限流配额");
      }
    } catch (error) {
      toast.error("网络请求失败，请检查后端服务运行状态");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    toast.success("导出功能开发中...");
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            AI 科研图表生成
          </h1>
          <p className="text-gray-600">
            描述你的实验逻辑或架构，MiniMax 将为你动态绘制专业图表
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Control Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="size-5 text-purple-600" />
                  MiniMax AI 生成
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>描述你需要绘制的图表</Label>
                  <Textarea
                    placeholder="例如：画一个Transformer模型的架构流程图..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="mt-2 min-h-[120px]"
                  />
                </div>
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white" 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="size-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="size-4 mr-2" />
                  )}
                  {isGenerating ? "生成中..." : "一键生成图表"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">图表类型</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {chartTypes.map((type) => (
                  <Button
                    key={type.value}
                    variant={chartType === type.value ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setChartType(type.value)}
                  >
                    <type.icon className="size-4 mr-2" />
                    {type.name}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chart Preview */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="h-full min-h-[500px] flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>动态预览</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Settings className="size-4 mr-2" />
                      编辑代码
                    </Button>
                    <Button size="sm" onClick={handleDownload}>
                      <Download className="size-4 mr-2" />
                      导出 SVG
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center bg-gray-50/50 rounded-b-xl border-t overflow-auto">
                <div className="w-full h-full flex items-center justify-center p-4">
                  {mermaidCode ? (
                    <div 
                      key={mermaidCode}
                      ref={mermaidRef} 
                      className="mermaid flex justify-center"
                    >
                      {mermaidCode}
                    </div>
                  ) : (
                    <div className="text-gray-400">在此处预览生成的图表</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
