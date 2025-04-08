
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Users,
  LayoutDashboard,
  Calendar,
  Menu,
  FileText,
} from "lucide-react";

interface NavItem {
  title: string;
  icon: React.ElementType;
  path: string;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    title: "Jobs",
    icon: Briefcase,
    path: "/jobs",
  },
  {
    title: "Candidates",
    icon: Users,
    path: "/candidates",
  },
  {
    title: "Interviews",
    icon: Calendar,
    path: "/interviews",
  },
  {
    title: "Feedback",
    icon: FileText,
    path: "/feedback",
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div
      className={cn(
        "bg-sidebar text-sidebar-foreground flex flex-col h-screen transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="text-xl font-bold text-sidebar-foreground flex items-center">
            <span className="text-primary mr-1">Hire</span>Track
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent ml-auto"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.title}>
              <Link to={item.path}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    collapsed ? "px-2" : "px-4",
                    location.pathname === item.path
                      ? "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/90"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <item.icon
                    className={cn("h-5 w-5", collapsed ? "mr-0" : "mr-2")}
                  />
                  {!collapsed && <span>{item.title}</span>}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        {!collapsed && (
          <div className="text-xs text-sidebar-foreground/70">
            HireTrack ATS v1.0
          </div>
        )}
      </div>
    </div>
  );
}
