import type { UserInfo } from "@/modules/auth/types/auth.types"

const ACCESS_TOKEN_KEY = "access_token"
const REFRESH_TOKEN_KEY = "refresh_token"
const USER_KEY = "auth_user"

export const tokenService = {
  getAccessToken: (): string | null =>
    localStorage.getItem(ACCESS_TOKEN_KEY),

  getRefreshToken: (): string | null =>
    localStorage.getItem(REFRESH_TOKEN_KEY),

  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  },

  clearTokens: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },

  getUser: (): UserInfo | null => {
    try {
      const raw = localStorage.getItem(USER_KEY)
      return raw ? (JSON.parse(raw) as UserInfo) : null
    } catch {
      return null
    }
  },

  setUser: (user: UserInfo): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  clearUser: (): void => {
    localStorage.removeItem(USER_KEY)
  },

  decodeToken: <T>(token: string): T | null => {
    try {
      const payload = token.split(".")[1]
      const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
      return JSON.parse(decoded) as T
    } catch {
      return null
    }
  },
}
