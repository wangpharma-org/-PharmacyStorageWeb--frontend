import { authApi } from "./api/auth.api"
import type { LoginPayload, RegisterPayload, UserInfo } from "./types/auth.types"

export const authService = {
  login: async (payload: LoginPayload) => {
    const { data } = await authApi.login(payload)
    return data
  },

  register: async (payload: RegisterPayload) => {
    const { data } = await authApi.register(payload)
    return data
  },

  logout: async (): Promise<void> => {
    await authApi.logout()
  },

  refreshToken: async (refreshToken: string) => {
    const { data } = await authApi.refreshToken(refreshToken)
    return data
  },

  me: async (): Promise<UserInfo> => {
    const { data } = await authApi.me()
    return data
  },
}
