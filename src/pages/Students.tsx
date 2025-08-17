import React, { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import StudentTable from "../components/Students/StudentTable";
import AddStudentModal from "../components/Students/AddStudentModal";
import { Student } from "../types";
import { useGetAllStudents } from "../api/student";
import { useAuth } from "../context/AuthContext";

import { dorms, student_status } from "../utils/constants";
import Input from "../components/elements/input/Input";
import Select from "../components/elements/select/Select";
import { StudentResponse } from "../api/student/types";

export default function Students() {
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string | undefined>();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterHostel, setFilterHostel] = useState("");
  const [filterStatus, setFilterStatus] = useState<student_status>(
    student_status.Active
  );
  const [selectedStudent, setSelectedStudent] = useState<
    StudentResponse | undefined
  >();

  const getStatus = (status: string): boolean | undefined => {
    if (status == "") return undefined;

    return status == "active" ? true : false;
  };

  const getDom = (status: string): string | undefined => {
    if (status == "") return undefined;

    return status;
  };

  const handleAddStudent = (studentData: Omit<Student, "id">) => {
    console.log("Adding new student:", studentData);
    // This will be handled by the StudentTable component
  };

  const {
    data: studentData,
    refetch: refetchStudents,
    isLoading: fetchingAllStudents,
  } = useGetAllStudents({
    search: searchTerm,
    isActive: getStatus(filterStatus),
    dom: getDom(filterHostel),
  });

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setSelectedStudent(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage student profiles and information
          </p>
        </div> */}

        {hasPermission("manage_students") && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </button>
        )}
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <Select
            options={dorms}
            value={filterHostel}
            onChange={(e) => setFilterHostel(e.target.value)}
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as student_status)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          >
            <option value="">All Status</option>
            <option value={student_status.Active}>Active</option>
            <option value={student_status.Inactive}>Inactive</option>
          </select>
        </div>
      </div>
      <StudentTable
        data={studentData?.data}
        refetch={refetchStudents}
        loading={fetchingAllStudents}
        setSelectedStudent={setSelectedStudent}
        setModalOpen={setIsAddModalOpen}
      />

      {/* Modals */}
      {hasPermission("manage_students") && (
        <AddStudentModal
          refetch={refetchStudents}
          isOpen={isAddModalOpen}
          onClose={handleModalClose}
          editStudent={selectedStudent}
          setEditStudent={setSelectedStudent}
        />
      )}
    </div>
  );
}
