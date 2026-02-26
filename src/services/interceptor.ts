import axios, { type AxiosInstance } from "axios"
import { tokenService } from "./token.service"

/**
 * Attaches a 401 → refresh → retry interceptor to the given axios instance.
 * Call this once in main.tsx after importing apiClient.
 *
 * Flow:
 *   request fails with 401
 *   → POST /auth/refresh with refreshToken
 *   → save new accessToken
 *   → retry original request
 *   → if refresh also fails → clear tokens + redirect to /login
 */
export function attachRefreshInterceptor(client: AxiosInstance): void {
  let isRefreshing = false
  let queue: Array<(token: string) => void> = []

  const processQueue = (token: string) => {
    queue.forEach((resolve) => resolve(token))
    queue = []
  }

  client.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      if (!axios.isAxiosError(error) || !error.config) {
        return Promise.reject(error)
      }

      const originalRequest = error.config as typeof error.config & { _retry?: boolean }

      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error)
      }

      const refreshToken = tokenService.getRefreshToken()
      if (!refreshToken) {
        tokenService.clearTokens()
        window.location.href = "/login"
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise<string>((resolve) => {
          queue.push(resolve)
        }).then((token) => {
          originalRequest.headers.set(
          "Authorization",
          `Bearer ${token}`
        );

          return client(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshClient = axios.create({
          baseURL: client.defaults.baseURL,
          timeout: client.defaults.timeout,
        })
        
        const { data } = await refreshClient.post<{ accessToken: string }>(
          "/auth/refresh",
          { refreshToken },
        )
        
        const newToken = data.accessToken
        tokenService.setTokens(newToken, refreshToken)
        processQueue(newToken)
        originalRequest.headers.set(
          "Authorization",
          `Bearer ${newToken}`
        );

        return client(originalRequest)
      } catch {
        tokenService.clearTokens()
        window.location.href = "/login"
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    },
  )
}
