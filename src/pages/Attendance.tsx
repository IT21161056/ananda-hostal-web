import React, { useState } from "react";
import { BarChart3, ClipboardCheck } from "lucide-react";
import AttendanceTracker from "../components/Attendance/AttendanceTracker";
import AttendanceReports from "../components/Attendance/AttendanceReports";

export default function Attendance() {
  const [activeTab, setActiveTab] = useState<"tracker" | "reports">("tracker");

  return (
    <div className="space-y-6">
      {/* <div>
        <h2 className="text-2xl font-bold text-gray-900">Attendance</h2>
        <p className="text-gray-600">Track daily student attendance and generate reports</p>
      </div> */}

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("tracker")}
            className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
              activeTab === "tracker"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <ClipboardCheck className="h-4 w-4 mr-2" />
            Mark Attendance
          </button>
          {/* <button
            onClick={() => setActiveTab("reports")}
            className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
              activeTab === "reports"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Reports & Analytics
          </button> */}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "tracker" ? <AttendanceTracker /> : <AttendanceReports />}
    </div>
  );
}
