// TasksPage.tsx - Simplified version
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  Edit2, 
  Trash2, 
  X, 
  Plus,
  Sun,
  Moon,
  Target,
  Loader2,
  LogOut,
  AlertCircle,
  CheckCircle,
  Home,
  ListTodo,
  User,
  Settings
} from 'lucide-react';
import { getTasks, createTask, updateTask, deleteTask, logout, getCurrentUser } from '../services/api';
import AnimatedBackground from '../components/AnimatedBackground';
import TaskCard from '../components/TaskCard';
import ThemeToggle from '../components/ThemeToggle';
import Dock, { DockItemData } from '../components/Dock';

interface Task {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  created_at?: string;
}

type FilterType = 'all' | 'active' | 'completed';

export default function TasksPage() {
  const router = useRouter();
  const [user, setUser] = useState<{id: number; username: string} | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Dock items configuration
  const dockItems: DockItemData[] = [
    {
      icon: <Home className="w-6 h-6" />,
      label: 'Dashboard',
      onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
      className: 'hover:bg-cyan-500/20'
    },
    {
      icon: <ListTodo className="w-6 h-6" />,
      label: 'All Tasks',
      onClick: () => setFilter('all'),
      className: 'hover:bg-blue-500/20'
    },
    {
      icon: <Check className="w-6 h-6" />,
      label: 'Completed',
      onClick: () => setFilter('completed'),
      className: 'hover:bg-emerald-500/20'
    },
    {
      icon: <Target className="w-6 h-6" />,
      label: 'Pending',
      onClick: () => setFilter('active'),
      className: 'hover:bg-amber-500/20'
    },
    {
      icon: <Plus className="w-6 h-6" />,
      label: 'Add Task',
      onClick: () => {
        setIsAddingTask(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      },
      className: 'hover:bg-purple-500/20'
    },
    {
      icon: <User className="w-6 h-6" />,
      label: user ? user.username : 'Profile',
      onClick: () => {
        if (user) {
          setSuccess(`Welcome back, ${user.username}!`);
          setTimeout(() => setSuccess(''), 2000);
        }
      },
      className: 'hover:bg-pink-500/20'
    },
    {
      icon: <Settings className="w-6 h-6" />,
      label: 'Settings',
      onClick: () => setIsDarkMode(!isDarkMode),
      className: 'hover:bg-gray-500/20'
    }
  ];

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
        setError('Failed to load data');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [router]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTaskTitle.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      const newTask = await createTask({
        title: newTaskTitle,
        description: newTaskDescription || null,
        priority: newTaskPriority,
      });
      
      setTasks([newTask, ...tasks]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskPriority('medium');
      setIsAddingTask(false);
      setSuccess('Task created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error creating task:', err);
      setError('Failed to create task');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const updated = await updateTask(task.id, {
        completed: !task.completed,
      });
      setTasks(tasks.map(t => t.id === task.id ? updated : t));
      setSuccess(`Task marked as ${!task.completed ? 'completed' : 'active'}!`);
      setTimeout(() => setSuccess(''), 2000);
    } catch (err: any) {
      console.error('Error updating task:', err);
      setError('Failed to update task');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
      setSuccess('Task deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleUpdateTask = async (taskId: number, updates: Partial<Task>) => {
    try {
      const updated = await updateTask(taskId, updates);
      setTasks(tasks.map(t => t.id === taskId ? updated : t));
      setEditingTask(null);
      setSuccess('Task updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Error updating task:', err);
      setError('Failed to update task');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.filter(t => !t.completed).length;

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
        <Loader2 className={`w-12 h-12 animate-spin ${
          isDarkMode ? 'text-cyan-500' : 'text-blue-500'
        }`} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <AnimatedBackground />
      
      {/* Dock Component */}
      <Dock 
        items={dockItems}
        className={
          isDarkMode 
            ? 'bg-gray-900/90 border-gray-700 text-white' 
            : 'bg-white/90 border-gray-200 text-gray-900'
        }
        magnification={75}
        baseItemSize={56}
        panelHeight={72}
        dockHeight={280}
        distance={250}
        spring={{ mass: 0.1, stiffness: 150, damping: 12 }}
      />
      
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8 pb-32">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                My Tasks
              </h1>
              {user && (
                <p className="mt-2 text-sm text-gray-400">
                  Welcome, <span className="font-semibold text-cyan-400">{user.username}</span>
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-lg transition-all duration-300"
              >
                <LogOut className="w-4 h-4 inline-block mr-2" />
                Logout
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl text-center bg-gray-800/50">
              <p className="text-2xl font-bold text-cyan-400">{tasks.length}</p>
              <p className="text-sm text-gray-400">Total</p>
            </div>
            <div className="p-4 rounded-xl text-center bg-gray-800/50">
              <p className="text-2xl font-bold text-emerald-400">{completedTasks}</p>
              <p className="text-sm text-gray-400">Completed</p>
            </div>
            <div className="p-4 rounded-xl text-center bg-gray-800/50">
              <p className="text-2xl font-bold text-amber-400">{pendingTasks}</p>
              <p className="text-sm text-gray-400">Pending</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-8">
            {(['all', 'active', 'completed'] as FilterType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  filter === tab
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-cyan-400 hover:bg-gray-800/50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </header>

        {/* Add Task Card */}
        <div className="mb-8">
          <div className="rounded-2xl p-6 bg-gray-900/80 backdrop-blur-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-cyan-400">
                Add New Task
              </h2>
              <button
                onClick={() => setIsAddingTask(!isAddingTask)}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white"
              >
                {isAddingTask ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
              </button>
            </div>
            
            {isAddingTask && (
              <form onSubmit={handleCreateTask} className="space-y-4">
                <input
                  ref={inputRef}
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="What needs to be done?"
                  required
                />
                <textarea
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:border-cyan-500"
                  placeholder="Add some details (optional)"
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {(['low', 'medium', 'high'] as const).map((priority) => (
                      <button
                        key={priority}
                        type="button"
                        onClick={() => setNewTaskPriority(priority)}
                        className={`px-4 py-2 rounded-lg capitalize text-sm font-medium ${
                          newTaskPriority === priority
                            ? priority === 'high'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : priority === 'medium'
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                              : 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        {priority}
                      </button>
                    ))}
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:shadow-lg"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
              <Target className="w-12 h-12 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-300">
              No tasks found
            </h3>
            <p className="mb-6 text-gray-400">
              {filter === 'all' 
                ? 'Create your first task to get started!' 
                : `No ${filter} tasks at the moment.`}
            </p>
            <button
              onClick={() => setIsAddingTask(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:shadow-lg"
            >
              Create Your First Task
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTask}
                onUpdate={handleUpdateTask}
                isDarkMode={isDarkMode}
                isEditing={editingTask?.id === task.id}
                onStartEdit={() => setEditingTask(task)}
                onCancelEdit={() => setEditingTask(null)} viewMode={'list'}              />
            ))}
          </div>
        )}
        
        {/* Notifications */}
        <div className="fixed top-4 right-4 z-50 max-w-md">
          {error && (
            <div className="mb-4 rounded-xl bg-red-500/20 p-4 border border-red-500/30">
              <p className="text-red-400 text-sm font-medium flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </p>
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-xl bg-emerald-500/20 p-4 border border-emerald-500/30">
              <p className="text-emerald-400 text-sm font-medium flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                {success}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}