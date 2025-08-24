import React, { useEffect, useState } from "react";
import { Search, Menu, User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/socket";
import NotificationBell from "./NotificationBell";
import ServerStatusIndicator from "../elements/ui/serverStatusIndicator";

interface HeaderProps {
  title: string;
  description?: string;
  onMenuClick?: () => void;
  sidebarCollapsed?: boolean;
}

export default function Header({
  title,
  description,
  onMenuClick,
  sidebarCollapsed,
}: HeaderProps) {
  const { socket } = useSocket();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    // Listen for messages
    socket.on("debug-message", (msg) => {
      console.log("message >>", msg);
    });

    // Clean up on unmount
    return () => {
      socket.off("debug-message");
    };
  }, [socket]);

  return (
    <header
      className={`bg-white border-b border-gray-200 px-6 py-4 transition-all duration-300 `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-2 lg:ml-0 text-2xl font-bold text-gray-900">
            <h1>{title}</h1>
            {description && (
              <p className="text-gray-600 text-sm font-normal">{description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* <div className="hidden sm:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
          </div> */}
          <ServerStatusIndicator
            variant="standard"
            key={`ServerStatusIndicator-${new Date()}`}
          />
          <NotificationBell />

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-rose-800 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-amber-500 capitalize">
                  {user?.role}
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}
