export type UserRole = 'CLIENT' | 'WORKER';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  rating: number;
  ratingCount: number;
  emailVerified: boolean;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  birthDate: string;
};
