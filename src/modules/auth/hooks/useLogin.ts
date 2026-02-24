import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { authService } from "../auth.service"
import { tokenService } from "@/services/token.service"
import { useAuthContext } from "../context/AuthContext"
import type { LoginPayload, UserInfo } from "../types/auth.types"

interface UseLoginReturn {
  login: (payload: LoginPayload) => Promise<void>
  isLoading: boolean
  error: string | null
}

export function useLogin(): UseLoginReturn {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { storeAuth } = useAuthContext()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (payload: LoginPayload): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await authService.login(payload)
      tokenService.setTokens(result.accessToken, result.refreshToken)
      const userInfo = tokenService.decodeToken<UserInfo>(result.accessToken)
      if (!userInfo) throw new Error("Invalid token")
      tokenService.setUser(userInfo)
      storeAuth(userInfo)
      navigate("/app/dashboard")
    } catch {
      setError(t("auth.login.errors.serverError"))
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}
