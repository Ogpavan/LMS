"use client";
import React, { useState } from "react";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarNav from "@/components/SidebarNav";

export default function RootLayout({ children }) {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-900">
        <SidebarProvider>
          <div className="flex h-screen font-normal text-gray-900 tracking-tight">
            <SidebarNav collapsed={collapsed} setCollapsed={setCollapsed} />
            <main className="flex-1 ml-24">{children}</main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
// Disable static generation for this page
