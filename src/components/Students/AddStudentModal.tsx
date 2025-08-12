import { yupResolver } from "@hookform/resolvers/yup";
import { HeartPulse, Home, MapPin, User, Users, X } from "lucide-react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useCreateStudent, useUpdateStudent } from "../../api/student";
import { StudentResponse } from "../../api/student/types";
import { bloodGroups, dorms } from "../../utils/constants";
import Button from "../elements/button/Button";
import Input from "../elements/input/Input";
import Select from "../elements/select/Select";
import Textarea from "../elements/textarea/Textarea";
import {
  studentDefaultValues,
  StudentSchema,
  studentValidationSchema,
} from "./yup";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  editStudent?: StudentResponse;
  setEditStudent: Dispatch<SetStateAction<StudentResponse | undefined>>;
  refetch: () => void;
}

export default function AddStudentModal({
  isOpen,
  onClose,
  editStudent,
  refetch,
}: AddStudentModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(studentValidationSchema),
    mode: "onChange",
    defaultValues: studentDefaultValues,
  });

  const filteredDOMS = [{ value: "", label: "" }, ...dorms.slice(1)];

  const employmentTypes = [
    { value: "", label: "Select Employment Type" },
    { value: "Government", label: "Government" },
    { value: "Private", label: "Private" },
    { value: "Self-employed", label: "Self-employed" },
    { value: "Unemployed", label: "Unemployed" },
    { value: "Other", label: "Other" },
  ];

  const { mutate: CreateStudent, isPending: pendingStudentCreate } =
    useCreateStudent({
      onSuccess() {
        refetch();
        onClose();
        reset(studentDefaultValues);
        toast.success("Stduent create successful");
      },
      onError(error) {
        toast.error("Stduent create unsuccessful");
      },
    });

  const { mutate: UpdateStudent, isPending: pendingStudentUpdate } =
    useUpdateStudent({
      id: editStudent?._id,
      onSuccess() {
        refetch();
        onClose();
        toast.success("Student updated successfully.");
      },
      onError(error) {
        toast.error("Student updated faild.");
      },
    });

  const onSubmit = (formData: StudentSchema) => {
    if (editStudent) {
      UpdateStudent(formData);
    } else {
      CreateStudent(formData);
    }
  };

  useEffect(() => {
    if (editStudent) {
      reset(editStudent);
    }
  }, [editStudent]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {editStudent ? "Edit Student" : "Add New Student"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Basic Information
              </h3>

              <div>
                <Controller
                  control={control}
                  name="admissionNumber"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Admission Number"
                      type="number"
                      required
                      error={errors.admissionNumber?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Full Name"
                      type="text"
                      required
                      error={errors.name?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="admissionDate"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Admission Date"
                      type="date"
                      required
                      error={errors.admissionDate?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Date of Birth"
                      type="date"
                      required
                      error={errors.dateOfBirth?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="bloodGroup"
                  render={({ field }) => (
                    <Select
                      {...field}
                      label="Blood Group"
                      options={bloodGroups}
                      required
                      error={errors.bloodGroup?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="dorm"
                  render={({ field }) => (
                    <Select
                      required
                      label="DOM"
                      options={filteredDOMS}
                      {...field}
                      error={errors.dorm?.message}
                    />
                  )}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Contact Information
              </h3>

              <div>
                <Controller
                  control={control}
                  name="contact.phone"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Phone Number"
                      type="tel"
                      required
                      error={errors.contact?.phone?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="contact.address"
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      label="Address"
                      required
                      error={errors.contact?.address?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="contact.district"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="District"
                      type="text"
                      required
                      error={errors.contact?.district?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="contact.province"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Province"
                      type="text"
                      required
                      error={errors.contact?.province?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="class"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Class"
                      type="text"
                      required
                      error={errors.class?.message}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Family Information */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
              <Users className="h-5 w-5 mr-2" />
              Family Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Father Information */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Father's Details
                </h4>

                <div>
                  <Controller
                    control={control}
                    name="father.name"
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Name"
                        type="text"
                        error={errors.father?.name?.message}
                      />
                    )}
                  />
                </div>

                <div>
                  <Controller
                    control={control}
                    name="father.occupation"
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Occupation"
                        type="text"
                        error={errors.father?.occupation?.message}
                      />
                    )}
                  />
                </div>

                <div>
                  <Controller
                    control={control}
                    name="father.employmentType"
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Employment Type"
                        options={employmentTypes}
                        error={errors.father?.employmentType?.message}
                      />
                    )}
                  />
                </div>

                <div>
                  <Controller
                    control={control}
                    name="father.monthlyIncome"
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Monthly Income"
                        type="number"
                        min="0"
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                        error={errors.father?.monthlyIncome?.message}
                      />
                    )}
                  />
                </div>

                <div>
                  <Controller
                    control={control}
                    name="father.mobile"
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Mobile Number"
                        type="tel"
                        error={errors.father?.mobile?.message}
                      />
                    )}
                  />
                </div>
              </div>

              {/* Mother Information */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Mother's Details
                </h4>

                <div>
                  <Controller
                    control={control}
                    name="mother.name"
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Name"
                        type="text"
                        error={errors.mother?.name?.message}
                      />
                    )}
                  />
                </div>

                <div>
                  <Controller
                    control={control}
                    name="mother.occupation"
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Occupation"
                        type="text"
                        error={errors.mother?.occupation?.message}
                      />
                    )}
                  />
                </div>

                <div>
                  <Controller
                    control={control}
                    name="mother.employmentType"
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Employment Type"
                        options={employmentTypes}
                        error={errors.mother?.employmentType?.message}
                      />
                    )}
                  />
                </div>

                <div>
                  <Controller
                    control={control}
                    name="mother.monthlyIncome"
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Monthly Income"
                        type="number"
                        min="0"
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                        error={errors.mother?.monthlyIncome?.message}
                      />
                    )}
                  />
                </div>

                <div>
                  <Controller
                    control={control}
                    name="mother.mobile"
                    render={({ field }) => (
                      <Input
                        {...field}
                        label="Mobile Number"
                        type="tel"
                        error={errors.mother?.mobile?.message}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Guardian Information */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
              <Home className="h-5 w-5 mr-2" />
              Guardian Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Controller
                  control={control}
                  name="guardian.name"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Guardian Name"
                      type="text"
                      error={errors.guardian?.name?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="guardian.occupation"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Occupation"
                      type="text"
                      error={errors.guardian?.occupation?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="guardian.address"
                  render={({ field }) => (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <textarea
                        {...field}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.guardian?.address && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.guardian.address.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="guardian.phoneNumber"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Phone Number"
                      type="tel"
                      error={errors.guardian?.phoneNumber?.message}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
              <HeartPulse className="h-5 w-5 mr-2" />
              Additional Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Controller
                  control={control}
                  name="numberOfSiblings"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Number of Siblings"
                      type="number"
                      min="0"
                      max="20"
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                      error={errors.numberOfSiblings?.message}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <Button
              type="submit"
              icon="material-symbols:save-outline-rounded"
              disabled={pendingStudentCreate || pendingStudentUpdate}
              loading={pendingStudentCreate || pendingStudentUpdate}
            >
              {editStudent ? "Update Student" : "Add Student"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
