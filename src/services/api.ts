import axios from "axios"
import { tokenService } from "./token.service"

function createServiceClient(baseURL: string) {
  const client = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
  })
  client.interceptors.request.use((config) => {
    const token = tokenService.getAccessToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })
  return client
}

export const apiClient = createServiceClient(
  import.meta.env.VITE_API_URL ?? "http://localhost:3000")

export const productApiClient = createServiceClient(
  import.meta.env.VITE_PRODUCT_API_URL ?? "http://localhost:3002",
)

export const stockApiClient = createServiceClient(
  import.meta.env.VITE_STOCK_API_URL ?? "http://localhost:3003",
)
