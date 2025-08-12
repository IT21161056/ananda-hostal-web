import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { FC, useState, useEffect, Dispatch, SetStateAction } from "react";
import { mockStudents } from "../../data/mockData";

import { StudentResponse } from "../../api/student/types";
import StudentDetailsModal from "./StudentDetailsModal";
import { useDeleteStudent } from "../../api/student";
import { toast } from "react-toastify";

interface Props {
  data?: StudentResponse[];
  refetch: () => void;
  loading?: boolean;
  setSelectedStudent: Dispatch<SetStateAction<StudentResponse | undefined>>;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

const StudentTable: FC<Props> = ({
  data = [],
  loading = false,
  refetch,
  setSelectedStudent,
  setModalOpen,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [5, 10, 25, 50, 100];

  // Modal states
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailsStudent, setDetailsStudent] = useState<StudentResponse | null>(
    null
  );
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  // Calculate pagination
  const totalPages = Math.ceil((data?.length || 0) / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedStudents = data?.slice(startIndex, endIndex) || [];

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // const getPageNumbers = () => {
  //   const pages = [];
  //   const maxVisiblePages = 5;
  //
  //   if (totalPages <= maxVisiblePages) {
  //     for (let i = 1; i <= totalPages; i++) {
  //       pages.push(i);
  //     }
  //   } else {
  //     const start = Math.max(1, currentPage - 2);
  //     const end = Math.min(totalPages, start + maxVisiblePages - 1);
  //
  //     for (let i = start; i <= end; i++) {
  //       pages.push(i);
  //     }
  //   }
  //
  //   return pages;
  // };

  // Action handlers
  const handleViewDetails = (student: StudentResponse) => {
    setDetailsStudent(student);
    setIsDetailsModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleEdit = (student: StudentResponse) => {
    setSelectedStudent(student);
    setModalOpen(true);
    setOpenDropdownId(null);
  };

  const handleDelete = (student: StudentResponse) => {
    if (window.confirm(`Are you sure you want to delete ${student.name}?`)) {
      deleteStudent(student._id);
      setOpenDropdownId(null);
    }
  };

  const toggleDropdown = (studentId: string) => {
    setOpenDropdownId(openDropdownId === studentId ? null : studentId);
  };

  // const closeDropdown = () => {
  //   setOpenDropdownId(null);
  // };

  // Delete student hook
  const { mutate: deleteStudent, isPending: isDeleting } = useDeleteStudent({
    onSuccess: () => {
      toast.success("Student deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error("Failed to delete student");
      console.error("Delete error:", error);
    },
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (openDropdownId && !target.closest(".actions-dropdown")) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId]);

  return (
    <div className="space-y-6 relative">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg font-medium text-gray-700">
              Loading students...
            </p>
          </div>
        </div>
      )}
      {/* Table Container */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button className="group inline-flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                    Admission No
                    <svg
                      className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button className="group inline-flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                    Student Name
                    <svg
                      className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button className="group inline-flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                    DOM
                    <svg
                      className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </button>
                </th>

                <th className="px-6 py-3 text-left">
                  <button className="group inline-flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                    Phone
                    <svg
                      className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button className="group inline-flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                    Status
                    <svg
                      className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button className="group inline-flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                    Address
                    <svg
                      className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button className="group inline-flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                    Created At
                    <svg
                      className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                      />
                    </svg>
                  </button>
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
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <div className="h-4 w-4 bg-gray-200 rounded"></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              ) : paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No students found</p>
                      <p className="text-sm">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((student) => (
                  <tr
                    key={student._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-normal text-gray-700">
                        {student.admissionNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-normal text-gray-700">
                        {student.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 capitalize">
                        {student.dorm ?? "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        {student.contact?.phone ?? "-"}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-md border text-xs font-medium ${
                          student.isActive
                            ? "bg-green-100/50 text-green-600 border-green-600"
                            : "bg-red-100/50 text-red-600 border-red-600"
                        }`}
                      >
                        {student.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div>
                        <div className="text-sm font-normal text-gray-900">
                          {student.contact?.address}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">
                          {student.contact?.district}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(student.admissionDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "numeric",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end relative actions-dropdown">
                        <button
                          onClick={() => toggleDropdown(student._id)}
                          className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors duration-150"
                          title="Actions"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                        {/* Actions Dropdown */}
                        {openDropdownId === student._id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 actions-dropdown">
                            <div className="py-1">
                              <button
                                onClick={() => handleViewDetails(student)}
                                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                              >
                                <Eye className="h-4 w-4 mr-3" />
                                View Details
                              </button>
                              <button
                                onClick={() => handleEdit(student)}
                                className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                              >
                                <Edit className="h-4 w-4 mr-3" />
                                Edit Student
                              </button>
                              <button
                                onClick={() => handleDelete(student)}
                                disabled={isDeleting}
                                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Trash2 className="h-4 w-4 mr-3" />
                                {isDeleting ? "Deleting..." : "Delete Student"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Results Info and Page Size */}
            <div className="flex items-center gap-4">
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-700">Per page</span>

              <div className="hidden sm:block text-sm text-gray-700">
                <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(endIndex, mockStudents.length)}
                </span>{" "}
                of <span className="font-medium">{mockStudents.length}</span>{" "}
                results
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <span>First</span>
                  <span>Last</span>
                </div>

                <div className="flex items-center">
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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {detailsStudent && (
        <StudentDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setDetailsStudent(null);
          }}
          student={detailsStudent}
        />
      )}
    </div>
  );
};

export default StudentTable;
