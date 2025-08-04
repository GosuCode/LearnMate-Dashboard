import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  HelpCircle,
  Settings,
  BarChart3,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview and analytics",
  },
  {
    title: "Semester",
    href: "/semester",
    icon: LayoutDashboard,
    description: "",
  },
  {
    title: "Subject",
    href: "/subject",
    icon: BookOpen,
    description: "Manage subjects",
  },
  {
    title: "Content",
    href: "/content",
    icon: LayoutDashboard,
    description: "",
  },
  {
    title: "Course",
    href: "/course",
    icon: LayoutDashboard,
    description: "Create and manage courses",
  },
  {
    title: "Content",
    href: "/content",
    icon: BookOpen,
    description: "Create and manage content",
  },
  {
    title: "AI Generation",
    href: "/content/ai",
    icon: Sparkles,
    description: "Generate AI content",
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: Users,
    description: "Manage user accounts",
  },
  {
    title: "Summaries",
    href: "/dashboard/summaries",
    icon: FileText,
    description: "Generated summaries",
  },
  {
    title: "Quizzes",
    href: "/dashboard/quizzes",
    icon: HelpCircle,
    description: "AI-generated quizzes",
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
    description: "Usage statistics",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "App configuration",
  },
];

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleMobile}
          className="h-8 w-8"
        >
          {isMobileOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={toggleMobile}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-full bg-white border-r transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="text-2xl">📚</div>
                <span className="font-semibold text-lg">LearnMate</span>
              </div>
            )}
            {isCollapsed && (
              <div className="flex justify-center w-full">
                <div className="text-2xl">📚</div>
              </div>
            )}

            {/* Desktop toggle button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="hidden lg:flex h-8 w-8"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100",
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-700 hover:text-gray-900"
                  )}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <div className="flex-1">
                      <div>{item.title}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {item.description}
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t p-4">
            {!isCollapsed && (
              <div className="text-xs text-gray-500">LearnMate Admin v1.0</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
