"use client";

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Calendar, Clock, Flag } from 'lucide-react';

interface TaskInputProps {
  onSubmit: (taskData: { 
    title: string; 
    description?: string; 
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
  }) => void;
  isDarkMode: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onCancel: () => void;
}

export default function TaskInput({ 
  onSubmit, 
  isDarkMode, 
  inputRef, 
  onCancel 
}: TaskInputProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setIsExpanded(false);
  };

  // Auto-expand when typing
  useEffect(() => {
    if (title.length > 0 && !isExpanded) {
      setIsExpanded(true);
    }
  }, [title]);

  const priorityOptions = [
    { value: 'low', label: 'Low', color: isDarkMode ? 'text-emerald-400' : 'text-emerald-600', bg: isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-500/10' },
    { value: 'medium', label: 'Medium', color: isDarkMode ? 'text-amber-400' : 'text-amber-600', bg: isDarkMode ? 'bg-amber-500/10' : 'bg-amber-500/10' },
    { value: 'high', label: 'High', color: isDarkMode ? 'text-red-400' : 'text-red-600', bg: isDarkMode ? 'bg-red-500/10' : 'bg-red-500/10' },
  ];

  return (
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {/* Main input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className={`w-full pl-12 pr-10 py-4 rounded-xl text-lg font-medium border-2 focus:outline-none focus:border-cyan-500 transition-all duration-300 ${
            isDarkMode
              ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500'
              : 'bg-white/70 border-gray-300 text-gray-900 placeholder-gray-400'
          }`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
            if (e.key === 'Escape') {
              onCancel();
            }
          }}
        />
        <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg ${
          isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100/50'
        }`}>
          <Flag className={`w-5 h-5 ${
            priority === 'high' ? 'text-red-400' :
            priority === 'medium' ? 'text-amber-400' :
            'text-emerald-400'
          }`} />
        </div>
        <button
          type="button"
          onClick={onCancel}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-4 overflow-hidden"
          >
            {/* Description */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Add some details..."
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:border-cyan-500 transition-all duration-300 resize-none ${
                  isDarkMode
                    ? 'bg-gray-800/30 border-gray-700 text-white placeholder-gray-500'
                    : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>

            {/* Options row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Priority */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Priority
                </label>
                <div className="flex gap-2">
                  {priorityOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPriority(option.value as any)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        priority === option.value
                          ? `${option.bg} ${option.color} border ${
                              isDarkMode 
                                ? `border-${option.value === 'high' ? 'red' : option.value === 'medium' ? 'amber' : 'emerald'}-500/50`
                                : `border-${option.value === 'high' ? 'red' : option.value === 'medium' ? 'amber' : 'emerald'}-500/30`
                            }`
                          : isDarkMode
                          ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Due Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-cyan-500 transition-all duration-300 ${
                      isDarkMode
                        ? 'bg-gray-800/30 border-gray-700 text-white'
                        : 'bg-white/50 border-gray-300 text-gray-900'
                    }`}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="flex justify-end pt-4 border-t border-gray-500/20">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!title.trim()}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  !title.trim()
                    ? isDarkMode
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/25'
                }`}
              >
                <Clock className="w-4 h-4" />
                Add Task
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
}