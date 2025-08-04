"use client";
import React, { useState } from "react";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarNav from "@/components/SidebarNav";

import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const [collapsed, setCollapsed] = useState(true);
  const pathname = usePathname();
  const hideSidebar = pathname === "/signin" || pathname === "/signup";

  // Default: show sidebar and app shell
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-900">
        <SidebarProvider>
          <div className="flex h-screen font-normal text-gray-900 tracking-tight">
            {!hideSidebar && (
              <SidebarNav collapsed={collapsed} setCollapsed={setCollapsed} />
            )}
            <main className="min-w-[90vw] ml-24">{children}</main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
// Disable static generation for this page
