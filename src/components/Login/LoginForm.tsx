import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
//import collegeLogo from "../../assets/logo.jpg";
import collegeLogo from "../../assets/ACH_logo.jpg";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      // If login is successful, the AuthContext will handle the redirect
    } catch (err: any) {
      // Extract error message from various possible error structures
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Invalid email or password. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

        {/* Watermark logo with better styling */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={collegeLogo}
            alt="Watermark"
            className="opacity-[0.08] w-full max-w-4xl object-contain animate-pulse-slow"
          />
        </div>
      </div>

      {/* Decorative grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <div className="max-w-md w-full relative z-10 space-y-8 animate-fade-in">
        {/* Logo and Header Section */}
        <div className="text-center transform transition-all duration-300 hover:scale-105">
          <div className="flex justify-center mb-4">
            <div className="relative group">
              {/* Glowing effect around logo */}
              <div className="absolute -inset-2 bg-gradient-to-r from-rose-400 via-amber-400 to-orange-400 rounded-full opacity-15 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>

              {/* Logo container with gradient border */}
              <div className="relative p-2 bg-gradient-to-br from-white to-rose-50 rounded-full shadow-2xl ring-4 ring-rose-100/50">
                <div className="p-2 bg-white rounded-full">
                  <img
                    src={collegeLogo}
                    alt="Ananda College Logo"
                    className="h-28 w-28 object-cover rounded-full shadow-lg"
                  />
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg animate-ping"></div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-rose-700 via-rose-600 to-amber-600 bg-clip-text text-transparent mb-2 tracking-tight">
            Ananda College
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-rose-300 to-transparent"></div>
            <p className="text-sm font-medium text-rose-700/80 tracking-wide uppercase">
              Hostel Management System
            </p>
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-rose-300 to-transparent"></div>
          </div>
        </div>

        {/* Login Card */}
        <div className="relative group">
          {/* Card glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-400 via-amber-400 to-orange-400 rounded-2xl opacity-15 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>

          <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/50">
            {/* Decorative top accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-orange-500 rounded-t-2xl"></div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative group/input">
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-400/15 to-amber-400/15 rounded-xl opacity-0 group-hover/input:opacity-100 transition-opacity duration-300 blur-sm"></div>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-4 h-5 w-5 text-gray-400 group-focus-within/input:text-rose-400 transition-colors duration-200 z-10" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-12 pr-4 w-full py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-400 bg-white/50 backdrop-blur-sm transition-all duration-200 placeholder:text-gray-400 text-gray-700 font-medium outline-none"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative group/input">
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-400/15 to-amber-400/15 rounded-xl opacity-0 group-hover/input:opacity-100 transition-opacity duration-300 blur-sm"></div>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-4 h-5 w-5 text-gray-400 group-focus-within/input:text-rose-400 transition-colors duration-200 z-10" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-12 pr-12 w-full py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-400 bg-white/50 backdrop-blur-sm transition-all duration-200 placeholder:text-gray-400 text-gray-700 font-medium outline-none"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-gray-400 hover:text-rose-500 transition-colors duration-200 p-1 rounded-lg hover:bg-rose-50 z-10"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="relative overflow-hidden bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 text-red-700 px-4 py-3.5 rounded-xl text-sm font-medium shadow-lg animate-shake">
                  <div className="absolute inset-0 bg-red-500/5"></div>
                  <div className="relative flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full group/btn overflow-hidden"
              >
                {/* Button gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-amber-500 to-orange-500 rounded-xl shadow-lg group-hover/btn:shadow-xl transition-all duration-300"></div>

                {/* Button hover shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>

                <div className="relative flex justify-center items-center py-4 px-6 rounded-xl">
                  {loading ? (
                    <div className="flex items-center gap-3 text-white font-semibold">
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <span className="text-white font-bold text-base tracking-wide flex items-center gap-2">
                      Sign In
                      <Sparkles className="h-4 w-4 group-hover/btn:rotate-12 transition-transform duration-300" />
                    </span>
                  )}
                </div>

                {/* Disabled state overlay */}
                {loading && (
                  <div className="absolute inset-0 bg-black/10 rounded-xl"></div>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer decorative element */}
        <div className="text-center">
          <p className="text-xs text-gray-500 font-medium">
            Secure access to your account
          </p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.08;
          }
          50% {
            opacity: 0.12;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(5px);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
