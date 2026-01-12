"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  Check, 
  Edit2, 
  Trash2, 
  X, 
  Save, 
  Plus,
  AlertCircle,
  CheckCircle,
  Loader2,
  Sun,
  Moon,
  Calendar,
  Clock,
  Sparkles,
  Zap,
  Target,
  Orbit
} from 'lucide-react';

type Task = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  owner_id: number;
  created_at?: string;
  priority?: number;
};

type FilterType = 'all' | 'active' | 'completed';
type VisualizationMode = 'list' | 'timeline' | 'orbit';

const TaskVisualizer = ({ 
  tasks, 
  mode, 
  onToggleComplete, 
  onDelete, 
  onEdit 
}: { 
  tasks: Task[];
  mode: VisualizationMode;
  onToggleComplete: (task: Task) => void;
  onDelete: (id: number, title: string) => void;
  onEdit: (task: Task) => void;
}) => {
  if (mode === 'timeline') {
    return (
      <div className="relative py-12">
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-purple-500 to-blue-500 transform -translate-x-1/2" />
        
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className={`relative mb-12 ${index % 2 === 0 ? 'pr-1/2' : 'pl-1/2'}`}
          >
            <div className={`p-6 rounded-2xl backdrop-blur-lg border ${
              task.completed
                ? 'bg-gradient-to-br from-emerald-900/20 to-green-900/20 border-emerald-500/30'
                : 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-cyan-500/30'
            } ${index % 2 === 0 ? 'ml-auto' : ''}`} style={{ width: '90%' }}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className={`text-xl font-semibold mb-2 ${
                    task.completed ? 'text-emerald-300' : 'text-white'
                  }`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-gray-400 text-sm mb-3">{task.description}</p>
                  )}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => onToggleComplete(task)}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        task.completed
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-cyan-500/20 text-cyan-300'
                      }`}
                    >
                      {task.completed ? 'Completed' : 'Mark Complete'}
                    </button>
                    <button
                      onClick={() => onEdit(task)}
                      className="text-gray-400 hover:text-cyan-300"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-2">Priority {task.priority || 1}</div>
                  <Clock className="w-4 h-4 text-gray-600 ml-auto" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  // Orbit View
  const completedTasks = tasks.filter(t => t.completed);
  const activeTasks = tasks.filter(t => !t.completed);

  return (
    <div className="relative h-[600px] flex items-center justify-center">
      {/* Central sun */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: 360
        }}
        transition={{
          scale: { duration: 2, repeat: Infinity },
          rotate: { duration: 20, repeat: Infinity, ease: "linear" }
        }}
        className="absolute w-32 h-32 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full shadow-2xl shadow-yellow-500/50"
      >
        <Target className="w-16 h-16 text-white absolute inset-0 m-auto" />
      </motion.div>

      {/* Active tasks orbit */}
      {activeTasks.map((task, index) => {
        const angle = (index / activeTasks.length) * Math.PI * 2;
        const radius = 200;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x,
              y,
              rotate: 360
            }}
            transition={{
              x: { type: "spring", stiffness: 50 },
              y: { type: "spring", stiffness: 50 },
              rotate: { duration: 10, repeat: Infinity, ease: "linear" },
              delay: index * 0.2
            }}
            className="absolute"
          >
            <div className="p-4 w-48 bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl border border-cyan-500/30 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <button
                  onClick={() => onToggleComplete(task)}
                  className="w-6 h-6 rounded-full border-2 border-cyan-500/50 flex items-center justify-center"
                >
                  {task.completed && <Check className="w-3 h-3 text-cyan-400" />}
                </button>
                <h4 className="text-white font-medium truncate">{task.title}</h4>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => onEdit(task)}
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(task.id, task.title)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Completed tasks orbit */}
      {completedTasks.map((task, index) => {
        const angle = (index / completedTasks.length) * Math.PI * 2;
        const radius = 300;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x,
              y,
              rotate: -360
            }}
            transition={{
              x: { type: "spring", stiffness: 30 },
              y: { type: "spring", stiffness: 30 },
              rotate: { duration: 15, repeat: Infinity, ease: "linear" },
              delay: index * 0.3
            }}
            className="absolute"
          >
            <div className="p-3 w-40 bg-gradient-to-br from-emerald-900/40 to-green-900/40 backdrop-blur-lg rounded-xl border border-emerald-500/30 opacity-80">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <p className="text-emerald-300 text-sm truncate">{task.title}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

const Page = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDesc, setEditingDesc] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{isOpen: boolean; taskId: number | null; taskTitle: string}>({
    isOpen: false,
    taskId: null,
    taskTitle: ''
  });
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isExpanded, setIsExpanded] = useState(false);
  const [taskCountdown, setTaskCountdown] = useState<Record<number, number>>({});
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [visualizationMode, setVisualizationMode] = useState<VisualizationMode>('list');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const BACKEND_URL = 'http://127.0.0.1:8000';
  const FAKE_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30';

  // Initialize countdown timers for task urgency glow
  useEffect(() => {
    const interval = setInterval(() => {
      setTaskCountdown(prev => {
        const newCountdown = { ...prev };
        tasks.forEach(task => {
          if (!task.completed) {
            newCountdown[task.id] = (newCountdown[task.id] || 0) + 1;
            if (newCountdown[task.id] > 360) newCountdown[task.id] = 0;
          }
        });
        return newCountdown;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [tasks]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/tasks/`, {
        headers: {
          'Authorization': `Bearer ${FAKE_JWT}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data: Task[] = await response.json();
      setTasks(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'active') return !task.completed;
    if (activeFilter === 'completed') return task.completed;
    return true;
  });

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const response = await fetch(`${BACKEND_URL}/tasks/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${FAKE_JWT}`,
        },
        body: JSON.stringify({ 
          title: newTask,
          description: newDescription.trim() || null,
          completed: false,
          priority: Math.floor(Math.random() * 3) + 1
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      
      setNewTask('');
      setNewDescription('');
      setIsExpanded(false);
      await fetchTasks();
      setSuccess('Task created with cosmic energy! ✨');
      setTimeout(() => setSuccess(null), 3000);
      
      inputRef.current?.focus();
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${FAKE_JWT}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      
      await fetchTasks();
      setDeleteDialog({ isOpen: false, taskId: null, taskTitle: '' });
      setSuccess('Task vanished into the void! 🌌');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const response = await fetch(`${BACKEND_URL}/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${FAKE_JWT}`,
        },
        body: JSON.stringify({ 
          completed: !task.completed 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      
      await fetchTasks();
      setSuccess(`Task ${!task.completed ? 'completed with stellar precision! 🌟' : 're-activated! 🔄'}`);
      setTimeout(() => setSuccess(null), 2000);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleStartEdit = (task: Task) => {
    setEditingId(task.id);
    setEditingTitle(task.title);
    setEditingDesc(task.description || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle('');
    setEditingDesc('');
  };

  const handleSaveEdit = async (taskId: number) => {
    if (!editingTitle.trim()) return;

    try {
      const response = await fetch(`${BACKEND_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${FAKE_JWT}`,
        },
        body: JSON.stringify({ 
          title: editingTitle,
          description: editingDesc.trim() || null
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      
      setEditingId(null);
      setEditingTitle('');
      setEditingDesc('');
      await fetchTasks();
      setSuccess('Task updated in the cosmic database! 🚀');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const openDeleteDialog = (taskId: number, taskTitle: string) => {
    setDeleteDialog({
      isOpen: true,
      taskId,
      taskTitle
    });
  };

  const getTaskGlow = (taskId: number) => {
    const count = taskCountdown[taskId] || 0;
    const intensity = Math.sin(count * 0.1) * 0.5 + 0.5;
    return `rgba(0, 230, 255, ${intensity * 0.3})`;
  };

  const getPriorityColor = (priority: number = 1) => {
    switch(priority) {
      case 3: return 'from-red-500 to-pink-600';
      case 2: return 'from-yellow-500 to-orange-600';
      default: return 'from-blue-500 to-cyan-600';
    }
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 relative overflow-hidden transition-colors duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100'
    }`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              isDarkMode ? 'bg-cyan-500/20' : 'bg-blue-500/10'
            }`}
            initial={{ 
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
              opacity: 0
            }}
            animate={{ 
              x: [null, `calc(${Math.random() * 100}% - 100px)`],
              y: [null, `calc(${Math.random() * 100}% - 100px)`],
              opacity: [0, 0.3, 0]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto relative z-10"
        ref={containerRef}
      >
        {/* Header */}
        <header className="mb-12 pt-8">
          <div className="flex justify-between items-center mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className={`absolute inset-0 border-2 rounded-full ${
                    isDarkMode ? 'border-cyan-500/30' : 'border-blue-500/30'
                  }`}
                />
                <Zap className={`w-8 h-8 ${isDarkMode ? 'text-cyan-400' : 'text-blue-500'}`} />
              </div>
              <h1 className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${
                isDarkMode 
                  ? 'from-cyan-400 via-blue-400 to-purple-400' 
                  : 'from-blue-600 via-purple-600 to-pink-600'
              } bg-clip-text text-transparent`}>
                Quantum Tasks
              </h1>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`relative p-3 rounded-2xl transition-all shadow-2xl border ${
                isDarkMode
                  ? 'bg-gradient-to-br from-gray-800 to-black border-cyan-500/20 hover:border-cyan-500/40 shadow-cyan-500/10'
                  : 'bg-gradient-to-br from-white to-blue-50 border-yellow-500/20 hover:border-yellow-500/40 shadow-yellow-500/10'
              }`}
            >
              <motion.div
                animate={{ rotate: isDarkMode ? 0 : 180 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {isDarkMode ? 
                  <Sun className="w-6 h-6 text-yellow-300" /> : 
                  <Moon className="w-6 h-6 text-blue-600" />
                }
              </motion.div>
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {(['all', 'active', 'completed'] as FilterType[]).map((filter) => (
              <motion.button
                key={filter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeFilter === filter
                    ? isDarkMode
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                    : isDarkMode
                    ? 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-700/50'
                    : 'bg-white/70 text-gray-600 hover:text-blue-600 hover:bg-white border border-gray-300'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </motion.button>
            ))}
          </motion.div>

          {/* Visualization Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex gap-4 mb-6"
          >
            <button
              onClick={() => setVisualizationMode('list')}
              className={`px-4 py-2 rounded-lg transition-all ${
                visualizationMode === 'list' 
                  ? isDarkMode
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-blue-500/20 text-blue-600 border border-blue-500/40'
                  : isDarkMode
                  ? 'text-gray-500 hover:text-gray-300'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setVisualizationMode('timeline')}
              className={`px-4 py-2 rounded-lg transition-all ${
                visualizationMode === 'timeline'
                  ? isDarkMode
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'bg-purple-500/20 text-purple-600 border border-purple-500/40'
                  : isDarkMode
                  ? 'text-gray-500 hover:text-gray-300'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setVisualizationMode('orbit')}
              className={`px-4 py-2 rounded-lg transition-all ${
                visualizationMode === 'orbit'
                  ? isDarkMode
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    : 'bg-blue-500/20 text-blue-600 border border-blue-500/40'
                  : isDarkMode
                  ? 'text-gray-500 hover:text-gray-300'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Orbit className="w-4 h-4 inline mr-2" />
              Orbit View
            </button>
          </motion.div>
        </header>

        {/* Notifications */}
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className={`mb-4 p-4 backdrop-blur-lg border-l-4 border-red-500 rounded-xl shadow-2xl ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-red-900/90 to-red-800/90'
                    : 'bg-gradient-to-r from-red-50 to-red-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <AlertCircle className={`w-5 h-5 flex-shrink-0 ${
                    isDarkMode ? 'text-red-300' : 'text-red-500'
                  }`} />
                  <p className={isDarkMode ? 'text-red-100 font-medium' : 'text-red-700 font-medium'}>
                    {error}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className={`mb-4 p-4 backdrop-blur-lg border-l-4 border-emerald-500 rounded-xl shadow-2xl ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-green-900/90 to-emerald-800/90'
                    : 'bg-gradient-to-r from-emerald-50 to-green-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className={`w-5 h-5 flex-shrink-0 ${
                    isDarkMode ? 'text-emerald-300' : 'text-emerald-500'
                  }`} />
                  <p className={isDarkMode ? 'text-emerald-100 font-medium' : 'text-emerald-700 font-medium'}>
                    {success}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Add Task Form */}
        <LayoutGroup>
          <motion.form 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleCreateTask}
            className={`mb-12 backdrop-blur-xl p-6 rounded-3xl border shadow-2xl ${
              isDarkMode
                ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-cyan-500/20 shadow-cyan-500/5'
                : 'bg-gradient-to-br from-white/80 to-blue-50/80 border-blue-500/30 shadow-blue-500/5'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Plus className={`w-5 h-5 ${isDarkMode ? 'text-cyan-400' : 'text-blue-500'}`} />
                <input
                  ref={inputRef}
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Enter a cosmic task..."
                  className={`flex-1 bg-transparent text-xl focus:outline-none ${
                    isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                  }`}
                  onFocus={() => setIsExpanded(true)}
                />
              </div>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <textarea
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Add some stardust details... (optional)"
                      className={`w-full rounded-xl p-4 placeholder-gray-600 focus:outline-none focus:ring-2 resize-none border ${
                        isDarkMode
                          ? 'bg-gray-900/50 border-gray-700/50 text-gray-300 focus:border-cyan-500/50 focus:ring-cyan-500/20'
                          : 'bg-white/50 border-gray-300/50 text-gray-700 focus:border-blue-500/50 focus:ring-blue-500/20'
                      }`}
                      rows={3}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.div 
                layout
                className="flex justify-between items-center pt-2"
              >
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`text-sm transition-colors ${
                    isDarkMode ? 'text-gray-500 hover:text-cyan-400' : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  {isExpanded ? 'Hide details' : 'Add details'}
                </button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!newTask.trim()}
                  className={`px-8 py-3 text-white rounded-xl hover:from-cyan-500 hover:to-blue-600 transition-all font-semibold shadow-lg hover:shadow-cyan-500/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 ${
                    isDarkMode
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-700 shadow-cyan-500/20'
                      : 'bg-gradient-to-r from-blue-600 to-purple-700 shadow-blue-500/20'
                  }`}
                >
                  <Sparkles className="w-5 h-5" />
                  Create Quantum Task
                </motion.button>
              </motion.div>
            </div>
          </motion.form>
        </LayoutGroup>

        {/* Tasks List / Visualization */}
        {visualizationMode === 'list' ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            {loading ? (
              <div className="text-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className={`w-16 h-16 border-4 rounded-full mx-auto mb-6 ${
                    isDarkMode 
                      ? 'border-cyan-500/30 border-t-cyan-500'
                      : 'border-blue-500/30 border-t-blue-500'
                  }`}
                />
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Loading cosmic tasks...
                </p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`text-center py-20 backdrop-blur-xl rounded-3xl border ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-cyan-500/10'
                    : 'bg-gradient-to-br from-white/50 to-blue-50/50 border-blue-500/10'
                }`}
              >
                <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-cyan-900/20 to-blue-900/20'
                    : 'bg-gradient-to-br from-blue-100 to-cyan-100'
                }`}>
                  <Target className={`w-16 h-16 ${
                    isDarkMode ? 'text-cyan-500/50' : 'text-blue-500/50'
                  }`} />
                </div>
                <h3 className={`text-2xl font-semibold mb-3 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Zero tasks in orbit
                </h3>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Launch your first task into the quantum field above. The cosmos awaits! 🚀
                </p>
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      scale: 1,
                      boxShadow: isDarkMode ? `0 0 40px ${getTaskGlow(task.id)}` : 'none'
                    }}
                    exit={{ opacity: 0, x: -100, scale: 0.8 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200,
                      damping: 25,
                      delay: index * 0.1
                    }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className={`group p-6 rounded-2xl backdrop-blur-lg border ${
                      task.completed
                        ? isDarkMode
                          ? 'bg-gradient-to-br from-emerald-900/20 to-green-900/20 border-emerald-500/30'
                          : 'bg-gradient-to-br from-emerald-100/50 to-green-100/50 border-emerald-500/30'
                        : isDarkMode
                        ? 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-cyan-500/30'
                        : 'bg-gradient-to-br from-white/60 to-blue-50/60 border-blue-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox with animation */}
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleToggleComplete(task)}
                        className={`relative flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${
                          task.completed
                            ? 'bg-gradient-to-br from-emerald-500 to-green-600'
                            : isDarkMode
                            ? 'bg-gradient-to-br from-gray-700 to-gray-800 border border-cyan-500/50'
                            : 'bg-gradient-to-br from-gray-200 to-gray-300 border border-blue-500/50'
                        }`}
                      >
                        {task.completed && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <Check className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </motion.button>

                      {/* Task Content */}
                      <div className="flex-1 min-w-0">
                        {editingId === task.id ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit(task.id);
                                if (e.key === 'Escape') handleCancelEdit();
                              }}
                              className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 ${
                                isDarkMode
                                  ? 'bg-gray-900/70 border-cyan-500/50 text-white focus:ring-cyan-500/30'
                                  : 'bg-white/70 border-blue-500/50 text-gray-900 focus:ring-blue-500/30'
                              }`}
                              autoFocus
                            />
                            <textarea
                              value={editingDesc}
                              onChange={(e) => setEditingDesc(e.target.value)}
                              className={`w-full p-3 border rounded-xl resize-none ${
                                isDarkMode
                                  ? 'bg-gray-900/70 border-cyan-500/30 text-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/20'
                                  : 'bg-white/70 border-blue-500/30 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                              }`}
                              rows={2}
                            />
                          </div>
                        ) : (
                          <div>
                            <motion.p
                              className={`text-lg font-medium ${
                                task.completed
                                  ? isDarkMode
                                    ? 'line-through text-emerald-300/70'
                                    : 'line-through text-emerald-600/70'
                                  : isDarkMode
                                  ? 'text-white'
                                  : 'text-gray-900'
                              }`}
                            >
                              {task.title}
                            </motion.p>
                            {task.description && (
                              <motion.p 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className={`mt-2 text-sm ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}
                              >
                                {task.description}
                              </motion.p>
                            )}
                            <div className="flex items-center gap-4 mt-3">
                              <span className={`text-xs px-3 py-1 rounded-full bg-gradient-to-r ${getPriorityColor(task.priority)} text-white`}>
                                Priority {task.priority}
                              </span>
                              {task.created_at && (
                                <span className={`text-xs flex items-center gap-1 ${
                                  isDarkMode ? 'text-gray-500' : 'text-gray-600'
                                }`}>
                                  <Calendar className="w-3 h-3" />
                                  {new Date(task.created_at).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {editingId === task.id ? (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleSaveEdit(task.id)}
                              disabled={!editingTitle.trim()}
                              className={`p-2 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                                isDarkMode
                                  ? 'bg-emerald-600 shadow-emerald-500/20'
                                  : 'bg-emerald-500 shadow-emerald-500/30'
                              }`}
                            >
                              <Save className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={handleCancelEdit}
                              className={`p-2 text-white rounded-lg hover:bg-gray-600 transition-colors shadow-lg ${
                                isDarkMode ? 'bg-gray-700' : 'bg-gray-600'
                              }`}
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                          </>
                        ) : (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleStartEdit(task)}
                              className={`p-2 rounded-lg hover:bg-cyan-500/30 transition-colors opacity-0 group-hover:opacity-100 border ${
                                isDarkMode
                                  ? 'bg-cyan-600/20 text-cyan-300 border-cyan-500/30'
                                  : 'bg-cyan-500/20 text-cyan-600 border-cyan-500/30'
                              }`}
                            >
                              <Edit2 className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openDeleteDialog(task.id, task.title)}
                              className={`p-2 rounded-lg hover:bg-red-500/30 transition-colors opacity-0 group-hover:opacity-100 border ${
                                isDarkMode
                                  ? 'bg-red-600/20 text-red-300 border-red-500/30'
                                  : 'bg-red-500/20 text-red-600 border-red-500/30'
                              }`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </motion.div>
        ) : (
          <TaskVisualizer 
            tasks={filteredTasks} 
            mode={visualizationMode}
            onToggleComplete={handleToggleComplete}
            onDelete={openDeleteDialog}
            onEdit={handleStartEdit}
          />
        )}

        {/* Stats Panel */}
        {tasks.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`mt-12 p-6 backdrop-blur-xl rounded-3xl border ${
              isDarkMode
                ? 'bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-cyan-500/20'
                : 'bg-gradient-to-br from-white/50 to-blue-50/50 border-blue-500/20'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`text-center p-4 rounded-2xl border ${
                isDarkMode
                  ? 'bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-cyan-500/20'
                  : 'bg-gradient-to-br from-blue-100/50 to-cyan-100/50 border-cyan-500/30'
              }`}>
                <p className={`text-4xl font-bold mb-2 ${
                  isDarkMode ? 'text-cyan-300' : 'text-cyan-600'
                }`}>
                  {tasks.length}
                </p>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Total in Orbit
                </p>
              </div>
              <div className={`text-center p-4 rounded-2xl border ${
                isDarkMode
                  ? 'bg-gradient-to-br from-emerald-900/20 to-green-900/20 border-emerald-500/20'
                  : 'bg-gradient-to-br from-emerald-100/50 to-green-100/50 border-emerald-500/30'
              }`}>
                <p className={`text-4xl font-bold mb-2 ${
                  isDarkMode ? 'text-emerald-300' : 'text-emerald-600'
                }`}>
                  {tasks.filter(t => t.completed).length}
                </p>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Mission Complete
                </p>
              </div>
              <div className={`text-center p-4 rounded-2xl border ${
                isDarkMode
                  ? 'bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/20'
                  : 'bg-gradient-to-br from-purple-100/50 to-pink-100/50 border-purple-500/30'
              }`}>
                <p className={`text-4xl font-bold mb-2 ${
                  isDarkMode ? 'text-purple-300' : 'text-purple-600'
                }`}>
                  {tasks.filter(t => !t.completed).length}
                </p>
                <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                  Active Missions
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteDialog.isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={() => setDeleteDialog({ isOpen: false, taskId: null, taskTitle: '' })}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 flex items-center justify-center p-4 z-50"
            >
              <div 
                className={`rounded-3xl shadow-2xl border max-w-md w-full p-8 ${
                  isDarkMode
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-red-500/30'
                    : 'bg-gradient-to-br from-white to-red-50 border-red-500/30'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border ${
                    isDarkMode
                      ? 'bg-gradient-to-br from-red-900/30 to-red-800/30 border-red-500/50'
                      : 'bg-gradient-to-br from-red-100 to-red-200 border-red-500/50'
                  }`}
                >
                  <AlertCircle className="w-10 h-10 text-red-500" />
                </motion.div>
                <h3 className={`text-2xl font-bold text-center mb-3 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Warp Drive Engage?
                </h3>
                <p className={`text-center mb-8 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Task "<span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {deleteDialog.taskTitle}
                  </span>" will be ejected into deep space. No recovery possible.
                </p>
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDeleteDialog({ isOpen: false, taskId: null, taskTitle: '' })}
                    className={`flex-1 px-6 py-3 border-2 rounded-xl transition-all font-medium ${
                      isDarkMode
                        ? 'border-gray-700 text-gray-300 hover:bg-gray-800/50'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Abort Mission
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => deleteDialog.taskId && handleDeleteTask(deleteDialog.taskId)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-500 hover:to-red-600 transition-all font-medium shadow-lg shadow-red-500/20"
                  >
                    Confirm Ejection
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className={`mt-16 text-center text-sm ${
          isDarkMode ? 'text-gray-500' : 'text-gray-600'
        }`}
      >
        <p className="mb-2">Quantum Task Manager v1.0 • Built with cosmic energy ⚡</p>
        <p className={isDarkMode ? 'text-gray-600' : 'text-gray-500'}>
          {tasks.length} tasks currently in orbit • {tasks.filter(t => t.completed).length} completed missions
        </p>
      </motion.footer>
    </div>
  );
};

export default Page;