export type Route =
  | { name: "boot" }
  | { name: "professional"; page: string; id?: string };

export function parsePath(pathname: string): Route {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/") return { name: "boot" };
  if (path === "/professional") return { name: "professional", page: "home" };
  const pro = path.match(/^\/professional\/(about|projects|cv|blog)(?:\/([^/]+))?$/);
  if (pro) return { name: "professional", page: pro[1], id: pro[2] };
  return { name: "boot" };
}

export function navigate(path: string): void {
  if (location.pathname === path) {
    window.dispatchEvent(new PopStateEvent("popstate"));
    return;
  }
  history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}
