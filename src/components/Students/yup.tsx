import * as yup from "yup";

const studentValidationSchema = yup.object().shape({
  // Basic Student Information
  admissionNumber: yup
    .number()
    .required("Admission number is required")
    .positive("Admission number must be positive")
    .integer("Admission number must be an integer")
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    }),

  name: yup.string().required("Student name is required").trim(),

  admissionDate: yup.string().required("Admission date is required"),

  dateOfBirth: yup.string().required("Date of birth is required"),

  bloodGroup: yup
    .string()
    .oneOf(
      ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      "Invalid blood group"
    ),

  dorm: yup.string().required("Dorm is required."),

  // Contact Information (nested validation)
  contact: yup.object().shape({
    phone: yup
      .string()
      .transform((value) => value?.replace(/[\s\-\(\)]/g, ""))
      .matches(/^\d{10}$|^$/, "Phone number must be 10 digits")
      .required("Phone number is required."),

    address: yup
      .string()
      .required("Address is required")
      .trim()
      .max(200, "Address cannot exceed 200 characters"),

    district: yup.string().required("District is required").trim(),

    province: yup.string().required("Province is required").trim(),
  }),

  class: yup.string().required("Class is required").trim(),

  // Father Information (nested validation)
  father: yup.object().shape({
    name: yup.string().trim(),

    occupation: yup
      .string()
      .trim()
      .max(100, "Father's occupation cannot exceed 100 characters"),

    employmentType: yup
      .string()
      .oneOf(
        ["", "Government", "Private", "Self-employed", "Unemployed", "Other"],
        "Invalid employment type for father"
      ),

    monthlyIncome: yup
      .number()
      .min(0, "Father's monthly income cannot be negative")
      .transform((value, originalValue) => {
        return originalValue === "" ? 0 : value;
      }),

    mobile: yup
      .string()
      .transform((value) => value?.replace(/[\s\-\(\)]/g, ""))
      .matches(/^\d{10}$|^$/, "Father's mobile number must be 10 digits"),
  }),

  // Mother Information (nested validation)
  mother: yup.object().shape({
    name: yup
      .string()
      .trim()
      .max(100, "Mother's name cannot exceed 100 characters"),

    occupation: yup
      .string()
      .trim()
      .max(100, "Mother's occupation cannot exceed 100 characters"),

    employmentType: yup
      .string()
      .oneOf(
        ["", "Government", "Private", "Self-employed", "Unemployed", "Other"],
        "Invalid employment type for mother"
      ),

    monthlyIncome: yup
      .number()
      .min(0, "Mother's monthly income cannot be negative")
      .transform((value, originalValue) => {
        return originalValue === "" ? 0 : value;
      }),

    mobile: yup
      .string()
      .transform((value) => value?.replace(/[\s\-\(\)]/g, ""))
      .matches(/^\d{10}$|^$/, "Mother's mobile number must be 10 digits"),
  }),

  // Guardian Information (nested validation)
  guardian: yup.object().shape({
    name: yup
      .string()
      .trim()
      .max(100, "Guardian's name cannot exceed 100 characters"),

    occupation: yup
      .string()
      .trim()
      .max(100, "Guardian's occupation cannot exceed 100 characters"),

    address: yup
      .string()
      .trim()
      .max(200, "Guardian's address cannot exceed 200 characters"),

    phoneNumber: yup
      .string()
      .transform((value) => value?.replace(/[\s\-\(\)]/g, ""))
      .matches(/^\d{10}$|^$/, "Guardian's phone number must be 10 digits"),
  }),

  // Family Information
  numberOfSiblings: yup
    .number()
    .integer("Number of siblings must be an integer")
    .min(0, "Number of siblings cannot be negative")
    .max(20, "Number of siblings seems unrealistic")
    .default(0)
    .transform((value, originalValue) => {
      return originalValue === "" ? 0 : value;
    }),

  // Additional fields
  isActive: yup.boolean().default(true),
});

export default studentValidationSchema;

const studentDefaultValues = {
  admissionDate: "",
  admissionNumber: 0,
  bloodGroup: "",
  class: "",
  contact: { address: "", district: "", phone: "", province: "" },
  dateOfBirth: "",
  dorm: "",
  father: {
    employmentType: "",
    mobile: "",
    monthlyIncome: 0,
    name: "",
    occupation: "",
  },
  mother: {
    employmentType: "",
    mobile: "",
    monthlyIncome: 0,
    name: "",
    occupation: "",
  },
  guardian: {
    address: "",
    name: "",
    occupation: "",
    phoneNumber: "",
  },
  isActive: true,
  name: "",
  numberOfSiblings: 0,
};

export type StudentSchema = yup.InferType<typeof studentValidationSchema>;

export { studentValidationSchema, studentDefaultValues };
