export type UserResponse = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  nic: string;
  phone: string;
  role: string;
};
export type GetAllUsersPaginated = {
  total: number;
  data: UserResponse[];
};
