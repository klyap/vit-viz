import { LinkedHeatmaps } from "./components/LinkedHeatmaps";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const pages = import.meta.glob("./pages/**/*.tsx", { eager: true });

const routes = [];
for (const path of Object.keys(pages)) {
  const fileName = path.match(/\.\/pages\/(.*)\.tsx$/)?.[1];
  if (!fileName) {
    continue;
  }

  const normalizedPathName = fileName.includes("$")
    ? fileName.replace("$", ":")
    : fileName.replace(/\/index/, "");

  routes.push({
    Element: pages[path].default,
    ErrorBoundary: pages[path]?.ErrorBoundary,
    action: pages[path]?.action,
    loader: pages[path]?.loader,
    path: fileName === "index" ? "/" : `/${normalizedPathName.toLowerCase()}`,
  });
}

const router = createBrowserRouter(
  routes.map(({ Element, ErrorBoundary, ...rest }) => ({
    ...rest,
    element: <Element />,
    ...(ErrorBoundary && { errorElement: <ErrorBoundary /> }),
  }))
);



export default function App() {
  // return (
  //   <div className="mx-auto my-8 mt-10">
  //     <LinkedHeatmaps />
  //   </div>
  // );
  return <RouterProvider router={router} />;

}
