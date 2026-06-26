import {
  createBrowserHistory,
  createRouter,
  type ErrorComponentProps,
  RouterProvider,
} from "@tanstack/react-router";
import {
  TanStackQueryContext,
  TanStackQueryProvider,
} from "@workspace/ui/integrations/tanstack-query";
import { StrictMode, useEffect } from "react";
import ReactDOM from "react-dom/client";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
// Styles
import "@workspace/ui/globals.css";
import { DirectionProvider } from "@workspace/ui/integrations/direction";
import { LanguageProvider } from "@workspace/ui/integrations/language";
import { ThemeProvider } from "@workspace/ui/integrations/theme";
import { initializeI18n } from "@workspace/ui/lib/i18n";
import { fallbackLng, supportedLngs } from "./config/index.ts";
// Report web vitals
import reportWebVitals from "./reportWebVitals.ts";
// Common utilities
import { Logout } from "./utils/common.ts";

const i18n = initializeI18n({
  supportedLngs,
  fallbackLng,
  ns: [
    "ads",
    "announcement",
    "auth-control",
    "auth",
    "components",
    "coupon",
    "dashboard",
    "document",
    "group",
    "log",
    "marketing",
    "menu",
    "nodes",
    "order",
    "payment",
    "product",
    "redemption",
    "servers",
    "subscribe",
    "system",
    "ticket",
    "tool",
    "translation",
    "user",
  ],
});

window.logout = Logout;

// Create a new router instance
const TanStackQueryProviderContext = TanStackQueryContext();
const browserHistory = createBrowserHistory();

function isChunkLoadError(error: unknown) {
  const name = error instanceof Error ? error.name : "";
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "";
  const details = `${name} ${message}`;

  return [
    "Failed to fetch dynamically imported module",
    "Importing a module script failed",
    "error loading dynamically imported module",
    "Loading chunk",
    "ChunkLoadError",
  ].some((pattern) => details.includes(pattern));
}

function RouteErrorFallback({ error }: ErrorComponentProps) {
  const isChunkError = isChunkLoadError(error);
  const reloadKey = "npanel-admin-chunk-reload";
  const lastReloadAt = Number(sessionStorage.getItem(reloadKey) || 0);
  const canReload = isChunkError && Date.now() - lastReloadAt > 30_000;

  useEffect(() => {
    if (canReload) {
      sessionStorage.setItem(reloadKey, String(Date.now()));
      window.location.reload();
    }
  }, [canReload]);

  if (isChunkError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-semibold text-2xl">Application updated</h1>
        <p className="max-w-md text-muted-foreground">
          The admin panel resources were refreshed. Please reload this page.
        </p>
        <button
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
          onClick={() => window.location.reload()}
          type="button"
        >
          Reload
        </button>
      </div>
    );
  }

  const message = error instanceof Error ? error.message : String(error);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-semibold text-2xl">Something went wrong</h1>
      <pre className="max-w-full overflow-auto rounded-md border px-4 py-3 text-left text-destructive text-sm">
        {message}
      </pre>
    </div>
  );
}

const router = createRouter({
  routeTree,
  history: browserHistory,
  context: {
    ...TanStackQueryProviderContext,
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  defaultErrorComponent: RouteErrorFallback,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("app");

function renderApp() {
  if (rootElement && !rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <StrictMode>
        <TanStackQueryProvider {...TanStackQueryProviderContext}>
          <LanguageProvider supportedLanguages={supportedLngs}>
            <ThemeProvider>
              <DirectionProvider>
                <RouterProvider router={router} />
              </DirectionProvider>
            </ThemeProvider>
          </LanguageProvider>
        </TanStackQueryProvider>
      </StrictMode>
    );
  }
}

// 等待 i18n 初始化完成后再渲染，避免强刷时翻译未就绪导致首屏先闪一下 fallback（英文）。
// 加 3s 超时兜底：即便 locale 资源加载异常，也保证界面能渲染出来。
function startApp() {
  Promise.race([
    Promise.resolve(i18n.readyPromise),
    new Promise((resolve) => setTimeout(resolve, 3000)),
  ])
    .catch((error) => {
      console.error("i18n initialization failed:", error);
    })
    .finally(renderApp);
}

if (i18n.isInitialized) {
  renderApp();
} else {
  startApp();
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
