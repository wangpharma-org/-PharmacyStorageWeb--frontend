import { apiClient } from "@/services/api"
import type { AuthResponse, LoginPayload, RegisterPayload, UserInfo } from "../types/auth.types"

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>("/auth/login", payload),

  register: (payload: RegisterPayload) =>
    apiClient.post<AuthResponse>("/auth/register", payload),

  logout: () =>
    apiClient.post<void>("/auth/logout"),

  refreshToken: (refreshToken: string) =>
    apiClient.post<Pick<AuthResponse, "accessToken">>("/auth/refresh", { refreshToken }),

  me: () =>
    apiClient.get<UserInfo>("/users/me"),
}
