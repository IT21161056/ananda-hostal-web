import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

interface AttendanceData {
  day: string;
  morning: number;
  evening: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const data: AttendanceData[] = [
  { day: "Mon", morning: 340, evening: 335 },
  { day: "Tue", morning: 345, evening: 330 },
  { day: "Wed", morning: 350, evening: 342 },
  { day: "Thu", morning: 348, evening: 338 },
  { day: "Fri", morning: 332, evening: 325 },
  { day: "Sat", morning: 298, evening: 285 },
  { day: "Sun", morning: 276, evening: 260 },
];

export default function AttendanceChart() {
  const CustomTooltip: React.FC<TooltipProps> = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      const morningData = payload.find((p) => p.dataKey === "morning");
      const eveningData = payload.find((p) => p.dataKey === "evening");
      const difference: number =
        morningData && eveningData ? morningData.value - eveningData.value : 0;

      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{`${label}`}</p>
          <div className="space-y-1">
            <p className="text-blue-600">
              <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              Morning: {morningData?.value || 0}
            </p>
            <p className="text-purple-600">
              <span className="inline-block w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
              Evening: {eveningData?.value || 0}
            </p>
            <div className="border-t pt-1 mt-2">
              <p className="text-sm text-gray-600">
                Difference: {difference > 0 ? "+" : ""}
                {difference}
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border-0 p-8 `}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Morning & Evening Attendance
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Daily attendance comparison across sessions
          </p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Morning</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            <span className="text-gray-600">Evening</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f1f5f9"
            horizontal={true}
            vertical={false}
          />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#64748b" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#64748b" }}
            domain={["dataMin - 10", "dataMax + 10"]}
          />
          <Tooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="morning"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, fill: "#3b82f6", strokeWidth: 2 }}
            name="Morning Attendance"
          />
          <Line
            type="monotone"
            dataKey="evening"
            stroke="#8b5cf6"
            strokeWidth={3}
            dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, fill: "#8b5cf6", strokeWidth: 2 }}
            name="Evening Attendance"
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-sm text-gray-600">Avg Morning</p>
          <p className="text-lg font-semibold text-blue-600">327</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Avg Evening</p>
          <p className="text-lg font-semibold text-purple-600">316</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Best Day</p>
          <p className="text-lg font-semibold text-green-600">Wednesday</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Attendance Rate</p>
          <p className="text-lg font-semibold text-gray-900">89.5%</p>
        </div>
      </div>
    </div>
  );
}
