"use client";

import { motion } from 'framer-motion';
import { LogOut, User, Settings, Grid, List, Bell, Search } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  user: { id: number; username: string } | null;
  isDarkMode: boolean;
  onLogout: () => void;
  themeToggle: React.ReactNode;
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
}

export default function Header({
  user,
  isDarkMode,
  onLogout,
  themeToggle,
  viewMode,
  onViewModeChange
}: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const formatDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return now.toLocaleDateString('en-US', options);
  };

  return (
    <header className="mb-8">
      {/* Top bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className={`p-3 rounded-2xl ${
              isDarkMode 
                ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10' 
                : 'bg-gradient-to-br from-cyan-500/5 to-blue-500/5'
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500' 
                  : 'bg-gradient-to-r from-cyan-400 to-blue-400'
              }`}>
                <span className="text-white font-bold text-lg">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                TaskFlow
              </h1>
              <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {formatDate()}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl ${
              isDarkMode 
                ? 'bg-gray-800/50 border border-gray-700' 
                : 'bg-white/50 border border-gray-300'
            }`}
          >
            <Search className={`w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search tasks..."
              className={`bg-transparent outline-none text-sm w-40 ${
                isDarkMode ? 'text-gray-300 placeholder-gray-500' : 'text-gray-700 placeholder-gray-400'
              }`}
            />
            <kbd className={`text-xs px-2 py-1 rounded ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
            }`}>
              ⌘F
            </kbd>
          </motion.div>

          {/* View mode toggle */}
          <div className={`flex items-center p-1 rounded-xl ${
            isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'
          }`}>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? isDarkMode
                    ? 'bg-gray-800 text-cyan-400'
                    : 'bg-white text-blue-600 shadow-sm'
                  : isDarkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="List view"
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? isDarkMode
                    ? 'bg-gray-800 text-cyan-400'
                    : 'bg-white text-blue-600 shadow-sm'
                  : isDarkMode
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="Grid view"
            >
              <Grid className="w-5 h-5" />
            </button>
          </div>

          {/* Notification bell */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-xl relative ${
              isDarkMode 
                ? 'bg-gray-800/50 hover:bg-gray-700/50' 
                : 'bg-white/50 hover:bg-gray-100/50'
            }`}
            aria-label="Notifications"
          >
            <Bell className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </motion.button>

          {/* Theme toggle */}
          {themeToggle}

          {/* User menu */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl ${
                isDarkMode 
                  ? 'bg-gray-800/50 hover:bg-gray-700/50' 
                  : 'bg-white/50 hover:bg-gray-100/50'
              }`}
            >
              <div className="text-left">
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {user?.username || 'User'}
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Free Plan
                </p>
              </div>
              <User className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </motion.button>

            {/* User dropdown */}
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`absolute right-0 top-full mt-2 w-56 rounded-xl shadow-2xl backdrop-blur-xl border z-50 ${
                  isDarkMode 
                    ? 'bg-gray-900/90 border-gray-800' 
                    : 'bg-white/90 border-gray-200'
                }`}
              >
                <div className="p-4 border-b border-gray-500/20">
                  <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {user?.username}
                  </p>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {user?.id ? `ID: ${user.id}` : 'Not signed in'}
                  </p>
                </div>
                <div className="p-2">
                  <button
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm ${
                      isDarkMode 
                        ? 'hover:bg-gray-800 text-gray-300' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button
                    onClick={onLogout}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm ${
                      isDarkMode 
                        ? 'hover:bg-red-500/20 text-red-400' 
                        : 'hover:bg-red-50 text-red-600'
                    }`}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Welcome message */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`rounded-xl p-4 mb-6 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 border border-gray-800' 
            : 'bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 border border-gray-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-lg font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Welcome back, {user?.username || 'there'}! 👋
            </p>
            <p className={`mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Ready to tackle your tasks for today? Let's make it productive!
            </p>
          </div>
          <div className={`hidden lg:block px-4 py-2 rounded-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Pro Tip
            </p>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Use keyboard shortcuts for faster navigation
            </p>
          </div>
        </div>
      </motion.div>
    </header>
  );
}