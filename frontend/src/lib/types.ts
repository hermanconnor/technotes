export type UserRole = "Employee" | "Manager" | "Admin";
export type StatusFilter = "all" | "open" | "completed";

export interface LoginCredentials {
  username: string;
  password: string;
  persist: boolean;
}

export interface LoginResponse {
  accessToken: string;
}

export interface DecodedAccessToken {
  userInfo: {
    id: string;
    username: string;
    roles: UserRole[];
  };
  iat: number;
  exp: number;
}

export interface ApiErrorResponse {
  message: string;
}

export interface User {
  _id: string;
  username: string;
  roles: string[];
  active: boolean;
}

export interface Note {
  _id: string;
  user: string;
  username?: string;
  title: string;
  text: string;
  completed: boolean;
  ticket: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMetadata {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  metadata: PaginationMetadata;
  data: T[];
}

export interface DashboardStats {
  totalNotes: number;
  openNotes: number;
  completedNotes: number;
  activeEmployees: number;
}
