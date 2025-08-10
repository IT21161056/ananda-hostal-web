import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/Layout/ProtectedRoute";
import Header from "../components/Layout/Header";
import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import Attendance from "../pages/Attendance";
import Meals from "../pages/Meals";
import Finance from "../pages/Finance";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import LoginForm from "../components/Login/LoginForm";
import { useAuth } from "../context/AuthContext";

interface AppRoutesProps {
  sidebarCollapsed: boolean;
  toggleMobileSidebar: () => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({
  sidebarCollapsed,
  toggleMobileSidebar,
}) => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginForm />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute permission="view_dashboard">
            <Header
              title="Dashboard"
              onMenuClick={toggleMobileSidebar}
              sidebarCollapsed={sidebarCollapsed}
            />
            <main className="flex-1 p-6 overflow-y-auto">
              <Dashboard />
            </main>
          </ProtectedRoute>
        }
      />
      <Route
        path="/students"
        element={
          <ProtectedRoute permission="view_students">
            <Header
              title="Students"
              onMenuClick={toggleMobileSidebar}
              sidebarCollapsed={sidebarCollapsed}
            />
            <main className="flex-1 p-6 overflow-y-auto">
              <Students />
            </main>
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <ProtectedRoute permission="view_attendance">
            <Header
              title="Attendance"
              onMenuClick={toggleMobileSidebar}
              sidebarCollapsed={sidebarCollapsed}
            />
            <main className="flex-1 p-6 overflow-y-auto">
              <Attendance />
            </main>
          </ProtectedRoute>
        }
      />
      <Route
        path="/meals"
        element={
          <ProtectedRoute permission="view_meals">
            <Header
              title="Meal Planning"
              onMenuClick={toggleMobileSidebar}
              sidebarCollapsed={sidebarCollapsed}
            />
            <main className="flex-1 p-6 overflow-y-auto">
              <Meals />
            </main>
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance"
        element={
          <ProtectedRoute permission="view_finance">
            <Header
              title="Finance"
              onMenuClick={toggleMobileSidebar}
              sidebarCollapsed={sidebarCollapsed}
            />
            <main className="flex-1 p-6 overflow-y-auto">
              <Finance />
            </main>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute permission="view_reports">
            <Header
              title="Reports"
              onMenuClick={toggleMobileSidebar}
              sidebarCollapsed={sidebarCollapsed}
            />
            <main className="flex-1 p-6 overflow-y-auto">
              <Reports />
            </main>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute permission="manage_settings">
            <Header
              title="Settings"
              onMenuClick={toggleMobileSidebar}
              sidebarCollapsed={sidebarCollapsed}
            />
            <main className="flex-1 p-6 overflow-y-auto">
              <Settings />
            </main>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
