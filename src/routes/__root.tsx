import {
  Outlet,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

import TanStackQueryLayout from "@/integrations/tanstack-query/layout.tsx";

import appCss from "@/styles.css?url";

import type { QueryClient } from "@tanstack/react-query";
import { Toaster } from "sonner";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "LearnMate Admin Dashboard",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  component: () => (
    <RootDocument>
      <RootLayout>
        <Outlet />
      </RootLayout>
      <TanStackRouterDevtools />
      <TanStackQueryLayout />
    </RootDocument>
  ),
});

function RootLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  // Routes that should show the sidebar and header
  const sidebarRoutes = ["/dashboard", "/semester"];

  const shouldShowSidebar = () =>
    sidebarRoutes.some((prefix) => location.pathname.startsWith(prefix));

  const showSidebar = shouldShowSidebar();

  if (!showSidebar) {
    // For auth pages, home page, and other non-dashboard pages, render without sidebar/header
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main content area */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        }`}
      >
        {/* Top padding for mobile menu button */}
        <div className="lg:hidden h-16" />

        {/* Header */}
        <Header />

        {/* Main content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster richColors position="top-right" />
        <Scripts />
      </body>
    </html>
  );
}
