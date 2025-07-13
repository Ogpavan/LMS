import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// Simple icon components to replace lucide-react
const icons = {
  Home: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  ),
  BookOpen: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  ),
  Video: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  ),
  ClipboardList: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
      />
    </svg>
  ),
  FileText: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  ),
  BarChart: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  ),
  MessageSquare: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  ),
  Settings: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  User: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  KeyRound: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
      />
    </svg>
  ),
  SlidersHorizontal: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
      />
    </svg>
  ),
  LogOut: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  ),
};

const sidebarMenuItems = [
  { label: "Dashboard", icon: "Home", href: "/dashboard" },
  { label: "Courses", icon: "BookOpen", href: "/courses" },
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

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Use collapsed state unless themeMenuOpen is true
  //   const sidebarCollapsed = themeMenuOpen ? false : collapsed;

  return (
    <div className="fixed top-0 left-0 w-0 h-screen z-40 flex items-center ml-3   bg-white transition-all duration-300 ease-in-out">
      <div
        className="group"
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
      >
        <div
          className={`bg-white/90   backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 flex flex-col transition-all duration-500 ease-out overflow-y-auto overflow-x-hidden ${
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
                return (
                  <div
                    key={label}
                    className="px-3 text-nowrap font-normal tracking-tight "
                  >
                    <a
                      href={href}
                      className={`flex items-center py-2.5 rounded-xl text-gray-700 hover:bg-gray-50   hover:text-gray-900 transition-all duration-300 group ${
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
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="5"
                        stroke="currentColor"
                        strokeWidth={2}
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 6.95l-1.41-1.41M6.46 6.46L5.05 5.05m12.9 0l-1.41 1.41M6.46 17.54l-1.41 1.41"
                      />
                    </svg>
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
                  <icons.LogOut />
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
