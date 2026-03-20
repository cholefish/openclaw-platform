import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { LatexEditor } from "./pages/LatexEditor";
import { PaperSearch } from "./pages/PaperSearch";
import { AIAssistant } from "./pages/AIAssistant";
import { FigureGenerator } from "./pages/FigureGenerator";
import { Projects } from "./pages/Projects";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "editor", Component: LatexEditor },
      { path: "editor/:projectId", Component: LatexEditor },
      { path: "search", Component: PaperSearch },
      { path: "assistant", Component: AIAssistant },
      { path: "figures", Component: FigureGenerator },
      { path: "projects", Component: Projects },
      { path: "*", Component: NotFound },
    ],
  },
]);
