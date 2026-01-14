"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle,
  Sparkles,
  Shield,
  Key,
  ArrowRight,
  Target,
  Sun,
  Moon
} from 'lucide-react';
import { signup } from "../services/api";
import ThemeToggle from '../components/ThemeToggle';
import Toast from '../components/Toast';

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isHoveringSubmit, setIsHoveringSubmit] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('todo-theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  const calculatePasswordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength += 20;
    if (pass.length >= 12) strength += 10;
    if (/[A-Z]/.test(pass)) strength += 20;
    if (/[a-z]/.test(pass)) strength += 20;
    if (/[0-9]/.test(pass)) strength += 20;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 20;
    return Math.min(strength, 100);
  };

  const handlePasswordChange = (pass: string) => {
    setPassword(pass);
    setPasswordStrength(calculatePasswordStrength(pass));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return 'from-red-500 to-red-600';
    if (passwordStrength < 60) return 'from-orange-500 to-amber-600';
    if (passwordStrength < 80) return 'from-yellow-500 to-yellow-600';
    return 'from-emerald-500 to-green-600';
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength < 30) return 'Weak';
    if (passwordStrength < 60) return 'Fair';
    if (passwordStrength < 80) return 'Good';
    return 'Strong';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (passwordStrength < 60) {
      setError("Please choose a stronger password (at least 'Good' strength)");
      return;
    }
    
    setLoading(true);

    try {
      await signup(username, password);
      // Show success animation before redirect
      setTimeout(() => {
        router.push("/login?message=Account created successfully! Please login.");
      }, 1500);
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "Signup failed. Username may already exist.");
    } finally {
      setLoading(false);
    }
  };

  const passwordRequirements = [
    { text: "At least 8 characters", met: password.length >= 8, icon: Key },
    { text: "Contains uppercase letter", met: /[A-Z]/.test(password), icon: Shield },
    { text: "Contains lowercase letter", met: /[a-z]/.test(password), icon: Shield },
    { text: "Contains number", met: /[0-9]/.test(password), icon: Key },
    { text: "Contains special character", met: /[^A-Za-z0-9]/.test(password), icon: Sparkles },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-black text-gray-100' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900'
      }`}
    >
      {/* Animated background with noise */}
      <div className="fixed inset-0">
        <div className={`absolute inset-0 ${
          isDarkMode 
            ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800/30 via-black to-black'
            : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-gray-50 to-gray-100'
        }`} />
        <div className={`absolute inset-0 opacity-[0.015] noise-texture`} />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20' 
                  : 'bg-gradient-to-r from-purple-500/10 to-pink-500/10'
              }`}
              style={{
                width: Math.random() * 60 + 20,
                height: Math.random() * 60 + 20,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, Math.random() * 10 - 5, 0],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left column - Branding and benefits */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:flex flex-col justify-center"
          >
            <div className="space-y-8">
              {/* Logo */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                    className={`p-3 rounded-2xl ${
                      isDarkMode 
                        ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10' 
                        : 'bg-gradient-to-br from-purple-500/5 to-pink-500/5'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                        : 'bg-gradient-to-r from-purple-400 to-pink-400'
                    }`}>
                      <UserPlus className="w-6 h-6 text-white" />
                    </div>
                  </motion.div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                      Join TaskFlow
                    </h1>
                    <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Start your productivity journey today
                    </p>
                  </div>
                </div>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className={`text-xl mt-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Create your account and unlock powerful task management features
                </motion.p>
              </div>

              {/* Benefits list */}
              <div className="space-y-4">
                {[
                  { 
                    icon: Target, 
                    text: "Smart task organization", 
                    description: "Priority-based sorting and smart categorization",
                    color: "text-purple-500" 
                  },
                  { 
                    icon: Sparkles, 
                    text: "Premium themes", 
                    description: "Beautiful dark/light modes with smooth transitions",
                    color: "text-pink-500" 
                  },
                  { 
                    icon: CheckCircle, 
                    text: "Real-time progress", 
                    description: "Visual progress tracking and productivity insights",
                    color: "text-emerald-500" 
                  },
                  { 
                    icon: Shield, 
                    text: "Secure & private", 
                    description: "Your data is encrypted and protected",
                    color: "text-cyan-500" 
                  },
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={`p-4 rounded-xl ${
                      isDarkMode ? 'bg-gray-900/30 hover:bg-gray-800/50' : 'bg-gray-50 hover:bg-gray-100'
                    } transition-colors duration-300`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${benefit.color} ${
                        isDarkMode ? 'bg-opacity-10' : 'bg-opacity-5'
                      }`}>
                        <benefit.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {benefit.text}
                        </h3>
                        <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Security badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className={`p-6 rounded-2xl backdrop-blur-xl border ${
                  isDarkMode 
                    ? 'bg-gray-900/50 border-gray-800' 
                    : 'bg-white/50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Shield className={`w-8 h-8 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-500'}`} />
                  <div>
                    <h4 className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Secure & Private
                    </h4>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Your data is encrypted and never shared with third parties
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right column - Signup form */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col justify-center"
          >
            {/* Mobile logo */}
            <div className="lg:hidden mb-8">
              <div className="flex items-center justify-center gap-3">
                <div className={`p-3 rounded-2xl ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10' 
                    : 'bg-gradient-to-br from-purple-500/5 to-pink-500/5'
                }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                      : 'bg-gradient-to-r from-purple-400 to-pink-400'
                  }`}>
                    <UserPlus className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    TaskFlow
                  </h1>
                </div>
              </div>
            </div>

            {/* Signup card */}
            <div className={`rounded-2xl p-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-rose-500/20`}>
              <div className={`rounded-2xl p-8 lg:p-10 backdrop-blur-xl border ${
                isDarkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white/80 border-gray-200'
              } shadow-2xl`}>
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className={`inline-block p-3 rounded-2xl mb-4 ${
                      isDarkMode 
                        ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10' 
                        : 'bg-gradient-to-br from-purple-500/5 to-pink-500/5'
                    }`}
                  >
                    <UserPlus className={`w-8 h-8 ${
                      isDarkMode ? 'text-purple-400' : 'text-purple-500'
                    }`} />
                  </motion.div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    Create Account
                  </h2>
                  <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Join thousands of productive users
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Username field */}
                  <div>
                    <label htmlFor="username" className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Username
                    </label>
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      className="relative"
                    >
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <User className={`w-5 h-5 ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                      </div>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none transition-all duration-300 ${
                          isDarkMode
                            ? 'bg-gray-800/30 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/20'
                            : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/20'
                        }`}
                        placeholder="Choose a username (min. 3 characters)"
                        minLength={3}
                        maxLength={50}
                      />
                      {username.length >= 3 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2"
                        >
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        </motion.div>
                      )}
                    </motion.div>
                    {username && username.length < 3 && (
                      <p className="text-xs text-red-400 mt-1">
                        Username must be at least 3 characters
                      </p>
                    )}
                  </div>

                  {/* Password field */}
                  <div>
                    <label htmlFor="password" className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Password
                    </label>
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      className="relative"
                    >
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <Lock className={`w-5 h-5 ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        className={`w-full pl-12 pr-12 py-3 rounded-xl border focus:outline-none transition-all duration-300 ${
                          isDarkMode
                            ? 'bg-gray-800/30 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/20'
                            : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/20'
                        }`}
                        placeholder="Create a strong password"
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg ${
                          isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                        }`}
                      >
                        {showPassword ? (
                          <EyeOff className={`w-5 h-5 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                        ) : (
                          <Eye className={`w-5 h-5 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                        )}
                      </button>
                    </motion.div>
                    
                    {/* Password Strength */}
                    {password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <span className={`text-sm font-medium ${
                            getPasswordStrengthLabel() === 'Weak' ? 'text-red-400' :
                            getPasswordStrengthLabel() === 'Fair' ? 'text-amber-400' :
                            getPasswordStrengthLabel() === 'Good' ? 'text-yellow-400' :
                            'text-emerald-400'
                          }`}>
                            {getPasswordStrengthLabel()}
                          </span>
                          <span className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {passwordStrength}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden">
                          <div className={`h-full w-full ${
                            isDarkMode ? 'bg-gray-700/50' : 'bg-gray-200'
                          }`}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${passwordStrength}%` }}
                              transition={{ duration: 0.8, type: "spring" }}
                              className={`h-full bg-gradient-to-r ${getPasswordStrengthColor()}`}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Confirm Password field */}
                  <div>
                    <label htmlFor="confirm-password" className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Confirm Password
                    </label>
                    <motion.div
                      whileFocus={{ scale: 1.01 }}
                      className="relative"
                    >
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <Lock className={`w-5 h-5 ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                      </div>
                      <input
                        id="confirm-password"
                        name="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full pl-12 pr-12 py-3 rounded-xl border focus:outline-none transition-all duration-300 ${
                          isDarkMode
                            ? 'bg-gray-800/30 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/20'
                            : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/20'
                        }`}
                        placeholder="Confirm your password"
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg ${
                          isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                        }`}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className={`w-5 h-5 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                        ) : (
                          <Eye className={`w-5 h-5 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                        )}
                      </button>
                    </motion.div>
                    {password && confirmPassword && (
                      <AnimatePresence>
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2"
                        >
                          {password === confirmPassword ? (
                            <p className="text-emerald-400 text-sm flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Passwords match
                            </p>
                          ) : (
                            <p className="text-red-400 text-sm flex items-center">
                              <XCircle className="w-4 h-4 mr-2" />
                              Passwords do not match
                            </p>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    )}
                  </div>

                  {/* Password Requirements */}
                  <div className={`p-4 rounded-xl ${
                    isDarkMode ? 'bg-gray-800/30' : 'bg-gray-100/50'
                  }`}>
                    <p className={`text-sm font-medium mb-3 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Password Requirements:
                    </p>
                    <div className="space-y-2">
                      {passwordRequirements.map((req, index) => {
                        const Icon = req.icon;
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-center gap-3 ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}
                          >
                            <div className={`p-1 rounded ${
                              req.met 
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : isDarkMode 
                                  ? 'bg-gray-700 text-gray-500'
                                  : 'bg-gray-200 text-gray-400'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className={`text-sm ${req.met ? 'text-emerald-400' : ''}`}>
                              {req.text}
                            </span>
                            {req.met ? (
                              <CheckCircle className="w-4 h-4 text-emerald-400 ml-auto" />
                            ) : (
                              <div className="w-4 h-4 ml-auto rounded-full border border-gray-500" />
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="flex items-start">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      className="h-4 w-4 mt-1 rounded border-gray-300 text-purple-500 focus:ring-purple-500"
                    />
                    <label htmlFor="terms" className={`ml-2 text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      I agree to the{' '}
                      <Link href="/terms" className="text-purple-400 hover:text-purple-300">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  {/* Submit button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    onHoverStart={() => setIsHoveringSubmit(true)}
                    onHoverEnd={() => setIsHoveringSubmit(false)}
                    whileHover={!loading ? { scale: 1.02 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 relative overflow-hidden ${
                      loading
                        ? 'bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:shadow-lg hover:shadow-purple-500/25'
                    } text-white`}
                  >
                    {/* Animated background */}
                    {!loading && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
                        initial={{ x: '-100%' }}
                        animate={{ x: isHoveringSubmit ? '100%' : '-100%' }}
                        transition={{ duration: 0.6 }}
                      />
                    )}
                    
                    <span className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Creating your account...
                        </>
                      ) : (
                        <>
                          Get Started
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </span>
                  </motion.button>
                </form>

                {/* Login link */}
                <div className={`mt-8 pt-6 border-t ${
                  isDarkMode ? 'border-gray-800' : 'border-gray-200'
                }`}>
                  <p className={`text-center text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Already have an account?{' '}
                    <Link
                      href="/login"
                      className="font-medium bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent hover:from-cyan-500 hover:to-blue-600 transition-all duration-300"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>

                {/* Theme toggle */}
                <div className="flex justify-center mt-6">
                  <ThemeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
                </div>
              </div>
            </div>

            {/* Footer note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className={`text-center text-xs mt-6 ${
                isDarkMode ? 'text-gray-600' : 'text-gray-500'
              }`}
            >
              Free forever for personal use. No credit card required.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Toast notifications */}
      <Toast
        message={error}
        type="error"
        isVisible={!!error}
        onClose={() => setError('')}
      />

      {/* Add CSS for noise texture */}
      <style jsx global>{`
        .noise-texture::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.015;
          pointer-events: none;
        }
      `}</style>
    </motion.div>
  );
}