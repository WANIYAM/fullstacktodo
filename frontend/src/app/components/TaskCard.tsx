"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Edit2, 
  Trash2, 
  X, 
  Star, 
  Clock,
  MoreVertical,
  CheckCircle2,
  Circle
} from 'lucide-react';
// import { Task } from '../types/task';
export type Priority = "low" | "medium" | "high";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  priority?: Priority;
  createdAt?: string;
  created_at?: string;
  due_date?: string;
}
interface TaskCardProps {
  task: Task;
  index: number;
  viewMode: 'list' | 'grid';
  onToggleComplete: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onUpdate: (taskId: number, updates: Partial<Task>) => void;
  isDarkMode: boolean;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
}

export default function TaskCard({
  task,
  index,
  viewMode,
  onToggleComplete,
  onDelete,
  onUpdate,
  isDarkMode,
  isEditing,
  onStartEdit,
  onCancelEdit
}: TaskCardProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');

  const handleSubmit = () => {
    if (title.trim()) {
      onUpdate(task.id, { title, description });
    }
  };

  const priorityColors = {
    high: isDarkMode ? 'text-red-400' : 'text-red-600',
    medium: isDarkMode ? 'text-amber-400' : 'text-amber-600',
    low: isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
  };

  const priorityIcons = {
    high: <Star className="w-4 h-4 fill-current" />,
    medium: <Clock className="w-4 h-4" />,
    low: <Circle className="w-4 h-4" />
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ 
        scale: viewMode === 'grid' ? 1.02 : 1,
        backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(248, 250, 252, 0.8)'
      }}
      className={`rounded-xl p-4 border transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-900/30 border-gray-800 hover:border-gray-700' 
          : 'bg-white/50 border-gray-200 hover:border-gray-300'
      } ${viewMode === 'grid' ? 'h-48' : ''}`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggleComplete(task)}
          className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            task.completed
              ? 'bg-gradient-to-r from-emerald-500 to-green-500 border-transparent'
              : isDarkMode
              ? 'border-gray-600 hover:border-cyan-400'
              : 'border-gray-300 hover:border-blue-400'
          }`}
        >
          {task.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          )}
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full bg-transparent border-b pb-2 focus:outline-none text-lg font-medium ${
                  isDarkMode 
                    ? 'border-cyan-500 text-white' 
                    : 'border-blue-500 text-gray-900'
                }`}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmit();
                  if (e.key === 'Escape') onCancelEdit();
                }}
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full bg-transparent focus:outline-none text-sm resize-none ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
                rows={2}
                placeholder="Add description..."
              />
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  className="px-3 py-1 text-sm rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                >
                  Save
                </motion.button>
                <button
                  onClick={onCancelEdit}
                  className={`px-3 py-1 text-sm rounded-lg ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-gray-300' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className={`font-medium text-lg leading-tight ${
                    task.completed 
                      ? 'line-through opacity-60' 
                      : ''
                  }`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className={`mt-1 text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    } ${task.completed ? 'opacity-50' : ''}`}>
                      {task.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'
                  } ${priorityColors[task.priority || 'medium']}`}>
                    <span className="flex items-center gap-1">
                      {priorityIcons[task.priority || 'medium']}
                      {task.priority}
                    </span>
                  </span>
                </div>
              </div>

              {/* Task metadata */}
              {task.due_date && (
                <div className={`mt-3 flex items-center gap-2 text-xs ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  <Clock className="w-3 h-3" />
                  Due {new Date(task.due_date).toLocaleDateString()}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={onStartEdit}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'hover:bg-gray-800 text-gray-400 hover:text-cyan-400' 
                        : 'hover:bg-gray-100 text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'hover:bg-gray-800 text-gray-400 hover:text-red-400' 
                        : 'hover:bg-gray-100 text-gray-600 hover:text-red-600'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {task.created_at && (
                  <span className={`text-xs ${
                    isDarkMode ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {new Date(task.created_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}