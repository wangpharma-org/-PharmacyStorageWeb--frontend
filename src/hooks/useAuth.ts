import { useNavigate } from "react-router-dom"
import { authService } from "@/modules/auth/auth.service"
import { useAuthContext } from "@/modules/auth/context/AuthContext"
import type { UserInfo } from "@/modules/auth/types/auth.types"

interface UseAuthReturn {
  user: UserInfo | null
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const { user, status, clearAuth } = useAuthContext()
  const navigate = useNavigate()

  const logout = async (): Promise<void> => {
    try {
      await authService.logout()
    } catch {
      // swallow errors — tokens are cleared regardless
    }
    clearAuth()
    navigate("/login")
  }

  return {
    user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    logout,
  }
}
