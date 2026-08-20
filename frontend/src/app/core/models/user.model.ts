export type UserRole = 'admin' | 'doctor' | 'patient';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId?: string;
  doctorId?: string;
  avatarUrl?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  role?: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}
