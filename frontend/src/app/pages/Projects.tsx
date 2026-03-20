import { 
  Plus, 
  Search, 
  MoreVertical, 
  FileText, 
  Clock,
  Trash2,
  Edit,
  Share2,
  Download,
  Folder
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { toast } from "sonner";
import { Link } from "react-router";

const projects = [
  {
    id: 1,
    name: "量子计算论文初稿",
    description: "关于量子纠缠在分布式计算中的应用研究",
    lastModified: "2小时前",
    progress: 75,
    type: "article",
    wordCount: 8450,
  },
  {
    id: 2,
    name: "机器学习综述",
    description: "深度学习在计算机视觉领域的最新进展",
    lastModified: "1天前",
    progress: 45,
    type: "review",
    wordCount: 12340,
  },
  {
    id: 3,
    name: "实验数据分析",
    description: "神经网络性能对比实验报告",
    lastModified: "3天前",
    progress: 90,
    type: "report",
    wordCount: 5230,
  },
  {
    id: 4,
    name: "会议演示稿",
    description: "ICML 2026 会议演示内容准备",
    lastModified: "1周前",
    progress: 60,
    type: "presentation",
    wordCount: 3200,
  },
];

export function Projects() {
  const handleDelete = (id: number, name: string) => {
    toast.success(`已删除项目：${name}`);
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              我的项目
            </h1>
            <p className="text-gray-600">
              管理你的所有研究项目和文档
            </p>
          </div>
          <Button>
            <Plus className="size-4 mr-2" />
            新建项目
          </Button>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <Input
                  placeholder="搜索项目..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Folder className="size-4 mr-2" />
                全部项目
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-semibold text-gray-900 mb-1">12</div>
              <div className="text-sm text-gray-600">总项目数</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-semibold text-gray-900 mb-1">4</div>
              <div className="text-sm text-gray-600">进行中</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-semibold text-gray-900 mb-1">7</div>
              <div className="text-sm text-gray-600">已完成</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-semibold text-gray-900 mb-1">1</div>
              <div className="text-sm text-gray-600">已发布</div>
            </CardContent>
          </Card>
        </div>

        {/* Project List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">
                      {project.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="size-4 mr-2" />
                        重命名
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="size-4 mr-2" />
                        分享
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="size-4 mr-2" />
                        导出
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(project.id, project.name)}
                      >
                        <Trash2 className="size-4 mr-2" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Badge variant="secondary">{project.type}</Badge>
                  <span className="flex items-center gap-1">
                    <FileText className="size-4" />
                    {project.wordCount.toLocaleString()} 字
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>完成进度</span>
                    <span className="font-semibold">{project.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="size-3" />
                    {project.lastModified}
                  </span>
                  <Link to={`/editor/${project.id}`}>
                    <Button variant="outline" size="sm">
                      打开
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* New Project Card */}
          <Card className="border-dashed border-2 hover:border-blue-500 hover:bg-blue-50/50 transition-colors cursor-pointer">
            <CardContent className="h-full flex flex-col items-center justify-center py-12 text-center">
              <div className="size-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Plus className="size-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">创建新项目</h3>
              <p className="text-sm text-gray-600">
                开始新的研究项目
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
