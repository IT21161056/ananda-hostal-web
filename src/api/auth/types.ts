export type CreateUserBody = {
  firstName: string;
  lastName: string;
  email: string;
  nic: string;
  phone: string;
  password: string;
  role: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    nic: string;
    phone: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
};

export type RefreshTokenResponse = {
  accessToken: string;
};
