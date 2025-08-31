import React, { useState, useEffect } from "react";
import axiosInstance from "../../../lib/axiosInstance";

interface ServerStatusIndicatorProps {
  checkInterval?: number;
  showDetailedStatus?: boolean;
  className?: string;
  variant?: "minimal" | "standard" | "detailed";
}

const ServerStatusIndicator: React.FC<ServerStatusIndicatorProps> = ({
  checkInterval = 60000,
  showDetailedStatus = false,
  className = "",
  variant = "standard",
}) => {
  const [backendStatus, setBackendStatus] = useState<
    "unknown" | "connected" | "disconnected"
  >("unknown");
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkBackendConnection = async () => {
    setIsChecking(true);
    try {
      await axiosInstance.get("/");
      setBackendStatus("connected");
    } catch (error) {
      setBackendStatus("disconnected");
    } finally {
      setIsChecking(false);
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    checkBackendConnection();

    if (checkInterval > 0) {
      const intervalId = setInterval(checkBackendConnection, checkInterval);
      return () => clearInterval(intervalId);
    }
  }, [checkInterval]);

  const formatLastChecked = () => {
    if (!lastChecked) return "Never";

    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - lastChecked.getTime()) / 1000
    );

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  };

  // Minimal variant - just an icon
  if (variant === "minimal") {
    return (
      <div
        className={`inline-flex items-center ${className}`}
        title={backendStatus}
      >
        <div
          className={`w-2 h-2 rounded-full ${
            backendStatus === "connected"
              ? "bg-green-500"
              : backendStatus === "disconnected"
              ? "bg-red-500"
              : "bg-yellow-500"
          } ${isChecking ? "animate-pulse" : ""}`}
        />
      </div>
    );
  }

  // Standard variant - icon with text
  if (variant === "standard") {
    return (
      <div className={`inline-flex items-center gap-1.5 text-sm ${className}`}>
        <div
          className={`w-2 h-2 rounded-full ${
            backendStatus === "connected"
              ? "bg-green-500"
              : backendStatus === "disconnected"
              ? "bg-red-500"
              : "bg-yellow-500"
          } ${isChecking ? "animate-pulse" : ""}`}
        />
        <span
          className={`font-medium ${
            backendStatus === "connected"
              ? "text-green-700"
              : backendStatus === "disconnected"
              ? "text-red-700"
              : "text-yellow-700"
          }`}
        >
          {backendStatus === "connected"
            ? "Connected"
            : backendStatus === "disconnected"
            ? "Disconnected"
            : "Checking..."}
        </span>
      </div>
    );
  }

  // Detailed variant - full status with refresh button
  return (
    <div className={`bg-white rounded-lg border p-3 shadow-sm ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${
              backendStatus === "connected"
                ? "bg-green-500"
                : backendStatus === "disconnected"
                ? "bg-red-500"
                : "bg-yellow-500"
            } ${isChecking ? "animate-pulse" : ""}`}
          />

          <div>
            <h3 className="font-medium text-gray-900">Server Status</h3>
            <p
              className={`text-sm font-medium ${
                backendStatus === "connected"
                  ? "text-green-700"
                  : backendStatus === "disconnected"
                  ? "text-red-700"
                  : "text-yellow-700"
              }`}
            >
              {backendStatus === "connected"
                ? "All systems operational"
                : backendStatus === "disconnected"
                ? "Connection issues"
                : "Checking status..."}
            </p>
            {lastChecked && (
              <p className="text-xs text-gray-500 mt-1">
                Last checked: {formatLastChecked()}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={checkBackendConnection}
          disabled={isChecking}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isChecking ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Checking
            </>
          ) : (
            "Refresh"
          )}
        </button>
      </div>
    </div>
  );
};

export default ServerStatusIndicator;
