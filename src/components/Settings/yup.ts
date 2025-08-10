import * as yup from "yup";

const validationSchema = yup.object().shape({
  firstName: yup
    .string()
    .required("First name is required")
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for first name")
    .max(50, "First name cannot be longer than 50 characters"),

  lastName: yup
    .string()
    .required("Last name is required")
    .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for last name")
    .max(50, "Last name cannot be longer than 50 characters"),

  email: yup
    .string()
    .required("Email is required")
    .email("Invalid email format")
    .max(100, "Email cannot be longer than 100 characters"),

  nic: yup
    .string()
    .required("NIC is required")
    .matches(
      /^([0-9]{9}[xXvV]|[0-9]{12})$/,
      "Invalid NIC format (Valid formats: 123456789V or 123456789012)"
    ),

  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),

  role: yup.string().required("Role is required"),
  // Replace 'otherRoles' with your actual role options
  password: yup
    .string()
    .test(
      "lowercase",
      "Password must include at least one lowercase letter.",
      (value) => !value || /[a-z]/.test(value)
    )
    .test(
      "uppercase",
      "Password must include at least one uppercase letter.",
      (value) => !value || /[A-Z]/.test(value)
    )
    .test(
      "number",
      "Password must include at least one number.",
      (value) => !value || /\d/.test(value)
    )
    .test(
      "specialCharacter",
      "Password must include at least one special character (@$!%*?&#).",
      (value) => !value || /[@$!%*?&#]/.test(value)
    )
    .test(
      "length",
      "Password must be at least 8 characters long.",
      (value) => !value || value.length >= 8
    )
    .required(),
  confirmPassword: yup
    .string()
    .optional()
    .oneOf([yup.ref("password")], "Passwords must match."),
});

export default validationSchema;

export type UserRegistration = yup.InferType<typeof validationSchema>;
