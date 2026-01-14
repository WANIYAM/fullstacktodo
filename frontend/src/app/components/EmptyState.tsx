"use client";

import { motion } from 'framer-motion';
import { Target, Sparkles, TrendingUp } from 'lucide-react';

interface EmptyStateProps {
  filter: string;
  isDarkMode: boolean;
  onCreateTask: () => void;
}

export default function EmptyState({ filter, isDarkMode, onCreateTask }: EmptyStateProps) {
  const messages = {
    all: "No tasks yet. Time to plan your next move!",
    active: "No active tasks. Enjoy the free time!",
    completed: "No completed tasks yet. Let's get started!",
    today: "No tasks for today. Planning ahead is key!",
    'high-priority': "No high-priority tasks. Great job staying on top!"
  };

  const motivationalQuotes = [
    "The secret of getting ahead is getting started.",
    "Small steps every day lead to big results.",
    "Productivity is never an accident.",
    "Your future is created by what you do today."
  ];

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12 lg:py-16"
    >
      <div className="relative inline-block mb-8">
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 10, 0],
            scale: [1, 1.1, 1.1, 1, 1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center ${
            isDarkMode 
              ? 'bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10' 
              : 'bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5'
          }`}
        >
          <Target className={`w-16 h-16 ${isDarkMode ? 'text-cyan-400' : 'text-blue-500'}`} />
        </motion.div>
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity }
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Sparkles className={`w-8 h-8 ${isDarkMode ? 'text-cyan-300/50' : 'text-blue-400/50'}`} />
        </motion.div>
      </div>

      <h3 className={`text-2xl font-semibold mb-3 ${
        isDarkMode ? 'text-gray-200' : 'text-gray-800'
      }`}>
        {messages[filter as keyof typeof messages]}
      </h3>
      
      <p className={`text-lg mb-6 max-w-md mx-auto ${
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {randomQuote}
      </p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onCreateTask}
        className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 inline-flex items-center gap-2"
      >
        <TrendingUp className="w-5 h-5" />
        Create Your First Task
      </motion.button>

      <div className={`mt-8 text-sm ${
        isDarkMode ? 'text-gray-500' : 'text-gray-400'
      }`}>
        <p>Tip: Press ⌘K to quickly add tasks</p>
      </div>
    </motion.div>
  );
}