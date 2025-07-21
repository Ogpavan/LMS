import React, { useState } from "react";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

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
  { label: "Live Classes", icon: "Video", href: "/live" },
  { label: "Assignments", icon: "ClipboardList", href: "/assignments" },
  { label: "Exams", icon: "FileText", href: "/exams" },
  { label: "Grades", icon: "BarChart", href: "/grades" },
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
  const pathname = usePathname(); // <-- Use Next.js pathname

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
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
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-2  shadow-lg">
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
                  Workspace
                </div>
                <div className="font-semibold text-gray-900 text-sm text-nowrap  ">
                  Pawan Pal
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 py-4 dark:text-white">
            <div className="space-y-1">
              {sidebarMenuItems.map(({ label, icon, href }) => {
                const IconComponent = icons[icon];
                const isActive = pathname === href; // <-- Use pathname
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

              {/* Logout Button */}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 py-3">
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
                      <span className="flex-shrink-0 text-gray-500 group-hover:text-blue-500 transition-colors duration-300">
                        <IconComponent />
                      </span>
                      <span
                        className={`overflow-hidden transition-all duration-500 ease-out text-sm font-medium ${
                          collapsed
                            ? "w-0 opacity-0 translate-x-2"
                            : "w-auto opacity-100 translate-x-0 ml-3"
                        }`}
                      >
                        {label}
                      </span>
                    </a>
                  </div>
                );
              })}
            </div>
            {/* Theme Toggle Button */}
            <div className="px-3 overflow-x-hidden">
              <button
                onClick={handleThemeToggle}
                className={`flex items-center py-2 rounded-xl transition-all  duration-300 w-full group ${
                  collapsed ? "justify-center px-2" : "px-2"
                } ${
                  theme === "dark"
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                <span className="flex-shrink-0 transition-colors duration-300">
                  {/* Simple sun/moon icon toggle */}
                  {theme === "dark" ? (
                    <Moon size={20} className="text-current" />
                  ) : (
                    <Sun size={20} className="text-current" />
                  )}
                </span>
                <span
                  className={`overflow-x-hidden transition-all duration-500 ease-out text-sm font-medium ${
                    collapsed
                      ? "w-0 opacity-0 translate-x-2"
                      : "w-auto opacity-100 translate-x-0 ml-3"
                  }`}
                >
                  {theme === "dark" ? "Dark " : "Light "}
                </span>
              </button>
            </div>
            <div className="px-3">
              <button
                className={`flex items-center py-2 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 w-full group ${
                  collapsed ? "justify-center px-2" : "px-3"
                }`}
              >
                <span className="flex-shrink-0 text-red-500 group-hover:text-red-600 transition-colors duration-300">
                  <LogOut
                    size={20}
                    className="text-red-500 group-hover:text-red-600"
                  />
                </span>
                <span
                  className={`overflow-hidden transition-all duration-500 ease-out text-sm font-medium ${
                    collapsed
                      ? "w-0 opacity-0 translate-x-2"
                      : "w-auto opacity-100 translate-x-0 ml-3"
                  }`}
                >
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
