import React from "react";
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Building2,
  Calendar,
  Heart,
} from "lucide-react";
import { Student } from "../../types";

interface StudentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student?: Student;
}

export default function StudentDetailsModal({
  isOpen,
  onClose,
  student,
}: StudentDetailsModalProps) {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Student Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
            <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-white">
                {student.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {student.name}
              </h3>
              <p className="text-blue-600 font-medium">
                {student.course} - Year {student.year}
              </p>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                  student.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {student.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Personal Information
              </h4>

              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">
                      {student.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">
                      {student.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-3 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-sm font-medium text-gray-900">
                      {student.address}
                    </p>
                  </div>
                </div>

                {student.bloodGroup && (
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-3 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Blood Group</p>
                      <p className="text-sm font-medium text-gray-900">
                        {student.bloodGroup}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Admission Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(student.admissionDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Guardian & Hostel Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-green-600" />
                Guardian & Hostel Details
              </h4>

              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Guardian Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {student.guardianName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Guardian Phone</p>
                    <p className="text-sm font-medium text-gray-900">
                      {student.guardianPhone}
                    </p>
                  </div>
                </div>

                {student.emergencyContact && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-3 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Emergency Contact</p>
                      <p className="text-sm font-medium text-gray-900">
                        {student.emergencyContact}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Hostel & Room</p>
                    <p className="text-sm font-medium text-gray-900">
                      {student.hostel} - Room {student.room}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Monthly Fee</p>
                    <p className="text-sm font-medium text-gray-900">
                      ₹{student.monthlyFee.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Medical Conditions */}
          {student.medicalConditions && (
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-3">
                Medical Information
              </h4>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  {student.medicalConditions}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
