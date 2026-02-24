# Skill: new-api

Create the API layer file for a module.

## Usage

```
/new-api <module>
```

Example: `/new-api product` → `src/modules/product/api/product.api.ts`

---

## File location

```
src/modules/<module>/api/<module>.api.ts
```

The API file contains **only** raw HTTP calls via `apiClient`. No business logic. No token handling. No error transformation.

---

## Prerequisites

`@/services/api.ts` must export `apiClient` (the shared axios instance):

```ts
// src/services/api.ts
import axios from "axios"

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  headers: { "Content-Type": "application/json" },
})
```

If this file doesn't exist yet, run `/new-service global/api` first.

---

## Full template

```ts
// src/modules/<module>/api/<module>.api.ts
import { apiClient } from "@/services/api"
import type {
  <Module>,
  Create<Module>Payload,
  Update<Module>Payload,
} from "../types/<module>.types"

// Shape of a paginated list response — adjust to your backend contract
interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

interface ListParams {
  page?: number
  pageSize?: number
  search?: string
}

export const <module>Api = {
  getAll: (params?: ListParams) =>
    apiClient.get<PaginatedResponse<<Module>>>("/<module>s", { params }),

  getById: (id: string) =>
    apiClient.get<<Module>>(`/<module>s/${id}`),

  create: (payload: Create<Module>Payload) =>
    apiClient.post<<Module>>("/<module>s", payload),

  update: (id: string, payload: Update<Module>Payload) =>
    apiClient.patch<<Module>>(`/<module>s/${id}`, payload),

  remove: (id: string) =>
    apiClient.delete(`/<module>s/${id}`),
}
```

---

## Auth API example — `src/modules/auth/api/auth.api.ts`

```ts
import { apiClient } from "@/services/api"
import type {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  AuthUser,
} from "../types/auth.types"

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>("/auth/login", payload),

  register: (payload: RegisterPayload) =>
    apiClient.post<AuthResponse>("/auth/register", payload),

  me: () =>
    apiClient.get<AuthUser>("/auth/me"),

  refreshToken: (refreshToken: string) =>
    apiClient.post<{ accessToken: string }>("/auth/refresh", { refreshToken }),

  logout: () =>
    apiClient.post("/auth/logout"),
}
```

---

## Types that pair with this API — `src/modules/auth/types/auth.types.ts`

```ts
export interface AuthUser {
  id: string
  email: string
  name: string
  role: "admin" | "member"
}

export interface AuthResponse {
  user: AuthUser
  accessToken: string
  refreshToken: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}
```

---

## File upload example

```ts
uploadAvatar: (id: string, file: File) => {
  const form = new FormData()
  form.append("avatar", file)
  return apiClient.post<{ url: string }>(
    `/users/${id}/avatar`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  )
},
```

---

## Layer responsibilities

| Layer | File | Responsibility |
|---|---|---|
| **API** | `api/<module>.api.ts` | Raw HTTP calls, type the response shape |
| **Service** | `<module>.service.ts` | Business logic, calls API, returns clean data |
| **Hook** | `hooks/use<Name>.ts` | React state, calls service, exposes to UI |
| **Component** | `components/` `pages/` | Renders UI, calls hooks only |

> Components must never import from `api/`. That boundary is enforced by going through the service → hook chain.

---

## Conventions

- Named export: `export const <module>Api = { ... }`
- Every method is typed — use the types from `../types/<module>.types`
- No `any` — generic typed responses: `apiClient.get<MyType>(...)`
- URL segments use template literals: `` `/<module>s/${id}` `` — not string concatenation
- Query params passed as `{ params }` axios option, never string-interpolated into the URL
- No `try/catch` here — errors bubble up to the service layer
