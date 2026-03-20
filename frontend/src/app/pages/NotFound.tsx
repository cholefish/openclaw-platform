import { Link } from "react-router";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";

export function NotFound() {
  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          页面未找到
        </h2>
        <p className="text-gray-600 mb-8">
          抱歉，您访问的页面不存在
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" asChild>
            <Link to="/">
              <ArrowLeft className="size-4 mr-2" />
              返回上一页
            </Link>
          </Button>
          <Button asChild>
            <Link to="/">
              <Home className="size-4 mr-2" />
              回到首页
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
