'use client';
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import SidebarHeader from './SidebarHeader';

type SidebarLayoutProps = {
  children: React.ReactNode;
};

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onCloseAction={() => setSidebarOpen(false)}
        currentPage="ADMIN PANEL"
      />

      <div className="w-full">
        <SidebarHeader
          currentPage="ADMIN PANEL"
          onMenuClickAction={() => setSidebarOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
