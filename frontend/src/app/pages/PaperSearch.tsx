import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  Star, 
  ExternalLink,
  Calendar,
  User,
  FileText,
  TrendingUp,
  BookOpen
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";

const mockPapers = [
  {
    id: "mock-1",
    title: "Attention Is All You Need",
    authors: "Vaswani et al.",
    abstract: "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...",
    year: 2017,
    citations: 85423,
    source: "arXiv",
    category: "cs.CL",
    url: "https://arxiv.org/abs/1706.03762",
  },
  {
    id: "mock-2",
    title: "BERT: Pre-training of Deep Bidirectional Transformers",
    authors: "Devlin et al.",
    abstract: "We introduce a new language representation model called BERT, which stands for Bidirectional Encoder...",
    year: 2018,
    citations: 72156,
    source: "arXiv",
    category: "cs.CL",
    url: "https://arxiv.org/abs/1810.04805",
  },
  {
    id: "mock-3",
    title: "Generative Adversarial Networks",
    authors: "Goodfellow et al.",
    abstract: "We propose a new framework for estimating generative models via an adversarial process...",
    year: 2014,
    citations: 64328,
    source: "arXiv",
    category: "cs.LG",
    url: "https://arxiv.org/abs/1406.2661",
  },
];

const trendingTopics = [
  { name: "Large Language Models", count: 1245 },
  { name: "Diffusion Models", count: 892 },
  { name: "Reinforcement Learning", count: 756 },
  { name: "Graph Neural Networks", count: 634 },
];

export function PaperSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [savedPapers, setSavedPapers] = useState<string[]>([]);
  const [savedPapersList, setSavedPapersList] = useState<any[]>([]);
  const [papers, setPapers] = useState<any[]>(mockPapers);
  const [isSearching, setIsSearching] = useState(false);
  const [source, setSource] = useState("arxiv");
  const [analysisById, setAnalysisById] = useState<Record<string, string>>({});
  const [analyzingPaperId, setAnalyzingPaperId] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch("/api/papers/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: searchQuery, limit: 10, source })
      });
      const data = await res.json();
      if (data.items) {
        setPapers(data.items.map((item: any, i: number) => ({
          id: String(item.id || item.doi || `${data.source}-${i}`),
          title: item.title,
          authors: Array.isArray(item.authors) ? item.authors.join(", ") : item.authors,
          abstract: item.summary || item.title,
          year: item.published ? item.published.substring(0, 4) : "",
          citations: 0,
          source: data.source,
          category: "General",
          url: item.pdfUrl || item.url || "#",
        })));
      }
    } catch (err) {
      toast.error("搜索失败，请检查网络连接或后端服务状态");
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchSavedPapers();
  }, []);

  const fetchSavedPapers = async () => {
    try {
      const res = await fetch("/api/papers/saved");
      const data = await res.json();
      if (data.items) {
        setSavedPapersList(data.items);
        setSavedPapers(data.items.map((p: any) => p.id));
      }
    } catch (err) {
      console.error("Failed to fetch saved papers", err);
    }
  };

  const handleSave = async (paper: any) => {
    const paperId = String(paper.id);
    const isSaved = savedPapers.includes(paperId);
    
    if (isSaved) {
      toast.info("已在收藏列表中");
      return;
    }

    try {
      const res = await fetch("/api/papers/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paper)
      });
      const data = await res.json();
      if (data.ok) {
        setSavedPapers([...savedPapers, paperId]);
        fetchSavedPapers();
        toast.success("已添加到收藏");
      }
    } catch (err) {
      toast.error("收藏失败");
    }
  };

  const handleAnalyze = async (paper: any) => {
    const paperId = String(paper.id);
    if (analysisById[paperId]) return;
    setAnalyzingPaperId(paperId);
    try {
      const res = await fetch("/api/papers/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: paper.title, abstract: paper.abstract }),
      });
      const data = await res.json();
      if (data.ok && data.analysis) {
        setAnalysisById((prev) => ({ ...prev, [paperId]: data.analysis }));
        toast.success("AI 解读完成");
      } else {
        toast.error("解读失败");
      }
    } catch (err) {
      toast.error("解读失败");
    } finally {
      setAnalyzingPaperId(null);
    }
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            文献检索
          </h1>
          <p className="text-gray-600">
            搜索全球学术数据库，快速找到相关研究
          </p>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <Input
                  placeholder="搜索论文标题、作者、关键词..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="arxiv">arXiv</SelectItem>
                  <SelectItem value="crossref">CrossRef</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSearch} disabled={isSearching}>
                <Search className="size-4 mr-2" />
                {isSearching ? "搜索中..." : "搜索"}
              </Button>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <Button variant="outline" size="sm">
                <Filter className="size-4 mr-2" />
                筛选
              </Button>
              <Badge variant="secondary">cs.CL</Badge>
              <Badge variant="secondary">2020-2026</Badge>
              <Badge variant="secondary">被引 &gt; 100</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Results */}
          <div className="lg:col-span-3 space-y-4">
            <Tabs defaultValue="all">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="all">全部结果</TabsTrigger>
                  <TabsTrigger value="saved">我的收藏</TabsTrigger>
                  <TabsTrigger value="recent">最近查看</TabsTrigger>
                </TabsList>
                <Select defaultValue="relevance">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">相关性</SelectItem>
                    <SelectItem value="date">发布日期</SelectItem>
                    <SelectItem value="citations">引用次数</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <TabsContent value="all" className="space-y-4">
                {papers.map((paper) => (
                  <Card key={paper.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {paper.title}
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSave(paper)}
                            >
                              <Star
                                className={`size-5 ${
                                  savedPapers.includes(paper.id)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-400"
                                }`}
                              />
                            </Button>
                          </div>

                          <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <User className="size-4" />
                              {paper.authors}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="size-4" />
                              {paper.year}
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="size-4" />
                              {paper.citations.toLocaleString()} 引用
                            </span>
                          </div>

                          <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                            {paper.abstract}
                          </p>

                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline">{paper.source}</Badge>
                            <Badge variant="secondary">{paper.category}</Badge>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <a href={paper.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="size-4 mr-2" />
                                查看原文
                              </a>
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="size-4 mr-2" />
                              下载PDF
                            </Button>
                            <Button variant="outline" size="sm">
                              引用
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAnalyze(paper)}
                              disabled={analyzingPaperId === String(paper.id)}
                            >
                              {analyzingPaperId === String(paper.id) ? "解读中..." : "AI解读"}
                            </Button>
                          </div>
                          {analysisById[String(paper.id)] && (
                            <div className="mt-4 p-3 rounded-lg bg-purple-50 border border-purple-100">
                              <div className="text-xs text-purple-700 mb-1">AI 解读</div>
                              <p className="text-sm text-gray-800 whitespace-pre-wrap">{analysisById[String(paper.id)]}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="saved" className="space-y-4">
                {savedPapersList.length > 0 ? (
                  savedPapersList.map((paper) => (
                    <Card key={paper.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {paper.title}
                              </h3>
                              <Star className="size-5 fill-yellow-400 text-yellow-400" />
                            </div>

                            <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                              <span className="flex items-center gap-1">
                                <User className="size-4" />
                                {paper.authors}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="size-4" />
                                {paper.year}
                              </span>
                            </div>

                            <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                              {paper.abstract}
                            </p>

                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant="outline">{paper.source}</Badge>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <a href={paper.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="size-4 mr-2" />
                                  查看原文
                                </a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <BookOpen className="size-12 mx-auto mb-4 text-gray-400" />
                    <p>还没有收藏的论文</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="recent">
                <div className="text-center py-12 text-gray-500">
                  <FileText className="size-12 mx-auto mb-4 text-gray-400" />
                  <p>暂无浏览历史</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="size-5" />
                  热门话题
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <span className="text-sm text-gray-700">{topic.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {topic.count}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">统计信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">搜索结果</span>
                  <span className="font-semibold">2,456</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">今日新增</span>
                  <span className="font-semibold">124</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">收藏总数</span>
                  <span className="font-semibold">{savedPapers.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
