import { useState, useEffect } from "react";
import { 
  Send, 
  Sparkles, 
  FileText, 
  Wand2, 
  MessageSquare,
  Clock,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ScrollArea } from "../components/ui/scroll-area";
import { toast } from "sonner";

const promptTemplates = [
  {
    category: "写作",
    items: [
      { title: "生成摘要", prompt: "请为我的论文生成一个学术摘要，内容关于..." },
      { title: "改写润色", prompt: "请帮我润色以下段落，使其更加学术化..." },
      { title: "扩写内容", prompt: "请帮我扩写以下要点..." },
    ],
  },
  {
    category: "研究",
    items: [
      { title: "文献综述", prompt: "请帮我生成关于...的文献综述框架" },
      { title: "研究问题", prompt: "基于...领域，帮我提出几个有价值的研究问题" },
      { title: "实验设计", prompt: "请帮我设计一个关于...的实验方案" },
    ],
  },
];

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "你好！我是ResearchAI助手。我可以帮助你进行论文写作、文献综述、实验设计等科研工作。有什么我可以帮助你的吗？",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/agent/history");
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        setMessages(data.items.map((item: any) => ({
          role: item.role,
          content: item.content,
          timestamp: new Date(item.created_at)
        })));
      }
    } catch (err) {
      console.error("Failed to fetch chat history", err);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      if (data.choices && data.choices.length > 0) {
        const aiMessage: Message = {
          role: "assistant",
          content: data.choices[0].message.content,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        toast.error("AI未能返回结果");
      }
    } catch (err) {
      toast.error("请求失败，请检查配置");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("已复制到剪贴板");
  };

  const useTemplate = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="h-full overflow-hidden">
      <div className="h-full grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 lg:p-8">
        {/* Main Chat Area */}
        <div className="lg:col-span-3 flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="size-5 text-purple-600" />
                  AI 写作助手
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">GPT-4</Badge>
                  <Button variant="outline" size="sm">
                    <RotateCcw className="size-4 mr-2" />
                    新对话
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6 max-w-3xl mx-auto">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-4 ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`size-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === "user"
                          ? "bg-blue-100"
                          : "bg-gradient-to-br from-purple-500 to-pink-500"
                      }`}
                    >
                      {message.role === "user" ? (
                        <span className="text-blue-700 text-sm font-semibold">You</span>
                      ) : (
                        <Sparkles className="size-5 text-white" />
                      )}
                    </div>

                    <div
                      className={`flex-1 ${
                        message.role === "user" ? "text-right" : ""
                      }`}
                    >
                      <div
                        className={`inline-block max-w-2xl rounded-2xl p-4 ${
                          message.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>

                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <Clock className="size-3" />
                        {message.timestamp.toLocaleTimeString("zh-CN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {message.role === "assistant" && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2"
                              onClick={() => handleCopy(message.content)}
                            >
                              <Copy className="size-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 px-2">
                              <ThumbsUp className="size-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 px-2">
                              <ThumbsDown className="size-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-4">
                    <div className="size-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Sparkles className="size-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="inline-block bg-gray-100 rounded-2xl p-4">
                        <div className="flex gap-2">
                          <div className="size-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="size-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                          <div className="size-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex gap-3">
                <Textarea
                  placeholder="输入你的问题或写作需求..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="min-h-[60px] max-h-[200px] resize-none"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="px-6"
                >
                  <Send className="size-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                按 Enter 发送，Shift + Enter 换行
              </p>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Prompt Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Wand2 className="size-5" />
                提示词模板
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={promptTemplates[0].category}>
                <TabsList className="w-full">
                  {promptTemplates.map((category) => (
                    <TabsTrigger
                      key={category.category}
                      value={category.category}
                      className="flex-1"
                    >
                      {category.category}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {promptTemplates.map((category) => (
                  <TabsContent
                    key={category.category}
                    value={category.category}
                    className="space-y-2 mt-4"
                  >
                    {category.items.map((item, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start text-left h-auto py-3"
                        onClick={() => useTemplate(item.prompt)}
                      >
                        <div>
                          <div className="font-medium text-sm">{item.title}</div>
                          <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {item.prompt}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Usage Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">使用统计</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">今日对话</span>
                <span className="font-semibold">8</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">生成字数</span>
                <span className="font-semibold">12.5k</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">剩余额度</span>
                <span className="font-semibold text-green-600">85%</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">快捷操作</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <FileText className="size-4 mr-2" />
                从文档导入
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <MessageSquare className="size-4 mr-2" />
                对话历史
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
