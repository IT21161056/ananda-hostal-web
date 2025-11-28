import { useState, useEffect } from "react";
import {
  Check,
  X,
  Clock,
  Save,
  Users,
  Calendar,
  Sun,
  Moon,
  Info,
  CheckCircle2,
} from "lucide-react";
import Input from "../elements/input/Input";
import Select from "../elements/select/Select";
import { dorms } from "../../utils/constants";
import { useGetStudentsForAttendance } from "../../api/student";
import {
  useCreateAttendance,
  useCheckAttendanceExists,
} from "../../api/attendance";
import {
  CreateAttendanceSessionRequest,
  StudentRecord,
} from "../../api/attendance/type";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Types
type AttendanceStatus = "present" | "absent" | "leave";
type SessionType = "morning" | "evening";

interface AttendanceData {
  [key: string]: {
    [studentId: string]: AttendanceStatus;
  };
}

// Helper function to get local date in YYYY-MM-DD format
const getLocalDateString = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function AttendanceTracker() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>(
    getLocalDateString()
  );
  const [selectedSession, setSelectedSession] =
    useState<SessionType>("morning");
  const [attendanceData, setAttendanceData] = useState<AttendanceData>({});
  const [dormFilter, setFilterDorm] = useState<string>();
  const [search, setSearch] = useState<string>();
  const [attendanceExists, setAttendanceExists] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const { data: studentsData, isLoading } = useGetStudentsForAttendance({
    dorm: dormFilter,
    search: search,
  });

  // Check if attendance already exists for selected date and session
  const { refetch: checkAttendance } = useCheckAttendanceExists(
    {
      date: selectedDate,
      sessionType: selectedSession,
    },
    { enabled: false } // Don't auto-fetch, we'll trigger it manually
  );

  // Check if attendance exists when date or session changes
  useEffect(() => {
    const checkExistingAttendance = async () => {
      if (!selectedDate || !selectedSession) return;

      setIsChecking(true);
      try {
        const result = await checkAttendance();
        if (result.data?.exists) {
          setAttendanceExists(true);
          toast.warning(
            `Attendance for ${selectedSession} session on ${new Date(
              selectedDate
            ).toLocaleDateString()} already exists. You can update or delete the existing record.`
          );
        } else {
          setAttendanceExists(false);
        }
      } catch (error) {
        // If check fails, allow user to proceed (might be a network issue)
        setAttendanceExists(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkExistingAttendance();
  }, [selectedDate, selectedSession, checkAttendance]);

  // Initialize attendance data for current date and session
  useEffect(() => {
    if (studentsData?.data && !attendanceExists) {
      const key = `${selectedDate}-${selectedSession}`;
      if (!attendanceData[key]) {
        setAttendanceData((prev) => ({
          ...prev,
          [key]: studentsData.data.reduce(
            (acc: { [key: string]: AttendanceStatus }, student) => ({
              ...acc,
              [student.id]: "present",
            }),
            {}
          ),
        }));
      }
    }
  }, [
    selectedDate,
    selectedSession,
    attendanceData,
    studentsData,
    attendanceExists,
  ]);

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

  const { mutate: CreateAttendance, isPending: pendingAttendanceCreating } =
    useCreateAttendance({
      onSuccess() {
        toast.success("Attendace sheet saved successfully.");
        navigate("/attendance");
      },
      onError() {
        toast.error("Attendace sheet saving failed.");
      },
    });

  const handleSave = async () => {
    if (!studentsData?.data) return;

    // Double-check if attendance exists before submitting (safety check)
    // The button should already be disabled, but this prevents submission if somehow called
    if (attendanceExists) {
      return;
    }

    const attendanceRecord: CreateAttendanceSessionRequest = {
      sessionType: selectedSession,
      date: selectedDate, // Include the date
      records: Object.entries(getCurrentAttendance()).map(
        ([studentId, status]) =>
          ({
            student: studentId,
            status,
          } as StudentRecord)
      ),
    };

    console.log("Saving attendance record:", attendanceRecord);

    CreateAttendance(attendanceRecord);
  };

  const getAttendanceStats = () => {
    if (!studentsData?.data) {
      return { present: 0, absent: 0, leave: 0, total: 0 };
    }

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

    return { present, absent, leave, total: studentsData.data.length };
  };

  const stats = getAttendanceStats();
  const currentAttendance = getCurrentAttendance();

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
            disabled={
              pendingAttendanceCreating ||
              !studentsData?.data ||
              attendanceExists ||
              isChecking
            }
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Save className="h-4 w-4 mr-2" />
            {pendingAttendanceCreating
              ? "Saving..."
              : attendanceExists
              ? "Attendance Exists"
              : isChecking
              ? "Checking..."
              : "Save Attendance"}
          </button>
        </div>

        {/* Statistics - Only show when attendance doesn't exist */}
        {!attendanceExists && !isChecking && (
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
                  <p className="text-sm font-medium text-yellow-800">
                    On Leave
                  </p>
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
        )}
      </div>

      {/* Attendance Already Marked Acknowledgement */}
      {attendanceExists && (
        <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Attendance Already Marked
              </h3>
              <p className="text-gray-600 mb-1">
                The attendance for{" "}
                <span className="font-medium text-gray-900">
                  {selectedSession === "morning" ? "Morning" : "Evening"}
                </span>{" "}
                session on{" "}
                <span className="font-medium text-gray-900">
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>{" "}
                has already been recorded.
              </p>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      What can you do?
                    </p>
                    <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                      <li>Update the existing attendance record</li>
                      <li>Delete the record and create a new one</li>
                      <li>Select a different date or session</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Attendance List - Only show when attendance doesn't exist */}
      {!attendanceExists && !isChecking && (
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

          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {studentsData?.data.map((student) => {
                const currentStatus =
                  currentAttendance[student.id] || "present";

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
                        onClick={() =>
                          handleAttendanceChange(student.id, "absent")
                        }
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
                        onClick={() =>
                          handleAttendanceChange(student.id, "leave")
                        }
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
          )}
        </div>
      )}
    </div>
  );
}
