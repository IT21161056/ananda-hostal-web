import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', present: 320, absent: 30 },
  { day: 'Tue', present: 315, absent: 35 },
  { day: 'Wed', present: 325, absent: 25 },
  { day: 'Thu', present: 318, absent: 32 },
  { day: 'Fri', present: 312, absent: 38 },
  { day: 'Sat', present: 295, absent: 55 },
  { day: 'Sun', present: 280, absent: 70 }
];

export default function AttendanceChart() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Attendance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="present" fill="#10B981" name="Present" />
          <Bar dataKey="absent" fill="#EF4444" name="Absent" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}