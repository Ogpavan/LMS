import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  BookOpen,
  Video,
  ClipboardList,
  FileText,
  BarChart,
  MessageSquare,
  Settings,
  User,
  KeyRound,
  SlidersHorizontal,
  LogOut,
  Calendar,
  Sun,
  Moon,
  Power,
} from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Replace the icons object with Lucide components
const icons = {
  Home,
  BookOpen,
  Video,
  ClipboardList,
  FileText,
  BarChart,
  MessageSquare,
  Settings,
  User,
  KeyRound,
  SlidersHorizontal,
  LogOut,
  Calendar,
};

const sidebarMenuItems = [
  { label: "Dashboard", icon: "Home", href: "/dashboard" },
  { label: "Courses", icon: "BookOpen", href: "/courses" },
  { label: "Manage Course", icon: "Calendar", href: "/managecourses" },

  { label: "Instructors", icon: "User", href: "/instructors" },
  { label: "Live Classes", icon: "Video", href: "/live" },
  { label: "Assignments", icon: "ClipboardList", href: "/assignments" },
  { label: "Exams", icon: "FileText", href: "/exams" },
  // { label: "Grades", icon: "BarChart", href: "/grades" },
];

const sidebarFooterItems = [
  { label: "My Profile", icon: "User", href: "/profile" },
];

const themes = [
  { name: "Light", value: "light" },
  { name: "Dark", value: "dark" },
  { name: "System", value: "system" },
];

export default function SidebarNav() {
  const [collapsed, setCollapsed] = useState(true);
  const [theme, setTheme] = useState("light");
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false); // Add this state
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState({ username: "", role: "" });

  useEffect(() => {
    // Read user info from cookie
    const cookieStr = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user="));
    if (cookieStr) {
      try {
        const userObj = JSON.parse(decodeURIComponent(cookieStr.split("=")[1]));
        setUser(userObj);
      } catch {}
    }
  }, []);

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true); // Show loading
    await fetch("/api/auth/logout", { method: "POST" });
    setLogoutLoading(false);
    router.push("/signin");
  };

  return (
    <div className="fixed top-0 left-0 w-0 h-screen z-40 flex items-center ml-3 bg-white transition-all duration-300 ease-in-out ">
      <div
        className="group"
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
      >
        <div
          className={`bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 flex flex-col transition-all duration-500 ease-out overflow-y-hidden overflow-x-hidden hide-scrollbar ${
            collapsed ? "w-16" : "w-64"
          }`}
          style={{ maxHeight: "90vh" }}
        >
          {/* Header */}
          <div
            className={`flex flex-col  items-start gap-3 border-b border-gray-100 p-4 transition-all duration-300 ${
              collapsed ? "items-center p-3" : ""
            }`}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl  p-1 shadow-lg">
                <span className="text-white text-lg font-bold">🍎</span>
              </div>
              <div
                className={`flex flex-col overflow-hidden transition-all duration-500 ease-out ${
                  collapsed
                    ? "w-0 opacity-0 translate-x-2"
                    : "w-auto opacity-100 translate-x-0"
                }`}
              >
                <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  {user?.role ? user.role : "Role"}
                </div>
                <div className="font-semibold text-gray-900 text-sm text-nowrap">
                  {/* Show Clerk user name if available */}@
                  {user
                    ? user.fullName ||
                      user.username ||
                      user.primaryEmailAddress?.emailAddress ||
                      user.primaryPhoneNumber?.phoneNumber
                    : "User"}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 py-4 dark:text-white">
            <div className="space-y-1">
              {sidebarMenuItems.map(({ label, icon, href }) => {
                const IconComponent = icons[icon];
                const isActive = pathname === href;
                return (
                  <div
                    key={label}
                    className="px-3 text-nowrap font-normal tracking-tight "
                  >
                    <a
                      href={href}
                      className={`flex items-center py-2.5 rounded-xl transition-all duration-300 group ${
                        collapsed ? "justify-center px-2" : "px-3"
                      } ${
                        isActive
                          ? "bg-blue-50 text-blue-700 font-semibold "
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <span
                        className={`flex-shrink-0 transition-colors duration-300 ${
                          isActive
                            ? "text-blue-500"
                            : "text-gray-500 group-hover:text-blue-500"
                        }`}
                      >
                        <IconComponent size={20} />
                      </span>
                      <span
                        className={`overflow-hidden transition-all duration-500 ease-out text-sm font-medium ${
                          collapsed
                            ? "w-0 opacity-0 translate-x-2"
                            : "w-auto opacity-100    ml-3"
                        }`}
                      >
                        {label}
                      </span>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100  ">
            <div className="space-y-1">
              {sidebarFooterItems.map(({ label, icon, href }) => {
                const IconComponent = icons[icon];
                return (
                  <div key={label} className="px-3 text-nowrap">
                    <a
                      href={href}
                      className={`flex items-center py-2 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-300 group ${
                        collapsed ? "justify-center px-2" : "px-3"
                      }`}
                    >
                      <span
                        className={`flex-shrink-0 transition-colors duration-300`}
                      >
                        <IconComponent size={20} />
                      </span>
                      <span
                        className={`overflow-hidden transition-all duration-500 ease-out text-sm font-medium ${
                          collapsed
                            ? "w-0 opacity-0 translate-x-2"
                            : "w-auto opacity-100    ml-3"
                        }`}
                      >
                        {label}
                      </span>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Theme Toggle & Logout Buttons at bottom */}
          <div className="px-3 mt-auto flex flex-col mb-3  items-center w-full">
            <button
              onClick={handleThemeToggle}
              className={`flex items-center w-full py-2 rounded-xl transition-all duration-300 group ${
                collapsed ? "justify-center px-2" : "px-3"
              } ${
                theme === "dark"
                  ? "bg-gray-800 text-white hover:bg-gray-700"
                  : "text-gray-800 hover:bg-gray-200"
              }`}
              style={{ minWidth: collapsed ? "40px" : "auto" }}
            >
              <span className="flex-shrink-0 transition-colors duration-300">
                {/* Simple sun/moon icon toggle */}
                {theme === "dark" ? (
                  <Moon size={20} className="text-current" />
                ) : (
                  <Sun size={20} className="text-current" />
                )}
              </span>
              {!collapsed && (
                <span className="ml-2 text-sm font-medium">
                  {theme === "dark" ? "Dark" : "Light"}
                </span>
              )}
            </button>
            <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
              <DialogTrigger asChild>
                <button
                  className={`flex items-center w-full py-2 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group ${
                    collapsed ? "justify-center px-2" : "px-3"
                  }`}
                  style={{ minWidth: collapsed ? "40px" : "auto" }}
                  onClick={() => setLogoutOpen(true)}
                >
                  <span className="flex-shrink-0 text-red-500 group-hover:text-red-600 transition-colors duration-300">
                    <Power
                      size={20}
                      className="text-red-500 group-hover:text-red-600"
                    />
                  </span>
                  {!collapsed && (
                    <span className="ml-2 text-sm font-medium">Logout</span>
                  )}
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Logout</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to logout?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setLogoutOpen(false)}
                    disabled={logoutLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={handleLogout}
                    disabled={logoutLoading}
                  >
                    {logoutLoading ? "Logging out..." : "Logout"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
