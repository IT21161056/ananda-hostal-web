import React from 'react';
import { mockDashboardStats } from '../../data/mockData';

export default function HostelOccupancy() {
  const { hostelOccupancy } = mockDashboardStats;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Hostel Occupancy</h3>
      <div className="space-y-4">
        {Object.entries(hostelOccupancy).map(([hostel, occupancy]) => (
          <div key={hostel} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{hostel}</span>
            <div className="flex items-center space-x-3">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    occupancy >= 90 ? 'bg-red-500' : 
                    occupancy >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${occupancy}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-900 w-12 text-right">
                {occupancy}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}