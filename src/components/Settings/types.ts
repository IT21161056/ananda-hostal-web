export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  nic: string;
  phone: string;
  role: "admin" | "warden" | "lecturer";
  password?: string;
}
