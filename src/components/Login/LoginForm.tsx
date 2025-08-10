import React, { useState } from "react";
import { Building2, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
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
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (userEmail: string) => {
    setEmail(userEmail);
    setPassword("password");
  };

  const demoUsers = [
    {
      email: "admin@ananda.edu",
      role: "Administrator",
      color: "bg-red-600",
      description: "Full system access",
    },
    {
      email: "warden@ananda.edu",
      role: "Warden",
      color: "bg-blue-600",
      description: "Students & Attendance",
    },
    {
      email: "accounts@ananda.edu",
      role: "Accountant",
      color: "bg-green-600",
      description: "Finance & Payments",
    },
    {
      email: "kitchen@ananda.edu",
      role: "Kitchen Staff",
      color: "bg-orange-600",
      description: "Meal Planning only",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img 
          src={collegeLogo} 
          alt="Watermark" 
          className="opacity-15 w-3/4 max-w-2xl object-contain" 
        />
      </div>
      
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            {/* <div className="p-3 bg-blue-600 rounded-full">
              <Building2 className="h-12 w-12 text-white" />
            </div> */}
            <div className="p-1 bg-white rounded-full shadow-sm">
              <img 
                src={collegeLogo} 
                alt="Ananda College Logo" 
                className="h-32 w-32 object-cover" // or object-contain
              />
            </div>
          </div>
          <h2 className="mt-2 text-3xl font-bold text-rose-800">
            Ananda College
          </h2>
          <p className="mt-2 text-sm text-rose-800">Hostel Management System</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600 mb-4 text-center font-medium">
              Demo Login Credentials
            </p>
            <div className="space-y-3">
              {demoUsers.map((user) => (
                <button
                  key={user.email}
                  onClick={() => quickLogin(user.email)}
                  className="w-full flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-left"
                >
                  <div
                    className={`h-8 w-8 rounded-full ${user.color} flex items-center justify-center mr-3`}
                  >
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {user.role}
                    </div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                    <div className="text-xs text-gray-400">
                      {user.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              Password for all demo accounts:{" "}
              <span className="font-mono bg-gray-100 px-1 rounded">
                password
              </span>
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}
