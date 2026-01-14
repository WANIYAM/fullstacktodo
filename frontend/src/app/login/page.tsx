"use client";
import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogIn, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle, 
  AlertCircle,
  Sun,
  Moon,
  ArrowRight,
  Zap,
  Target
} from 'lucide-react';
import { login } from "../services/api";
import ThemeToggle from '../components/ThemeToggle';
import Toast from '../components/Toast';

// Separate component that uses useSearchParams
function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isHoveringSubmit, setIsHoveringSubmit] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('todo-theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }

    const message = searchParams.get('message');
    if (message) {
      setSuccess(message);
      setTimeout(() => setSuccess(""), 5000);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await login(username, password);
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setUsername("demo");
    setPassword("password");
    setTimeout(() => {
      handleSubmit(new Event('submit') as any);
    }, 300);
  };

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
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20' 
                  : 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10'
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
          {/* Left column - Branding and features */}
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
                        ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10' 
                        : 'bg-gradient-to-br from-cyan-500/5 to-blue-500/5'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500' 
                        : 'bg-gradient-to-r from-cyan-400 to-blue-400'
                    }`}>
                      <Target className="w-6 h-6 text-white" />
                    </div>
                  </motion.div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                      TaskFlow
                    </h1>
                    <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Premium Productivity Platform
                    </p>
                  </div>
                </div>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className={`text-xl mt-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Transform your productivity with our modern task management solution
                </motion.p>
              </div>

              {/* Features list */}
              <div className="space-y-4">
                {[
                  { icon: Zap, text: "Smart task prioritization", color: "text-amber-500" },
                  { icon: Sparkles, text: "Beautiful dark/light themes", color: "text-purple-500" },
                  { icon: CheckCircle, text: "Real-time progress tracking", color: "text-emerald-500" },
                  { icon: Target, text: "Focus mode for deep work", color: "text-cyan-500" },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className={`p-2 rounded-lg ${feature.color} ${
                      isDarkMode ? 'bg-opacity-10' : 'bg-opacity-5'
                    }`}>
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {feature.text}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
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
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-cyan-400' : 'text-blue-500'}`}>
                      10K+
                    </div>
                    <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Users
                    </div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-500'}`}>
                      99%
                    </div>
                    <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Satisfaction
                    </div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-500'}`}>
                      24/7
                    </div>
                    <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Availability
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right column - Login form */}
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
                    ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10' 
                    : 'bg-gradient-to-br from-cyan-500/5 to-blue-500/5'
                }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500' 
                      : 'bg-gradient-to-r from-cyan-400 to-blue-400'
                  }`}>
                    <Target className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    TaskFlow
                  </h1>
                </div>
              </div>
            </div>

            {/* Login card */}
            <div className={`rounded-2xl p-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-blue-500/20`}>
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
                        ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10' 
                        : 'bg-gradient-to-br from-cyan-500/5 to-blue-500/5'
                    }`}
                  >
                    <LogIn className={`w-8 h-8 ${
                      isDarkMode ? 'text-cyan-400' : 'text-blue-500'
                    }`} />
                  </motion.div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Welcome Back
                  </h2>
                  <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Sign in to continue to your workspace
                  </p>
                </div>

                {/* Demo button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDemoLogin}
                  className={`w-full mb-6 py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    isDarkMode
                      ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-400 hover:from-amber-500/20 hover:to-orange-500/20 border border-amber-500/30'
                      : 'bg-gradient-to-r from-amber-500/5 to-orange-500/5 text-amber-600 hover:from-amber-500/10 hover:to-orange-500/10 border border-amber-500/20'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  Try Demo Account
                </motion.button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className={`absolute inset-0 flex items-center ${
                    isDarkMode ? 'border-gray-800' : 'border-gray-200'
                  }`}>
                    <div className="w-full border-t"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className={`px-3 ${
                      isDarkMode ? 'bg-gray-900 text-gray-500' : 'bg-white text-gray-500'
                    }`}>
                      Or sign in with credentials
                    </span>
                  </div>
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
                            ? 'bg-gray-800/30 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:shadow-lg focus:shadow-cyan-500/20'
                            : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20'
                        }`}
                        placeholder="Enter your username"
                      />
                    </motion.div>
                  </div>

                  {/* Password field */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="password" className={`text-sm font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Password
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-xs bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent hover:from-cyan-500 hover:to-blue-600 transition-all duration-300"
                      >
                        Forgot password?
                      </Link>
                    </div>
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
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full pl-12 pr-12 py-3 rounded-xl border focus:outline-none transition-all duration-300 ${
                          isDarkMode
                            ? 'bg-gray-800/30 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:shadow-lg focus:shadow-cyan-500/20'
                            : 'bg-white/50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:shadow-lg focus:shadow-blue-500/20'
                        }`}
                        placeholder="Enter your password"
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
                  </div>

                  {/* Remember me */}
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-cyan-500 focus:ring-cyan-500"
                    />
                    <label htmlFor="remember-me" className={`ml-2 text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Remember me for 30 days
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
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 hover:shadow-lg hover:shadow-cyan-500/25'
                    } text-white`}
                  >
                    {!loading && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600"
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
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </span>
                  </motion.button>
                </form>

                {/* Sign up link */}
                <div className={`mt-8 pt-6 border-t ${
                  isDarkMode ? 'border-gray-800' : 'border-gray-200'
                }`}>
                  <p className={`text-center text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Don't have an account?{' '}
                    <Link
                      href="/signup"
                      className="font-medium bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent hover:from-cyan-500 hover:to-blue-600 transition-all duration-300"
                    >
                      Create one now
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
              By signing in, you agree to our Terms of Service and Privacy Policy
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
      <Toast
        message={success}
        type="success"
        isVisible={!!success}
        onClose={() => setSuccess('')}
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

// Main component with Suspense wrapper
export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-3 border-cyan-500/20 border-t-cyan-500 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}