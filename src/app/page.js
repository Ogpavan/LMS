import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import React from "react";
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
} from "lucide-react";

const sidebarMenuItems = [
  { label: "Dashboard", icon: Home, href: "/dashboard" },
  { label: "Courses", icon: BookOpen, href: "/courses" },
  { label: "Live Classes", icon: Video, href: "/live" },
  { label: "Assignments", icon: ClipboardList, href: "/assignments" },
  { label: "Exams", icon: FileText, href: "/exams" },
  { label: "Grades", icon: BarChart, href: "/grades" },
  { label: "Messages", icon: MessageSquare, href: "/messages" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

const sidebarFooterItems = [
  { label: "My Profile", icon: User, href: "/profile" },
  { label: "Edit Account ", icon: KeyRound, href: "/account" },
  {
    label: "Settings ",
    icon: SlidersHorizontal,
    href: "/preferences",
  },
];

function Page() {
  return (
    <SidebarProvider>
      <div className="flex h-screen  ">
        <Sidebar className="bg-white rounded-4xl shadow-lg my-2  w-56 border border-[#ecececd6] flex flex-col">
          <SidebarHeader className="flex flex-col items-start gap-2 border-b border-[#ececec]  p-6 pb-2">
            <div className="flex items-center gap-3">
              <div className="bg-[#f5f5f7] rounded-xl   p-2">
                {/* Replace with your logo */}
                <span className="font-bold text-xl text-[#007aff]">🍏</span>
              </div>
              <div>
                <div className="text-xs text-gray-400 ">Workspace</div>
                <div className="font-semibold text-base text-gray-900">
                  Pawan Pal
                </div>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="flex-1 px-2 pt-4">
            <SidebarMenu>
              {sidebarMenuItems.map(({ label, icon: Icon, href }) => (
                <SidebarMenuItem key={label}>
                  <SidebarMenuButton asChild>
                    <a
                      href={href}
                      className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 font-medium hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]  hover:text-stone-950 transition-all duration-300"
                    >
                      <Icon className="w-5 h-5 text-gray-500" />
                      <span>{label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="px-2 pb-4 pt-2 border-t border-[#ececec]">
            <SidebarMenu>
              {sidebarFooterItems.map(({ label, icon: Icon, href }) => (
                <SidebarMenuItem key={label}>
                  <SidebarMenuButton asChild>
                    <a
                      href={href}
                      className="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 font-medium hover:bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]  hover:text-stone-950 transition-all duration-300"
                    >
                      <Icon className="w-5 h-5 text-gray-500" />
                      <span>{label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button className="flex items-center gap-3 px-4 py-2 rounded-xl text-red-500 font-medium hover:bg-[#f5f5f7] transition-all duration-150 w-full">
                    <LogOut className="w-5 h-5 text-red-400" />
                    <span>Logout</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
      </div>
    </SidebarProvider>
  );
}

export default Page;
