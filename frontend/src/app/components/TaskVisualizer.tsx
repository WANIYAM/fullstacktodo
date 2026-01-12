"use client";

import { motion } from 'framer-motion';
import { Check, Edit2, Trash2, Target, Zap, Clock } from 'lucide-react';
import type { Task } from '../page';

interface TaskVisualizerProps {
  tasks: Task[];
  mode: 'timeline' | 'orbit';
  onToggleComplete: (task: Task) => void;
  onDelete: (id: number, title: string) => void;
  onEdit: (task: Task) => void;
}

const TaskVisualizer = ({ tasks, mode, onToggleComplete, onDelete, onEdit }: TaskVisualizerProps) => {
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

export default TaskVisualizer;