"use client";

import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
}

export default function ThemeToggle({ isDarkMode, setIsDarkMode }: ThemeToggleProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setIsDarkMode(!isDarkMode)}
      className={`relative p-2 rounded-xl transition-colors ${
        isDarkMode 
          ? 'bg-gray-800 hover:bg-gray-700' 
          : 'bg-gray-100 hover:bg-gray-200'
      }`}
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6">
        <motion.div
          initial={false}
          animate={{ 
            rotate: isDarkMode ? 180 : 0,
            scale: isDarkMode ? 0.5 : 1,
            opacity: isDarkMode ? 0 : 1
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <Sun className="w-6 h-6 text-amber-500" />
        </motion.div>
        <motion.div
          initial={false}
          animate={{ 
            rotate: isDarkMode ? 0 : -180,
            scale: isDarkMode ? 1 : 0.5,
            opacity: isDarkMode ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <Moon className="w-6 h-6 text-cyan-400" />
        </motion.div>
      </div>
    </motion.button>
  );
}