# Skill: new-service

Create a service layer file — either a module service or a global service.

## Usage

```
/new-service <module>          # creates src/modules/<module>/<module>.service.ts
/new-service global/<name>     # creates src/services/<name>.service.ts
```

Examples:
- `/new-service auth`          → `src/modules/auth/auth.service.ts`
- `/new-service global/token`  → `src/services/token.service.ts`

---

## Module service

**Location:** `src/modules/<module>/<module>.service.ts`

A module service wraps the API layer and holds business logic for the feature. It is the **only** place that calls `<module>Api`. Hooks call the service; components never call the API directly.

### Template

```ts
// src/modules/<module>/<module>.service.ts
import { <module>Api } from "./api/<module>.api"
import type {
  <Module>,
  Create<Module>Payload,
  Update<Module>Payload,
} from "./types/<module>.types"

export const <module>Service = {
  getAll: async (): Promise<<Module>[]> => {
    const { data } = await <module>Api.getAll()
    return data
  },

  getById: async (id: string): Promise<<Module>> => {
    const { data } = await <module>Api.getById(id)
    return data
  },

  create: async (payload: Create<Module>Payload): Promise<<Module>> => {
    const { data } = await <module>Api.create(payload)
    return data
  },

  update: async (id: string, payload: Update<Module>Payload): Promise<<Module>> => {
    const { data } = await <module>Api.update(id, payload)
    return data
  },

  remove: async (id: string): Promise<void> => {
    await <module>Api.remove(id)
  },
}
```

---

## Global service — `token.service.ts`

Manages JWT access/refresh tokens in `localStorage`.

**Location:** `src/services/token.service.ts`

```ts
const ACCESS_KEY = "access_token"
const REFRESH_KEY = "refresh_token"

export const tokenService = {
  getAccessToken: (): string | null =>
    localStorage.getItem(ACCESS_KEY),

  getRefreshToken: (): string | null =>
    localStorage.getItem(REFRESH_KEY),

  setTokens: (access: string, refresh: string): void => {
    localStorage.setItem(ACCESS_KEY, access)
    localStorage.setItem(REFRESH_KEY, refresh)
  },

  clearTokens: (): void => {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  },

  isAuthenticated: (): boolean =>
    !!localStorage.getItem(ACCESS_KEY),
}
```

---

## Global service — `api.ts`

The shared axios instance used by all module API files.

**Location:** `src/services/api.ts`

```ts
import axios from "axios"
import { tokenService } from "./token.service"

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  headers: { "Content-Type": "application/json" },
})

// Attach token to every request
apiClient.interceptors.request.use((config) => {
  const token = tokenService.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

---

## Global service — `interceptor.ts`

Handles 401 → token refresh → retry logic.

**Location:** `src/services/interceptor.ts`

```ts
import { apiClient } from "./api"
import { tokenService } from "./token.service"

export function setupInterceptors(): void {
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const original = error.config

      if (error.response?.status === 401 && !original._retry) {
        original._retry = true

        try {
          const refresh = tokenService.getRefreshToken()
          if (!refresh) throw new Error("No refresh token")

          const { data } = await apiClient.post<{ accessToken: string }>(
            "/auth/refresh",
            { refreshToken: refresh }
          )

          tokenService.setTokens(data.accessToken, refresh)
          original.headers.Authorization = `Bearer ${data.accessToken}`
          return apiClient(original)
        } catch {
          tokenService.clearTokens()
          window.location.href = "/auth/login"
        }
      }

      return Promise.reject(error)
    }
  )
}
```

Call `setupInterceptors()` once in `src/main.tsx` or `src/app/providers.tsx`.

---

## Auth service example — `src/modules/auth/auth.service.ts`

```ts
import { authApi } from "./api/auth.api"
import { tokenService } from "@/services/token.service"
import type { LoginPayload, RegisterPayload, AuthUser } from "./types/auth.types"

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthUser> => {
    const { data } = await authApi.login(payload)
    tokenService.setTokens(data.accessToken, data.refreshToken)
    return data.user
  },

  register: async (payload: RegisterPayload): Promise<AuthUser> => {
    const { data } = await authApi.register(payload)
    tokenService.setTokens(data.accessToken, data.refreshToken)
    return data.user
  },

  logout: (): void => {
    tokenService.clearTokens()
  },

  getCurrentUser: async (): Promise<AuthUser> => {
    const { data } = await authApi.me()
    return data
  },
}
```

---

## Conventions

- Services are plain `const` objects — never classes
- No `any` type — every function must have a typed return annotation
- Services never import from `hooks/` or `components/` — only from `api/`, `types/`, and `@/services/`
- Business transformations live here — not in the API layer and not in hooks
- Global services live in `src/services/`, module services in `src/modules/<module>/`
