"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({ message, type, isVisible, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <div className={`rounded-xl p-4 backdrop-blur-xl border shadow-2xl ${
            type === 'success'
              ? 'bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-emerald-500/30'
              : 'bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-500/30'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${
                type === 'success' ? 'bg-emerald-500/20' : 'bg-red-500/20'
              }`}>
                {type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  type === 'success' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {message}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}