import { api } from "../../services/api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: AuthUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export async function registerUser(
  data: RegisterRequest,
): Promise<RegisterResponse> {
  const response = await api.post<RegisterResponse>("/auth/register", data);

  return response.data;
}

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/auth/login", data);

  return response.data;
}

export async function getCurrentUser(): Promise<{ user: AuthUser }> {
  const response = await api.get<{ user: AuthUser }>("/me");

  return response.data;
}
