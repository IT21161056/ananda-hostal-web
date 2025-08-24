import React, { FC } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

interface DormData {
  name: string;
  occupancy: number;
  capacity: number;
  status: "high" | "medium" | "low";
}

const domOccupancy: DormData[] = [
  { name: "Dom A", occupancy: 85, capacity: 50, status: "medium" },
  { name: "Dom B", occupancy: 92, capacity: 50, status: "high" },
  { name: "Dom C", occupancy: 78, capacity: 50, status: "low" },
  { name: "Dom D", occupancy: 88, capacity: 50, status: "medium" },
  { name: "Dom E", occupancy: 95, capacity: 50, status: "high" },
  { name: "Dom F", occupancy: 82, capacity: 50, status: "low" },
  { name: "Dom G", occupancy: 90, capacity: 50, status: "high" },
];

// Modern gradient colors based on occupancy level
const getBarColor = (occupancy: number): string => {
  if (occupancy >= 90) return "#ef4444"; // Red for high occupancy
  if (occupancy >= 85) return "#f59e0b"; // Amber for medium occupancy
  return "#10b981"; // Green for low occupancy
};

// Modern gradient definitions
const getGradientId = (occupancy: number): string => {
  if (occupancy >= 90) return "highGradient";
  if (occupancy >= 85) return "mediumGradient";
  return "lowGradient";
};

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const ChartCard: FC<ChartCardProps> = ({ title, children, className = "" }) => (
  <div
    className={`bg-white rounded-2xl shadow-sm border-0 p-6 md:p-8 ${className}`}
  >
    {/* Header section - stacked on mobile */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div className="mb-4 md:mb-0">
        <h3 className="text-lg md:text-xl font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">
          Real-time occupancy across all dormitories
        </p>
      </div>
      <div className="flex flex-wrap gap-2 md:gap-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-xs text-gray-600">Low (&lt;85%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-xs text-gray-600">Medium (85-89%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-xs text-gray-600">High (≥90%)</span>
        </div>
      </div>
    </div>

    {/* Chart container */}
    <div className="h-64 sm:h-72 md:h-80">{children}</div>

    {/* Summary stats - stacked on mobile */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
      <div className="text-center">
        <p className="text-xl md:text-2xl font-bold text-gray-900">87.1%</p>
        <p className="text-sm text-gray-500">Avg Occupancy</p>
      </div>
      <div className="text-center">
        <p className="text-xl md:text-2xl font-bold text-green-600">68</p>
        <p className="text-sm text-gray-500">Available Beds</p>
      </div>
      <div className="text-center">
        <p className="text-xl md:text-2xl font-bold text-blue-600">3</p>
        <p className="text-sm text-gray-500">High Occupancy</p>
      </div>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const occupancyRate = data.occupancy;
    const occupiedBeds = Math.round((data.capacity * occupancyRate) / 100);
    const availableBeds = data.capacity - occupiedBeds;

    return (
      <div className="bg-white p-3 md:p-4 rounded-xl shadow-xl border border-gray-100">
        <h4 className="font-bold text-gray-900 mb-2 text-sm md:text-base">
          {label}
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm text-gray-600">Occupancy:</span>
            <span className="font-semibold text-gray-900 text-xs md:text-sm">
              {occupancyRate}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm text-gray-600">Occupied:</span>
            <span className="font-semibold text-blue-600 text-xs md:text-sm">
              {occupiedBeds} beds
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm text-gray-600">Available:</span>
            <span className="font-semibold text-green-600 text-xs md:text-sm">
              {availableBeds} beds
            </span>
          </div>
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm text-gray-600">Status:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  occupancyRate >= 90
                    ? "bg-red-100 text-red-700"
                    : occupancyRate >= 85
                    ? "bg-amber-100 text-amber-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {occupancyRate >= 90
                  ? "High"
                  : occupancyRate >= 85
                  ? "Medium"
                  : "Low"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const DormOccupancy = () => {
  return (
    <ChartCard title="Dormitory Occupancy Analytics">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={domOccupancy}
          margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
          barCategoryGap="15%"
        >
          <defs>
            {/* Gradient definitions for modern look */}
            <linearGradient id="lowGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
              <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="mediumGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
              <stop offset="100%" stopColor="#d97706" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="highGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
              <stop offset="100%" stopColor="#dc2626" stopOpacity={0.8} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f1f5f9"
            vertical={false}
            horizontal={true}
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#6b7280", fontWeight: 500 }}
            interval={0}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "#6b7280" }}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
            width={35}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="occupancy" radius={[6, 6, 0, 0]} maxBarSize={40}>
            {domOccupancy.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`url(#${getGradientId(entry.occupancy)})`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default DormOccupancy;
