import React from "react";
import {
  Settings as SettingsIcon,
  Users,
  Shield,
  Database,
  Bell,
  UserPlus,
} from "lucide-react";
import ProtectedRoute from "../components/Layout/ProtectedRoute";
import UserManagement from "../components/Settings/UserManagement";

export default function Settings() {
  const [activeTab, setActiveTab] = React.useState<"general" | "users">(
    "general"
  );

  return (
    <ProtectedRoute permission="manage_settings">
      <div className="">
        {/* <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-600">
            Manage system configuration and preferences
          </p>
        </div> */}

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("general")}
              className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === "general"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <SettingsIcon className="h-4 w-4 mr-2" />
              General Settings
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === "users"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              User Management
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "general" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Security Settings
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Configure security policies and access controls
              </p>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200">
                Security Settings
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <Database className="h-6 w-6 text-purple-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Data Management
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Backup, restore, and export system data
              </p>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200">
                Data Settings
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <Bell className="h-6 w-6 text-orange-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Notifications
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Configure system notifications and alerts
              </p>
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200">
                Notification Settings
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <SettingsIcon className="h-6 w-6 text-gray-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  System Settings
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Configure general system preferences
              </p>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200">
                System Settings
              </button>
            </div>
          </div>
        ) : (
          <UserManagement />
        )}
      </div>
    </ProtectedRoute>
  );
}
