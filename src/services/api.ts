import axios from "axios"
import { tokenService } from "./token.service"

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
})

// Attach access token to every request
apiClient.interceptors.request.use((config) => {
  const token = tokenService.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
