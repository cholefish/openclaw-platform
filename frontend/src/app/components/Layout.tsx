import { Outlet, Link, useLocation } from "react-router";
import { 
  Home, 
  FileText, 
  Search, 
  Bot, 
  ImageIcon, 
  FolderOpen,
  Menu,
  X,
  FlaskConical
} from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { cn } from "./ui/utils";

const navigation = [
  { name: "仪表板", path: "/", icon: Home },
  { name: "LaTeX 编辑器", path: "/editor", icon: FileText },
  { name: "文献检索", path: "/search", icon: Search },
  { name: "AI 写作助手", path: "/assistant", icon: Bot },
  { name: "图表生成", path: "/figures", icon: ImageIcon },
  { name: "我的项目", path: "/projects", icon: FolderOpen },
];

export function Layout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <FlaskConical className="size-6 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">ResearchAI</h1>
                <p className="text-xs text-gray-500">科研工具平台</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="size-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path !== "/" && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <item.icon className="size-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">OpenClaw 黑客松</p>
              <p className="text-xs text-gray-500">AI科研工具赛道</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
            <div className="flex-1 lg:flex-none" />
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Search className="size-4 mr-2" />
                快速搜索
              </Button>
              <div className="size-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-sm">
                AI
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
