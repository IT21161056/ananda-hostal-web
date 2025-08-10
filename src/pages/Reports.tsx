import React from 'react';
import { Download, FileText, BarChart } from 'lucide-react';

export default function Reports() {
  const reports = [
    {
      title: 'Student Attendance Report',
      description: 'Detailed attendance records for all students',
      type: 'attendance',
      icon: BarChart,
      color: 'blue'
    },
    {
      title: 'Financial Summary',
      description: 'Payment status and revenue analysis',
      type: 'finance',
      icon: FileText,
      color: 'green'
    },
    {
      title: 'Meal Plan Report',
      description: 'Weekly meal plans and cost analysis',
      type: 'meals',
      icon: FileText,
      color: 'orange'
    },
    {
      title: 'Student Directory',
      description: 'Complete student information export',
      type: 'students',
      icon: FileText,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6">
      {/* <div>
        <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
        <p className="text-gray-600">Generate and export various reports</p>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <div key={report.type} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg bg-${report.color}-50`}>
                  <report.icon className={`h-6 w-6 text-${report.color}-600`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button className="flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </button>
              <button className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}