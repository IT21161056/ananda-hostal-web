import { ApiError } from "../hooks/types";

export type CreateStudentBody = {
  isActive: boolean;
  numberOfSiblings: number;
  guardian?: {
    address?: string;
    name?: string;
    occupation?: string;
    phoneNumber?: string;
  };
  mother?: {
    name?: string;
    occupation?: string;
    employmentType?: string;
    monthlyIncome?: number;
    mobile?: string;
  };
  father?: {
    name?: string;
    occupation?: string;
    employmentType?: string;
    monthlyIncome?: number;
    mobile?: string;
  };
  class: string;
  contact?: {
    address?: string;
    district?: string;
    phone?: string;
    province?: string;
  };
  dorm: string;
  bloodGroup?: string;
  dateOfBirth: string;
  admissionDate: string;
  name: string;
  admissionNumber: number;
};

export type StudentResponse = CreateStudentBody & {
  _id: string;
};

export type GetAllStudentsPaginated = {
  total: number;
  data: StudentResponse[];
};

export type TUseCreateUser = {
  id?: string;
  onSuccess: () => void;
  onError: (error: ApiError) => void;
};
