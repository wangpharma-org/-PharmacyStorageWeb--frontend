import { createContext, useContext, useEffect, useState } from "react"
import { tokenService } from "@/services/token.service"
import { authService } from "../auth.service"
import type { UserInfo } from "../types/auth.types"

type AuthStatus = "loading" | "authenticated" | "unauthenticated"

interface AuthContextValue {
  user: UserInfo | null
  status: AuthStatus
  storeAuth: (user: UserInfo) => void
  clearAuth: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [status, setStatus] = useState<AuthStatus>("loading")

  useEffect(() => {
    const token = tokenService.getAccessToken()
    const storedUser = tokenService.getUser()

    if (!token || !storedUser) {
      tokenService.clearTokens()
      tokenService.clearUser()
      setStatus("unauthenticated")
      return
    }

    // Restore session immediately from localStorage — no API round-trip needed
    setUser(storedUser)
    setStatus("authenticated")

    // Refresh user data in background; errors are silently ignored
    // (the axios interceptor handles 401 → refresh → redirect for all API calls)
    authService.me().then((fresh) =>
      setUser(fresh)).catch(() => {})
  }, [])

  const storeAuth = (authUser: UserInfo): void => {
    setUser(authUser)
    setStatus("authenticated")
  }

  const clearAuth = (): void => {
    tokenService.clearTokens()
    tokenService.clearUser()
    setUser(null)
    setStatus("unauthenticated")
  }

  return (
    <AuthContext.Provider value={{ user, status, storeAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuthContext must be used within AuthProvider")
  }
  return ctx
}
