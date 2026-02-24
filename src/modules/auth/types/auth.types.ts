export interface AuthResponse {
  accessToken: string
  refreshToken: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

export interface UserInfo {
  id: string
  email: string
  firstName: string
  lastName: string
  approved: boolean
}