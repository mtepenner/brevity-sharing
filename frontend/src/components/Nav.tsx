import React from 'react';
import { User, Page } from '../types';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  user: User;
  onLogout: () => void;
}

const navItems: { page: Page; icon: string; label: string }[] = [
  { page: 'home', icon: '🏠', label: 'Home' },
  { page: 'explore', icon: '🔥', label: 'Trending' },
  { page: 'messages', icon: '✉️', label: 'Messages' },
  { page: 'notifications', icon: '🔔', label: 'Notifications' },
  { page: 'profile', icon: '👤', label: 'Profile' },
  { page: 'settings', icon: '⚙️', label: 'Settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, user, onLogout }) => {
  return (
    <div className="flex flex-col h-full py-4 px-2">
      {/* Logo */}
      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md shrink-0">
          B
        </div>
        <span className="hidden lg:block text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Brevity
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ page, icon, label }) => (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-semibold text-left ${
              currentPage === page
                ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <span className="text-xl shrink-0 leading-none">{icon}</span>
            <span className="hidden lg:block text-sm">{label}</span>
          </button>
        ))}
      </nav>

      {/* User info + logout */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="hidden lg:flex items-center gap-2 px-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {user.username[0].toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
            @{user.username}
          </span>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all font-semibold text-left"
        >
          <span className="text-xl shrink-0 leading-none">🚪</span>
          <span className="hidden lg:block text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

interface BottomNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const mobileNavItems = navItems.slice(0, 5);

export const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onNavigate }) => {
  return (
    <div className="flex items-center justify-around px-1 py-2">
      {mobileNavItems.map(({ page, icon, label }) => (
        <button
          key={page}
          onClick={() => onNavigate(page)}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
            currentPage === page
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <span className="text-xl leading-none">{icon}</span>
          <span className="text-xs font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
};
