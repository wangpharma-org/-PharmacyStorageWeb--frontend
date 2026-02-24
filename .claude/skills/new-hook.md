# Skill: new-hook

Create a custom React hook — either a module-scoped hook or a global hook.

## Usage

```
/new-hook <module>/use<Name>     # module hook → src/modules/<module>/hooks/use<Name>.ts
/new-hook global/use<Name>       # global hook → src/hooks/use<Name>.ts
```

Examples:
- `/new-hook auth/useAuth`         → `src/modules/auth/hooks/useAuth.ts`
- `/new-hook user/useUserList`     → `src/modules/user/hooks/useUserList.ts`
- `/new-hook global/useLocalStorage` → `src/hooks/useLocalStorage.ts`

---

## Module hook — data fetching (fetch-on-mount)

Used when the project does **not** use TanStack Query.

```ts
// src/modules/<module>/hooks/use<Name>List.ts
import { useCallback, useEffect, useState } from "react"
import { <module>Service } from "../<module>.service"
import type { <Module> } from "../types/<module>.types"

interface Use<Module>ListResult {
  items: <Module>[]
  isLoading: boolean
  error: string | null
  refetch: () => void
}

export function use<Module>List(): Use<Module>ListResult {
  const [items, setItems] = useState<<Module>[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(() => {
    setIsLoading(true)
    setError(null)
    <module>Service
      .getAll()
      .then(setItems)
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Failed to load"
        setError(message)
      })
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { items, isLoading, error, refetch: fetch }
}
```

---

## Module hook — single item by ID

```ts
// src/modules/<module>/hooks/use<Module>ById.ts
import { useEffect, useState } from "react"
import { <module>Service } from "../<module>.service"
import type { <Module> } from "../types/<module>.types"

export function use<Module>ById(id: string) {
  const [item, setItem] = useState<<Module> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    <module>Service
      .getById(id)
      .then(setItem)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Not found")
      })
      .finally(() => setIsLoading(false))
  }, [id])

  return { item, isLoading, error }
}
```

---

## Module hook — mutation (create / update / delete)

```ts
// src/modules/<module>/hooks/useCreate<Module>.ts
import { useState } from "react"
import { <module>Service } from "../<module>.service"
import type { Create<Module>Payload, <Module> } from "../types/<module>.types"

export function useCreate<Module>() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function create(payload: Create<Module>Payload): Promise<<Module> | null> {
    setIsLoading(true)
    setError(null)
    try {
      const result = await <module>Service.create(payload)
      return result
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create")
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { create, isLoading, error }
}
```

---

## Module hook — with TanStack Query

When the project uses `@tanstack/react-query`:

```ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { <module>Service } from "../<module>.service"
import type { Create<Module>Payload } from "../types/<module>.types"

const QUERY_KEY = ["<module>s"] as const

export function use<Module>List() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => <module>Service.getAll(),
  })
}

export function useCreate<Module>() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: Create<Module>Payload) => <module>Service.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
```

---

## Global hook — `useAuth`

```ts
// src/hooks/useAuth.ts
import { tokenService } from "@/services/token.service"

export function useAuth() {
  const isAuthenticated = tokenService.isAuthenticated()

  function logout() {
    tokenService.clearTokens()
    window.location.href = "/auth/login"
  }

  return { isAuthenticated, logout }
}
```

---

## Global hook — `useLocalStorage`

```ts
// src/hooks/useLocalStorage.ts
import { useState } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  function setValue(value: T | ((prev: T) => T)) {
    const next = value instanceof Function ? value(storedValue) : value
    setStoredValue(next)
    window.localStorage.setItem(key, JSON.stringify(next))
  }

  return [storedValue, setValue] as const
}
```

---

## Global hook — `useDebounce`

```ts
// src/hooks/useDebounce.ts
import { useEffect, useState } from "react"

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
```

---

## Conventions

- Hook file names: `use<Name>.ts` (camelCase, starts with `use`)
- Always return a typed object — not a tuple (unless the hook is a simple pair like `useLocalStorage`)
- Define a return type interface when the return shape is complex: `interface UseXResult { ... }`
- Hooks call **services**, never API functions directly
- No `any` — use `unknown` and narrow errors: `err instanceof Error ? err.message : "Unknown error"`
- Global hooks live in `src/hooks/`, module hooks in `src/modules/<module>/hooks/`
