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
    roles: string[];
  };
  iat: number;
  exp: number;
}

export interface ApiErrorResponse {
  message: string;
}
