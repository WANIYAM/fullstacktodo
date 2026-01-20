"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef, useCallback, RefObject } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  X, 
  Plus,
  Zap,
  Sparkles} from 'lucide-react';
import { getTasks, createTask, updateTask, deleteTask, logout, getCurrentUser, getAccessToken } from './services/api';

// --- New Components ---
import TaskCard from './components/TaskCard';
import ThemeToggle from './components/ThemeToggle';
import EmptyState from './components/EmptyState';
import Toast from './components/Toast';
import TaskInput from './components/TaskInput';
import FilterTabs from './components/FilterTabs';
import StatsOverview from './components/StatsOverview';
import Header from './components/Header';

interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  created_at?: string;
  due_date?: string;
}

type FilterType = 'all' | 'active' | 'completed' | 'today' | 'high-priority';

export default function TasksPage() {
  const router = useRouter();
  const [user, setUser] = useState<{id: number; username: string} | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [aiCommand, setAiCommand] = useState('');
  
const inputRef = useRef<HTMLInputElement>(null);
const [isDarkMode, setIsDarkMode] = useState(() => {
  // Check localStorage on initial render (client-side only)
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('todo-theme');
    return savedTheme ? savedTheme === 'dark' : true; // Default to dark
  }
  return true;
});
useEffect(() => {
  // Save theme to localStorage
  localStorage.setItem('todo-theme', isDarkMode ? 'dark' : 'light');
  
  // Apply theme to document for Tailwind dark mode
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [isDarkMode]);
  // Optimistic updates
  const [optimisticTasks, setOptimisticTasks] = useState<Record<number, Task>>({});

  // Load user and tasks on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [userData, tasksData] = await Promise.all([
          getCurrentUser(),
          getTasks()
        ]);
        setUser(userData);
        setTasks(tasksData);
      } catch (err) {
        console.error('Error loading data:', err);
        showToast('Failed to load data', 'error');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [router]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditingTask(null);
        setIsAddingTask(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsAddingTask(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-focus input when adding task
  useEffect(() => {
    if (isAddingTask && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isAddingTask]);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') {
      setSuccess(message);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(message);
      setTimeout(() => setError(''), 3000);
    }
  }, []);

  const handleCreateTask = async (taskData: { 
    title: string; 
    description?: string; 
    priority?: 'low' | 'medium' | 'high';
  }) => {
    if (!taskData.title.trim()) {
      showToast('Task title is required', 'error');
      return;
    }

    const tempId = Date.now();
    const optimisticTask: Task = {
      id: tempId,
      title: taskData.title,
      description: taskData.description || null,
      completed: false,
      priority: taskData.priority || 'medium',
      created_at: new Date().toISOString(),
    };

    // Optimistic update
    setTasks(prev => [optimisticTask, ...prev]);
    setIsAddingTask(false);

    try {
      const newTask = await createTask({
        title: taskData.title,
        description: taskData.description || null,
        priority: taskData.priority || 'medium',
      });
      
      // Replace optimistic task with real one
      setTasks(prev => prev.map(t => t.id === tempId ? newTask : t));
      showToast('Task created successfully!');
    } catch (err: any) {
      console.error('Error creating task:', err);
      // Rollback optimistic update
      setTasks(prev => prev.filter(t => t.id !== tempId));
      showToast('Failed to create task', 'error');
    }
  };

  const handleToggleComplete = async (task: Task) => {
    const originalTasks = [...tasks];
    
    // Optimistic update
    setTasks(prev => prev.map(t => 
      t.id === task.id ? { ...t, completed: !t.completed } : t
    ));

    try {
      const updated = await updateTask(task.id, {
        completed: !task.completed,
      });
      setTasks(prev => prev.map(t => t.id === task.id ? updated : t));
      showToast(`Task marked as ${!task.completed ? 'completed' : 'active'}!`);
    } catch (err: any) {
      console.error('Error updating task:', err);
      // Rollback
      setTasks(originalTasks);
      showToast('Failed to update task', 'error');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    const originalTasks = [...tasks];
    const taskToDelete = tasks.find(t => t.id === taskId);
    
    // Optimistic update
    setTasks(prev => prev.filter(t => t.id !== taskId));

    try {
      await deleteTask(taskId);
      showToast('Task deleted successfully!');
    } catch (err: any) {
      console.error('Error deleting task:', err);
      // Rollback
      setTasks(originalTasks);
      showToast('Failed to delete task', 'error');
    }
  };

  const handleUpdateTask = async (taskId: number, updates: Partial<Task>) => {
    const originalTasks = [...tasks];
    
    // Optimistic update
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, ...updates } : t
    ));
    setEditingTask(null);

    try {
      const updated = await updateTask(taskId, updates);
      setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
      showToast('Task updated successfully!');
    } catch (err: any) {
      console.error('Error updating task:', err);
      // Rollback
      setTasks(originalTasks);
      showToast('Failed to update task', 'error');
    }
  };

const handleAiSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!aiCommand.trim()) {
    showToast('AI command cannot be empty', 'error');
    return;
  }

  const token = getAccessToken();
  if (!token) {
    showToast('You are not logged in', 'error');
    router.push('/login');
    return;
  }

  try {
    console.log('Sending AI command:', aiCommand); // Debug log
    
    const response = await fetch('http://127.0.0.1:8000/ai/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ input: aiCommand }),
    });

    console.log('Response status:', response.status); // Debug log

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData); // Debug log
      throw new Error(errorData.detail || 'AI command failed');
    }

    const data = await response.json();
    console.log('Success response:', data); // Debug log

    setAiCommand('');
    showToast('AI command executed successfully!', 'success');
    
    // Refresh task list
    const tasksData = await getTasks();
    setTasks(tasksData);

  } catch (err: any) {
    console.error('Error executing AI command:', err);
    showToast(err.message || 'Failed to execute AI command', 'error');
  }
};
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
      showToast('Logout failed', 'error');
    }
  };

  // Filter and group tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    if (filter === 'high-priority') return task.priority === 'high' && !task.completed;
    if (filter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      return task.due_date === today;
    }
    return true;
  });

  // Group tasks by status for better organization
  const todayTasks = tasks.filter(t => {
    const today = new Date().toISOString().split('T')[0];
    return t.due_date === today && !t.completed;
  });

  const upcomingTasks = tasks.filter(t => {
    if (t.completed) return false;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return t.due_date && new Date(t.due_date) > tomorrow;
  });

  // Calculate completion percentage
  const completionPercentage = tasks.length > 0 
    ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
    : 0;

  // Motivational messages based on progress
  const getMotivationalMessage = () => {
    if (tasks.length === 0) return "Ready to conquer your day? Start by adding a task!";
    if (completionPercentage === 100) return "Amazing! You've completed all tasks! 🎉";
    if (completionPercentage > 75) return "Almost there! Keep up the great work!";
    if (completionPercentage > 50) return "You're making solid progress!";
    if (completionPercentage > 25) return "Good start! Keep going!";
    return "Every journey begins with a single step. You've got this!";
  };

  // Render loading state
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 to-black' 
          : 'bg-gradient-to-br from-gray-50 to-white'
      }`}>
        <div className="text-center">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className={`w-20 h-20 border-3 rounded-full mx-auto mb-6 ${
                isDarkMode 
                  ? 'border-cyan-500/20 border-t-cyan-500'
                  : 'border-blue-500/20 border-t-blue-500'
              }`}
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sparkles className={`w-8 h-8 ${isDarkMode ? 'text-cyan-400' : 'text-blue-500'}`} />
            </motion.div>
          </div>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`mt-4 font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Loading your productive space...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <LayoutGroup>
      <div className={`min-h-screen transition-all duration-500 relative overflow-hidden ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-black text-gray-100' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900'
      }`}>
        {/* Animated background with noise texture */}
        <div className="fixed inset-0">
          <div className={`absolute inset-0 ${
            isDarkMode 
              ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800/30 via-black to-black'
              : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-gray-50 to-gray-100'
          }`} />
          <div className={`absolute inset-0 opacity-[0.015] ${
            isDarkMode ? 'bg-[url(/noise-dark.png)]' : 'bg-[url(/noise-light.png)]'
          }`} />
        </div>

        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          {/* Header with user info and controls */}
          <Header
            user={user}
            isDarkMode={isDarkMode}
            onLogout={handleLogout}
            themeToggle={
              <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            }
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Stats and Progress Overview */}
          <StatsOverview
            tasks={tasks}
            todayTasks={todayTasks}
            upcomingTasks={upcomingTasks}
            isDarkMode={isDarkMode}
            completionPercentage={completionPercentage}
            motivationalMessage={getMotivationalMessage()}
          />

          {/* Main content area */}
          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 mt-8">
            {/* Left sidebar - Quick actions and filters */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="lg:col-span-1 space-y-6"
            >
              {/* Quick Add Card */}
              <motion.div
                whileHover={{ y: -2 }}
                className={`rounded-2xl p-6 backdrop-blur-xl border ${
                  isDarkMode 
                    ? 'bg-gray-900/50 border-gray-800' 
                    : 'bg-white/50 border-gray-200'
                } shadow-lg`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" />
                    Quick Add
                  </h3>
                  <button
                    onClick={() => setIsAddingTask(!isAddingTask)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode 
                        ? 'hover:bg-gray-800' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {isAddingTask ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                </div>
                
                <AnimatePresence>
                  {isAddingTask && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <TaskInput
                        onSubmit={handleCreateTask}
                        isDarkMode={isDarkMode}
                        inputRef={inputRef as RefObject<HTMLInputElement>}
                        onCancel={() => setIsAddingTask(false)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isAddingTask && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-3"
                  >
                    <button
                      onClick={() => {
                        setIsAddingTask(true);
                        setTimeout(() => inputRef.current?.focus(), 100);
                      }}
                      className={`w-full py-3 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                        isDarkMode
                          ? 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 hover:bg-cyan-500/20'
                          : 'bg-gradient-to-r from-cyan-500/5 to-blue-500/5 text-blue-600 hover:bg-blue-500/10'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      Add New Task
                      <kbd className={`ml-auto px-2 py-1 text-xs rounded ${
                        isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
                      }`}>
                        ⌘K
                      </kbd>
                    </button>
                    
                    <div className="text-xs text-center pt-2 opacity-60">
                      Press ⌘K to quickly add tasks
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Focus Mode Toggle */}
              <div className={`rounded-2xl p-6 backdrop-blur-xl border ${
                isDarkMode 
                  ? 'bg-gray-900/50 border-gray-800' 
                  : 'bg-white/50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold mb-1">Focus Mode</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Hide completed tasks
                    </p>
                  </div>
                  <button
                    onClick={() => setFilter(filter === 'active' ? 'all' : 'active')}
                    className={`relative w-12 h-6 rounded-full transition-all ${
                      filter === 'active'
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                        : isDarkMode
                        ? 'bg-gray-700'
                        : 'bg-gray-300'
                    }`}
                  >
                    <motion.div
                      layout
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white ${
                        filter === 'active' ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* AI Command Card */}
              <motion.div
                whileHover={{ y: -2 }}
                className={`rounded-2xl p-6 backdrop-blur-xl border ${
                  isDarkMode
                    ? 'bg-gray-900/50 border-gray-800'
                    : 'bg-white/50 border-gray-200'
                } shadow-lg`}
              >
                <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  AI Assistant
                </h3>
                <form onSubmit={handleAiSubmit}>
                  <div className="relative">
                    <input
                      type="text"
                      value={aiCommand}
                      onChange={(e) => setAiCommand(e.target.value)}
                      placeholder="e.g., 'add a task to buy milk'"
                      className={`w-full py-3 pl-4 pr-10 rounded-xl text-sm font-medium transition-all border ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-700 focus:ring-purple-500 focus:border-purple-500'
                          : 'bg-gray-100 border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                      }`}
                    />
                    <button
                      type="submit"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      <Zap className="w-5 h-5 text-purple-500 hover:text-purple-400" />
                    </button>
                  </div>
                  <p className="text-xs text-center pt-3 opacity-60">
                    Use natural language to manage your tasks.
                  </p>
                </form>
              </motion.div>
            </motion.div>

            {/* Main Tasks Area */}
            <div className="lg:col-span-2">
              {/* Filter Tabs */}
              <FilterTabs
                currentFilter={filter}
                onFilterChange={setFilter}
                isDarkMode={isDarkMode}
              />

              {/* Tasks List/Grid */}
              <AnimatePresence mode="wait">
                {filteredTasks.length === 0 ? (
                  <EmptyState
                    filter={filter}
                    isDarkMode={isDarkMode}
                    onCreateTask={() => setIsAddingTask(true)}
                  />
                ) : (
                  <motion.div
                    key="tasks"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={viewMode === 'grid' 
                      ? 'grid md:grid-cols-2 gap-4' 
                      : 'space-y-3'
                    }
                    layout
                  >
                    <AnimatePresence>
                      {filteredTasks.map((task, index) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          index={index}
                          viewMode={viewMode}
                          onToggleComplete={handleToggleComplete}
                          onDelete={handleDeleteTask}
                          onUpdate={handleUpdateTask}
                          isDarkMode={isDarkMode}
                          isEditing={editingTask?.id === task.id}
                          onStartEdit={() => setEditingTask(task)}
                          onCancelEdit={() => setEditingTask(null)}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>

        {/* Toast Notifications */}
        <Toast
          message={error}
          type="error"
          isVisible={!!error}
          onClose={() => setError('')}
        />
        <Toast
          message={success}
          type="success"
          isVisible={!!success}
          onClose={() => setSuccess('')}
        />

        {/* Floating Action Button for Mobile */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsAddingTask(true)}
          className="fixed bottom-6 right-6 lg:hidden z-40 w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-2xl flex items-center justify-center"
        >
          <Plus className="w-6 h-6" />
        </motion.button>

        {/* Footer with progress */}
        <footer className={`mt-12 pt-6 border-t ${
          isDarkMode ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between text-sm">
              <div className={`flex items-center gap-2 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                <Sparkles className="w-4 h-4" />
                <span>Stay productive</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {tasks.filter(t => !t.completed).length} pending • {tasks.filter(t => t.completed).length} done
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </LayoutGroup>
  );
}