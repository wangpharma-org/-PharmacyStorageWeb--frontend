# Skill: new-module

Scaffold a complete feature module under `src/modules/<name>/`.

## Usage

```
/new-module <module-name>
```

Example: `/new-module product`

---

## What to create

Generate every layer for the new module. Replace `<Name>` with the PascalCase module name and `<name>` with the kebab-case slug.

### Directory tree

```
src/modules/<name>/
├── api/
│   └── <name>.api.ts          # Raw API call functions (axios)
├── components/
│   └── <Name>Card.tsx          # Example component — delete if unused
├── hooks/
│   └── use<Name>.ts            # Primary data hook wrapping the API
├── pages/
│   └── <Name>Page.tsx          # Route-level page component
├── types/
│   └── <name>.types.ts         # All TS types/interfaces for this module
└── <name>.service.ts           # Business logic — calls api/, used by hooks/
```

---

## File templates

### `types/<name>.types.ts`

```ts
export interface <Name> {
  id: string
  // add fields here
}

export interface Create<Name>Payload {
  // fields for creation
}

export interface Update<Name>Payload {
  // fields for update
}
```

---

### `api/<name>.api.ts`

```ts
import { apiClient } from "@/services/api"
import type { <Name>, Create<Name>Payload, Update<Name>Payload } from "../types/<name>.types"

export const <name>Api = {
  getAll: () =>
    apiClient.get<<Name>[]>("/<name>s"),

  getById: (id: string) =>
    apiClient.get<<Name>>("/<name>s/:id".replace(":id", id)),

  create: (payload: Create<Name>Payload) =>
    apiClient.post<<Name>>("/<name>s", payload),

  update: (id: string, payload: Update<Name>Payload) =>
    apiClient.patch<<Name>>("/<name>s/:id".replace(":id", id), payload),

  remove: (id: string) =>
    apiClient.delete("/<name>s/:id".replace(":id", id)),
}
```

---

### `<name>.service.ts`

```ts
import { <name>Api } from "./api/<name>.api"
import type { Create<Name>Payload, Update<Name>Payload } from "./types/<name>.types"

export const <name>Service = {
  getAll: async () => {
    const { data } = await <name>Api.getAll()
    return data
  },

  getById: async (id: string) => {
    const { data } = await <name>Api.getById(id)
    return data
  },

  create: async (payload: Create<Name>Payload) => {
    const { data } = await <name>Api.create(payload)
    return data
  },

  update: async (id: string, payload: Update<Name>Payload) => {
    const { data } = await <name>Api.update(id, payload)
    return data
  },

  remove: async (id: string) => {
    await <name>Api.remove(id)
  },
}
```

---

### `hooks/use<Name>.ts`

```ts
import { useEffect, useState } from "react"
import { <name>Service } from "../<name>.service"
import type { <Name> } from "../types/<name>.types"

export function use<Name>List() {
  const [items, setItems] = useState<<Name>[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    <name>Service
      .getAll()
      .then(setItems)
      .catch(() => setError("Failed to load"))
      .finally(() => setIsLoading(false))
  }, [])

  return { items, isLoading, error }
}
```

> If the project uses TanStack Query, replace with `useQuery` / `useMutation` instead.

---

### `pages/<Name>Page.tsx`

```tsx
export function <Name>Page() {
  return (
    <div>
      <h1>{/* page content */}</h1>
    </div>
  )
}
```

---

### `components/<Name>Card.tsx`

```tsx
import type { <Name> } from "../types/<name>.types"

interface <Name>CardProps {
  item: <Name>
}

export function <Name>Card({ item }: <Name>CardProps) {
  return (
    <div>
      {/* render item */}
    </div>
  )
}
```

---

## After scaffolding

1. **Add route** — open `src/app/router.tsx` and add the new page:
   ```tsx
   import { <Name>Page } from "@/modules/<name>/pages/<Name>Page"

   // inside createBrowserRouter children:
   { path: "<name>", element: <<Name>Page /> }
   ```

2. **Register types** — if global types are needed, extend `src/types/global.d.ts`.

3. **Delete placeholder files** — remove any generated files that aren't needed for this module.

---

## Conventions

- Named exports only — `export function`, `export const`, `export interface`
- No `default` exports anywhere
- No `any` type — use `unknown` and narrow, or create a proper interface
- All className merging via `cn()` from `@/lib/utils`
- Tailwind utility classes only — no inline styles
- File naming: `camelCase` for `.ts` files, `PascalCase` for `.tsx` components
