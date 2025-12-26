'use client';
import { Menu } from 'lucide-react';

type HeaderProps = {
  currentPage: string;
  onMenuClickAction: () => void;
};

export default function SidebarHeader({ currentPage, onMenuClickAction }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClickAction}
            className="text-gray-500 hover:text-gray-700 lg:hidden"
            type="button"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{currentPage}</h1>
        </div>
      </div>
    </header>
  );
}
