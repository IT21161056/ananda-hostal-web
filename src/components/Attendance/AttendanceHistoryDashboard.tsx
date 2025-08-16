import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Filter,
  Search,
  Eye,
  Sun,
  Moon,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Input from "../elements/input/Input";
import Select from "../elements/select/Select";
import { dorms } from "../../utils/constants";

interface AttendanceSession {
  id: string;
  date: string;
  session: "morning" | "evening";
  presentCount: number;
  absentCount: number;
  leaveCount: number;
  totalStudents: number;
  recordedBy: string;
}

const AttendanceHistoryTable = () => {
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState<string>("");
  const [sessionFilter, setSessionFilter] = useState<
    "morning" | "evening" | ""
  >("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  // Mock data for past attendance sessions
  const mockSessions: AttendanceSession[] = [
    {
      id: "1",
      date: "2023-06-15",
      session: "morning",
      presentCount: 45,
      absentCount: 2,
      leaveCount: 3,
      totalStudents: 50,
      recordedBy: "Admin User",
    },
    {
      id: "2",
      date: "2023-06-15",
      session: "evening",
      presentCount: 48,
      absentCount: 1,
      leaveCount: 1,
      totalStudents: 50,
      recordedBy: "Admin User",
    },
    {
      id: "3",
      date: "2023-06-14",
      session: "morning",
      presentCount: 42,
      absentCount: 5,
      leaveCount: 3,
      totalStudents: 50,
      recordedBy: "Teacher 1",
    },
    {
      id: "4",
      date: "2023-06-14",
      session: "evening",
      presentCount: 47,
      absentCount: 1,
      leaveCount: 2,
      totalStudents: 50,
      recordedBy: "Teacher 2",
    },
    {
      id: "5",
      date: "2023-06-13",
      session: "morning",
      presentCount: 49,
      absentCount: 0,
      leaveCount: 1,
      totalStudents: 50,
      recordedBy: "Admin User",
    },
    {
      id: "6",
      date: "2023-06-13",
      session: "evening",
      presentCount: 50,
      absentCount: 0,
      leaveCount: 0,
      totalStudents: 50,
      recordedBy: "Teacher 1",
    },
    {
      id: "7",
      date: "2023-06-12",
      session: "morning",
      presentCount: 44,
      absentCount: 4,
      leaveCount: 2,
      totalStudents: 50,
      recordedBy: "Teacher 2",
    },
    {
      id: "8",
      date: "2023-06-12",
      session: "evening",
      presentCount: 46,
      absentCount: 2,
      leaveCount: 2,
      totalStudents: 50,
      recordedBy: "Admin User",
    },
    {
      id: "9",
      date: "2023-06-11",
      session: "morning",
      presentCount: 48,
      absentCount: 1,
      leaveCount: 1,
      totalStudents: 50,
      recordedBy: "Teacher 1",
    },
    {
      id: "10",
      date: "2023-06-11",
      session: "evening",
      presentCount: 49,
      absentCount: 0,
      leaveCount: 1,
      totalStudents: 50,
      recordedBy: "Teacher 2",
    },
  ];

  // Filter sessions based on selected filters
  const filteredSessions = mockSessions.filter((session) => {
    const matchesDate = dateFilter ? session.date === dateFilter : true;
    const matchesSession = sessionFilter
      ? session.session === sessionFilter
      : true;
    const matchesSearch = searchQuery
      ? session.recordedBy.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesDate && matchesSession && matchesSearch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredSessions.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedSessions = filteredSessions.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleViewDetails = (session: AttendanceSession) => {
    navigate(
      `/attendance/track?date=${session.date}&session=${session.session}`
    );
  };

  const handleCreateNew = () => {
    navigate("/attendance/new");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Attendance History
          </h1>

          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search by recorded by..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64"
            />
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap"
            >
              Create New Attendance
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => {
                setDateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => {
                  setSessionFilter("morning");
                  setCurrentPage(1);
                }}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  sessionFilter === "morning"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Sun className="h-4 w-4 mr-1" />
                Morning
              </button>
              <button
                onClick={() => {
                  setSessionFilter("evening");
                  setCurrentPage(1);
                }}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  sessionFilter === "evening"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Moon className="h-4 w-4 mr-1" />
                Evening
              </button>
              {sessionFilter && (
                <button
                  onClick={() => {
                    setSessionFilter("");
                    setCurrentPage(1);
                  }}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Session
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recorded By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                    Present
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <XCircle className="h-4 w-4 mr-1 text-red-500" />
                    Absent
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-yellow-500" />
                    On Leave
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-blue-500" />
                    Total
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                // Skeleton loading rows (5 rows)
                <>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <tr key={`loading-${index}`} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-8"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-8"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-8"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-8"></div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <div className="h-4 w-4 bg-gray-200 rounded"></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              ) : filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">
                        No attendance records found
                      </p>
                      <p className="text-sm">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedSessions.map((session) => (
                  <tr
                    key={session.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(session.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {session.session === "morning" ? (
                          <Sun className="h-4 w-4 mr-2 text-yellow-500" />
                        ) : (
                          <Moon className="h-4 w-4 mr-2 text-blue-500" />
                        )}
                        <span className="text-sm text-gray-700 capitalize">
                          {session.session}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {session.recordedBy}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {session.presentCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {session.absentCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {session.leaveCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-700">
                        {session.totalStudents}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleViewDetails(session)}
                          className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded transition-colors duration-150 flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          <span className="text-sm">View</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {filteredSessions.length > 0 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Results Info and Page Size */}
              <div className="flex items-center gap-4">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                >
                  {[5, 10, 25, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-gray-700">Per page</span>

                <div className="hidden sm:block text-sm text-gray-700">
                  <span className="font-medium">{startIndex + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(endIndex, filteredSessions.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{filteredSessions.length}</span>{" "}
                  results
                </div>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1 || loading}
                    className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                  >
                    First
                  </button>

                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <div className="flex items-center mx-2">
                    <span className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded">
                      {currentPage}
                    </span>
                  </div>

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages || loading}
                    className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                  >
                    Last
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceHistoryTable;
