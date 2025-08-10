import React, { useEffect, useState } from "react";
import { X, Save, User, Mail, Shield, Eye, EyeOff, Phone } from "lucide-react";
import { User as UserType } from "./types";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import validationSchema, { UserRegistration } from "./yup";
import Input from "../elements/input/Input";
import Select from "../elements/select/Select";
import { useSignup } from "../../api/auth";
import { toast } from "react-toastify";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<UserType, "id"> & { password: string }) => void;
  editUser?: UserType;
  refetch: () => void;
}

export default function AddUserModal({
  isOpen,
  onClose,
  onSave,
  editUser,
  refetch,
}: AddUserModalProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const roles = [
    { value: "admin", label: "Administrator" },
    { value: "warden", label: "Warden" },
    { value: "lecturer", label: "Lecturer" },
  ];

  useEffect(() => {
    console.log("Errors >", errors);
  }, [errors]);

  const { mutate: Signup, isPending: isPendingSignup } = useSignup({
    onSuccess() {
      onClose();
      refetch();
      toast.success("User created succesfully");
    },
    onError(error) {
      toast.error("User create failed");
    },
  });

  const onSubmit = (formData: UserRegistration) => {
    Signup(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {editUser ? "Edit User" : "Add New User"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field }) => (
                    <Input
                      label="First Name"
                      {...field}
                      error={errors.firstName?.message}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field }) => (
                    <Input
                      label="Last Name"
                      {...field}
                      error={errors.lastName?.message}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <Input
                      label="Email Address"
                      {...field}
                      error={errors.email?.message}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={control}
                  name="nic"
                  render={({ field }) => (
                    <Input label="NIC" {...field} error={errors.nic?.message} />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field }) => (
                    <Input
                      label="Phone"
                      {...field}
                      error={errors.phone?.message}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Role
            </h3>
            <div>
              <Controller
                control={control}
                name="role"
                render={({ field }) => <Select {...field} options={roles} />}
              />
            </div>
          </div>

          {/* Password Section (always shown) */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Controller
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <Input
                      label="Password"
                      {...field}
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Enter password"
                      minLength={6}
                      error={errors.password?.message}
                    />
                  )}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="relative">
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <Input
                      label="Confirm Password"
                      {...field}
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Enter password"
                      minLength={6}
                      error={errors.confirmPassword?.message}
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              Password must be at least 6 characters long
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
            <button
              disabled={isPendingSignup}
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Save className="h-4 w-4 mr-2" />
              {editUser ? "Update User" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
