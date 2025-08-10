import React, { useState, useEffect } from "react";
import {
  Check,
  X,
  Clock,
  Save,
  Users,
  Calendar,
  Sun,
  Moon,
} from "lucide-react";
import Input from "../elements/input/Input";
import Select from "../elements/select/Select";
import { dorms } from "../../utils/constants";
import { useGetStudentsForAttendance } from "../../api/student";

// Types
interface Student {
  id: string;
  name: string;
  dorm: string;
  room: string;
  age: number;
}

type AttendanceStatus = "present" | "absent" | "leave";
type SessionType = "morning" | "evening";

interface AttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
}

interface AttendanceData {
  [key: string]: {
    [studentId: string]: AttendanceStatus;
  };
}

// Mock data for students (ages 6-11)
const mockStudents: Student[] = [
  { id: "1", name: "Emma Johnson", dorm: "Dorm A", room: "101", age: 8 },
  { id: "2", name: "Liam Smith", dorm: "Dorm A", room: "102", age: 9 },
  { id: "3", name: "Sophia Brown", dorm: "Dorm B", room: "201", age: 7 },
  { id: "4", name: "Noah Wilson", dorm: "Dorm B", room: "202", age: 10 },
  { id: "5", name: "Olivia Davis", dorm: "Dorm C", room: "301", age: 6 },
  { id: "6", name: "William Miller", dorm: "Dorm C", room: "302", age: 11 },
  { id: "7", name: "Ava Garcia", dorm: "Dorm A", room: "103", age: 8 },
  { id: "8", name: "James Rodriguez", dorm: "Dorm B", room: "203", age: 9 },
  { id: "9", name: "Isabella Martinez", dorm: "Dorm C", room: "303", age: 7 },
  { id: "10", name: "Benjamin Anderson", dorm: "Dorm A", room: "104", age: 10 },
];

export default function AttendanceTracker() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedSession, setSelectedSession] =
    useState<SessionType>("morning");
  const [attendanceData, setAttendanceData] = useState<AttendanceData>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [dormFilter, setFilterDorm] = useState<string>();
  const [search, setSearch] = useState<string>();

  // Initialize attendance data for current date and session
  useEffect(() => {
    const key = `${selectedDate}-${selectedSession}`;
    if (!attendanceData[key]) {
      setAttendanceData((prev) => ({
        ...prev,
        [key]: mockStudents.reduce(
          (acc: { [key: string]: AttendanceStatus }, student) => ({
            ...acc,
            [student.id]: "present",
          }),
          {}
        ),
      }));
    }
  }, [selectedDate, selectedSession, attendanceData]);

  const getCurrentAttendance = (): {
    [studentId: string]: AttendanceStatus;
  } => {
    const key = `${selectedDate}-${selectedSession}`;
    return attendanceData[key] || {};
  };

  const handleAttendanceChange = (
    studentId: string,
    status: AttendanceStatus
  ): void => {
    const key = `${selectedDate}-${selectedSession}`;
    setAttendanceData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [studentId]: status,
      },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const attendanceRecord = {
      date: selectedDate,
      session: selectedSession,
      time: selectedSession === "morning" ? "07:00" : "15:00",
      records: Object.entries(getCurrentAttendance()).map(
        ([studentId, status]) => ({
          studentId,
          status,
        })
      ),
    };

    console.log("Saving attendance record:", attendanceRecord);

    setIsSaving(false);
    setLastSaved(new Date().toLocaleTimeString());
  };

  const getAttendanceStats = () => {
    const current = getCurrentAttendance();
    const present = Object.values(current).filter(
      (status) => status === "present"
    ).length;
    const absent = Object.values(current).filter(
      (status) => status === "absent"
    ).length;
    const leave = Object.values(current).filter(
      (status) => status === "leave"
    ).length;

    return { present, absent, leave, total: mockStudents.length };
  };

  const stats = getAttendanceStats();
  const currentAttendance = getCurrentAttendance();

  const { data: studentsData, isLoading } = useGetStudentsForAttendance({
    dorm: dormFilter,
    search: search,
  });

  console.log("students >>", studentsData);

  return (
    <div className="space-y-6">
      {/* Date and Session Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">Date:</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <label className="text-sm font-medium text-gray-700">
                Session:
              </label>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSelectedSession("morning")}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    selectedSession === "morning"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Sun className="h-4 w-4 mr-1" />
                  Morning (7 AM)
                </button>
                <button
                  onClick={() => setSelectedSession("evening")}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    selectedSession === "evening"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Moon className="h-4 w-4 mr-1" />
                  Evening (3 PM)
                </button>
              </div>
            </div>

            <Select
              options={dorms}
              onChange={(e) => setFilterDorm(e.target.value)}
            />
            <Input
              placeholder="search student name ..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Attendance"}
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-green-800">Present</p>
                <p className="text-2xl font-bold text-green-900">
                  {stats.present}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <X className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-red-800">Absent</p>
                <p className="text-2xl font-bold text-red-900">
                  {stats.absent}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-yellow-800">On Leave</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {stats.leave}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-blue-800">Total</p>
                <p className="text-2xl font-bold text-blue-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Student Attendance List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Student Attendance -{" "}
            {selectedSession === "morning" ? "Morning" : "Evening"} Session
          </h3>
          <div className="text-sm text-gray-500">
            {new Date(selectedDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        <div className="space-y-3">
          {studentsData?.data.map((student) => {
            const currentStatus = currentAttendance[student.id] || "present";

            return (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {student.name}
                    </h4>
                    <p className="text-sm text-gray-500">{student.dorm}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      handleAttendanceChange(student.id, "present")
                    }
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      currentStatus === "present"
                        ? "bg-green-100 text-green-800 border-2 border-green-300 shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-green-50 border-2 border-transparent"
                    }`}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Present
                  </button>

                  <button
                    onClick={() => handleAttendanceChange(student.id, "absent")}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      currentStatus === "absent"
                        ? "bg-red-100 text-red-800 border-2 border-red-300 shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-red-50 border-2 border-transparent"
                    }`}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Absent
                  </button>

                  <button
                    onClick={() => handleAttendanceChange(student.id, "leave")}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      currentStatus === "leave"
                        ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-300 shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-yellow-50 border-2 border-transparent"
                    }`}
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    On Leave
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
