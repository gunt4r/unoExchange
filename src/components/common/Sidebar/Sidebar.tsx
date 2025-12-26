'use client';
import {
  DollarSign,
  FileText,
  LogOut,
  Mail,
  Settings,
  X,
} from 'lucide-react';
import React from 'react';
import MyLink from '../Link';

type NavItem = {
  name: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
};

type SidebarProps = {
  isOpen: boolean;
  onCloseAction: () => void;
  currentPage: string;
};

export default function Sidebar({ isOpen, onCloseAction, currentPage }: SidebarProps) {
  const navigation: NavItem[] = [
    { name: 'Currencies', icon: <DollarSign className="h-5 w-5" />, href: '/admin/currencies' },
    { name: 'Articles', icon: <FileText className="h-5 w-5" />, href: '/admin/articles' },
    { name: 'Newsletter', icon: <Mail className="h-5 w-5" />, href: '/admin/newsletter' },
    { name: 'Settings', icon: <Settings className="h-5 w-5" />, href: '/admin/settings' },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="bg-opacity-50 fixed inset-0 z-40 bg-gray-900 transition-opacity duration-300 lg:hidden"
          aria-hidden="true"
          onClick={onCloseAction}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200
          bg-white transition-transform duration-300 ease-in-out
          lg:static lg:inset-auto lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-gray-200 px-6">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-linear-to-br from-emerald-600 to-green-400" />
              <span className="text-xl font-bold text-gray-900">UNOEXCHANGE</span>
            </div>
            <button
              onClick={onCloseAction}
              className="text-gray-500 hover:text-gray-700 lg:hidden"
              type="button"
              aria-label="Close sidebar"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
            {navigation.map(item => (
              <MyLink
                key={item.name}
                href={item.href}
                className={`
                  flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2.5
                  text-sm font-medium transition-all duration-200
                  ${
              currentPage === item.name
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
              }
                `}
                type="button"
                aria-current={currentPage === item.name ? 'page' : undefined}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                    {item.badge}
                  </span>
                )}
              </MyLink>
            ))}
          </nav>

          <div className="border-t border-gray-200 p-4">
            <button
              className="mt-2 flex w-full cursor-pointer items-center space-x-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
              type="button"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
