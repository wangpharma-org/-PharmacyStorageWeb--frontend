import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { authService } from "../auth.service"
import { tokenService } from "@/services/token.service"
import { useAuthContext } from "../context/AuthContext"
import type { RegisterPayload, UserInfo } from "../types/auth.types"

interface UseRegisterReturn {
  register: (payload: RegisterPayload) => Promise<void>
  isLoading: boolean
  error: string | null
}

export function useRegister(): UseRegisterReturn {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { storeAuth } = useAuthContext()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const register = async (payload: RegisterPayload): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await authService.register(payload)
      tokenService.setTokens(result.accessToken, result.refreshToken)
      const userInfo = tokenService.decodeToken<UserInfo>(result.accessToken)
      if (!userInfo) throw new Error("Invalid token")
      tokenService.setUser(userInfo)
      storeAuth(userInfo)
      navigate("/app/dashboard")
    } catch {
      setError(t("auth.register.errors.serverError"))
    } finally {
      setIsLoading(false)
    }
  }

  return { register, isLoading, error }
}
