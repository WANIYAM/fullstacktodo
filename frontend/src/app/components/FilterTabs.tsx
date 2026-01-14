"use client";

import { motion } from 'framer-motion';
import { Filter, Target, CheckCircle, Clock, Flame, Calendar } from 'lucide-react';

type FilterType = 'all' | 'active' | 'completed' | 'today' | 'high-priority';

interface FilterTabsProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  isDarkMode: boolean;
}

export default function FilterTabs({ 
  currentFilter, 
  onFilterChange, 
  isDarkMode 
}: FilterTabsProps) {
  const filters: Array<{
    id: FilterType;
    label: string;
    icon: React.ReactNode;
    color: string;
  }> = [
    {
      id: 'all',
      label: 'All Tasks',
      icon: <Filter className="w-4 h-4" />,
      color: isDarkMode ? 'text-cyan-400' : 'text-blue-500',
    },
    {
      id: 'active',
      label: 'Active',
      icon: <Target className="w-4 h-4" />,
      color: isDarkMode ? 'text-emerald-400' : 'text-emerald-500',
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: <CheckCircle className="w-4 h-4" />,
      color: isDarkMode ? 'text-purple-400' : 'text-purple-500',
    },
    {
      id: 'today',
      label: 'Today',
      icon: <Calendar className="w-4 h-4" />,
      color: isDarkMode ? 'text-amber-400' : 'text-amber-500',
    },
    {
      id: 'high-priority',
      label: 'High Priority',
      icon: <Flame className="w-4 h-4" />,
      color: isDarkMode ? 'text-red-400' : 'text-red-500',
    },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-lg font-semibold flex items-center gap-2 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          <Filter className="w-5 h-5" />
          Filter Tasks
        </h2>
        <div className={`text-sm px-3 py-1 rounded-full ${
          isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
        }`}>
          Press Alt+T to cycle
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {filters.map((filterItem) => {
          const isActive = currentFilter === filterItem.id;
          return (
            <motion.button
              key={filterItem.id}
              layout
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onFilterChange(filterItem.id)}
              className={`group relative px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                isActive
                  ? isDarkMode
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-blue-600 border border-blue-500/30'
                  : isDarkMode
                  ? 'text-gray-400 hover:text-cyan-400 hover:bg-gray-800/50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100/50'
              }`}
            >
              <span className={`transition-colors ${isActive ? filterItem.color : ''}`}>
                {filterItem.icon}
              </span>
              {filterItem.label}
              
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeFilter"
                  className={`absolute inset-0 rounded-xl border-2 ${
                    isDarkMode 
                      ? 'border-cyan-500/50' 
                      : 'border-blue-500/50'
                  }`}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}