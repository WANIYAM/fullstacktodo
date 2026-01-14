"use client";

import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Clock, Zap, Target, Sparkles } from 'lucide-react';
import ProgressRing from './ProgressRing';

interface StatsOverviewProps {
  tasks: any[];
  todayTasks: any[];
  upcomingTasks: any[];
  isDarkMode: boolean;
  completionPercentage: number;
  motivationalMessage: string;
}

export default function StatsOverview({
  tasks,
  todayTasks,
  upcomingTasks,
  isDarkMode,
  completionPercentage,
  motivationalMessage
}: StatsOverviewProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const activeTasks = tasks.filter(t => !t.completed).length;
  const highPriorityTasks = tasks.filter(t => t.priority === 'high' && !t.completed).length;

  // Calculate productivity score (custom metric)
  const productivityScore = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100 + 
        (todayTasks.length > 0 ? (todayTasks.filter(t => t.completed).length / todayTasks.length) * 20 : 0))
    : 0;

  const stats = [
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: <Target className="w-5 h-5" />,
      color: isDarkMode ? 'text-cyan-400' : 'text-blue-500',
      bg: isDarkMode ? 'bg-cyan-500/10' : 'bg-blue-500/10',
    },
    {
      label: 'Active',
      value: activeTasks,
      icon: <Zap className="w-5 h-5" />,
      color: isDarkMode ? 'text-amber-400' : 'text-amber-500',
      bg: isDarkMode ? 'bg-amber-500/10' : 'bg-amber-500/10',
    },
    {
      label: 'Today',
      value: todayTasks.length,
      icon: <Calendar className="w-5 h-5" />,
      color: isDarkMode ? 'text-emerald-400' : 'text-emerald-500',
      bg: isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-500/10',
    },
    {
      label: 'High Priority',
      value: highPriorityTasks,
      icon: <Clock className="w-5 h-5" />,
      color: isDarkMode ? 'text-red-400' : 'text-red-500',
      bg: isDarkMode ? 'bg-red-500/10' : 'bg-red-500/10',
    },
  ];

  return (
    <div className={`rounded-2xl p-6 mb-8 backdrop-blur-xl border shadow-lg ${
      isDarkMode 
        ? 'bg-gray-900/50 border-gray-800' 
        : 'bg-white/50 border-gray-200'
    }`}>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left column - Progress */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Your Progress
              </h2>
              <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {motivationalMessage}
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400' 
                : 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-blue-600'
            }`}>
              <TrendingUp className="w-4 h-4" />
              Productivity: {productivityScore}%
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl transition-all duration-300 ${
                  isDarkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                    {stat.label}
                  </span>
                </div>
                <div className="text-3xl font-bold mt-2">{stat.value}</div>
                <div className={`h-1 mt-2 rounded-full overflow-hidden ${
                  isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                }`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((stat.value / Math.max(totalTasks, 1)) * 100, 100)}%` }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                    className={`h-full ${
                      stat.label === 'Total Tasks' ? 'bg-gradient-to-r from-cyan-500 to-blue-500' :
                      stat.label === 'Active' ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                      stat.label === 'Today' ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
                      'bg-gradient-to-r from-red-500 to-pink-500'
                    }`}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional insights */}
          <div className={`mt-6 p-4 rounded-xl ${
            isDarkMode ? 'bg-gray-800/30' : 'bg-gray-100/50'
          }`}>
            <div className="flex items-center gap-3">
              <Sparkles className={`w-5 h-5 ${isDarkMode ? 'text-cyan-400' : 'text-blue-500'}`} />
              <div>
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Daily Insight
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {todayTasks.length > 0 
                    ? `You have ${todayTasks.length} task${todayTasks.length > 1 ? 's' : ''} due today`
                    : upcomingTasks.length > 0
                    ? `You have ${upcomingTasks.length} upcoming task${upcomingTasks.length > 1 ? 's' : ''}`
                    : 'No upcoming tasks. Great planning!'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Progress ring */}
        <div className="flex flex-col items-center justify-center">
          <ProgressRing 
            percentage={completionPercentage} 
            isDarkMode={isDarkMode}
            size={140}
          />
          <div className="text-center mt-6">
            <p className={`text-lg font-semibold mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Completion Rate
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-cyan-400' : 'text-blue-500'}`}>
                  {completedTasks}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Done
                </div>
              </div>
              <div className="h-8 w-px bg-gray-500/30" />
              <div className="text-center">
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-500'}`}>
                  {activeTasks}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Pending
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}