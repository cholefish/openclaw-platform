import { Link } from "react-router";
import { 
  FileText, 
  Search, 
  Bot, 
  ImageIcon, 
  TrendingUp,
  Clock,
  Star,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

const features = [
  {
    title: "LaTeX 编辑器",
    description: "专业的LaTeX编辑环境，实时预览，智能补全",
    icon: FileText,
    path: "/editor",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "文献检索",
    description: "快速检索arXiv、PubMed等学术数据库",
    icon: Search,
    path: "/search",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "AI 写作助手",
    description: "智能生成、润色和优化学术论文",
    icon: Bot,
    path: "/assistant",
    gradient: "from-orange-500 to-red-500",
  },
  {
    title: "图表生成",
    description: "自动生成高质量的科研图表和可视化",
    icon: ImageIcon,
    path: "/figures",
    gradient: "from-green-500 to-emerald-500",
  },
];

const recentProjects = [
  { name: "量子计算论文初稿", updated: "2小时前", progress: 75 },
  { name: "机器学习综述", updated: "1天前", progress: 45 },
  { name: "深度学习研究", updated: "3天前", progress: 90 },
];

const stats = [
  { label: "项目总数", value: "12", icon: FileText, change: "+3" },
  { label: "文献收藏", value: "156", icon: Star, change: "+24" },
  { label: "AI生成字数", value: "45.2k", icon: Sparkles, change: "+12k" },
  { label: "使用时长", value: "128h", icon: Clock, change: "+16h" },
];

export function Dashboard() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          欢迎回来！
        </h1>
        <p className="text-gray-600">
          开始你的AI科研之旅，让创作更高效
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="size-5 text-gray-500" />
                <Badge variant="secondary" className="text-xs">
                  {stat.change}
                </Badge>
              </div>
              <div className="text-2xl font-semibold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">
                {stat.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          核心功能
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <Link key={feature.path} to={feature.path}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className={`size-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="size-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" size="sm" className="w-full justify-between">
                    开始使用
                    <ArrowRight className="size-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>最近项目</CardTitle>
              <CardDescription>继续你的研究工作</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentProjects.map((project, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="size-5 text-gray-500" />
                      <h3 className="font-medium text-gray-900">{project.name}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="size-4" />
                        {project.updated}
                      </span>
                      <div className="flex items-center gap-2 flex-1">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-xs">{project.progress}%</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              ))}
              <Link to="/projects">
                <Button variant="outline" className="w-full">
                  查看所有项目
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Tips */}
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5" />
              使用技巧
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <h4 className="font-medium text-sm mb-1">AI助手快捷键</h4>
              <p className="text-xs text-gray-600">使用 Ctrl+K 快速唤起AI写作助手</p>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <h4 className="font-medium text-sm mb-1">文献管理</h4>
              <p className="text-xs text-gray-600">在编辑器中直接插入引用文献</p>
            </div>
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <h4 className="font-medium text-sm mb-1">实时协作</h4>
              <p className="text-xs text-gray-600">分享项目链接与团队成员协作</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
