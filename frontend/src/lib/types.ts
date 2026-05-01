export type UserRole = "Employee" | "Manager" | "Admin";
export type StatusFilter = "all" | "open" | "completed";

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
  roles: UserRole[];
  active: boolean;
}

interface UserReference {
  _id: string;
  username: string;
}

export interface Note {
  _id: string;
  title: string;
  text: string;
  ticket: number;
  completed: boolean;
  username: string;
  user: UserReference;
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
  totalEmployees: number;
  inactiveEmployees: number;
  activeEmployees: number;
}
