# Skill: new-page

Add a new page component inside the correct module.

## Usage

```
/new-page <module>/<PageName>
```

Examples:
- `/new-page auth/LoginPage`
- `/new-page user/ProfilePage`
- `/new-page dashboard/OverviewPage`

---

## File location

Pages live at:
```
src/modules/<module>/pages/<PageName>.tsx
```

For a page that doesn't belong to any module (e.g. a standalone marketing page):
```
src/pages/<PageName>.tsx
```

---

## Template

```tsx
// src/modules/<module>/pages/<PageName>.tsx

export function <PageName>() {
  return (
    <div>
      {/* page content */}
    </div>
  )
}
```

---

## Full example — `src/modules/user/pages/ProfilePage.tsx`

```tsx
import { useParams } from "react-router-dom"

import { useUserById } from "../hooks/useUser"
import { UserCard } from "../components/UserCard"

export function ProfilePage() {
  const { id } = useParams<{ id: string }>()
  const { user, isLoading, error } = useUserById(id!)

  if (isLoading) {
    return <div className="p-8 text-muted-foreground text-sm">Loading…</div>
  }

  if (error || !user) {
    return <div className="p-8 text-destructive text-sm">{error ?? "Not found"}</div>
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <UserCard user={user} />
    </div>
  )
}
```

---

## After creating the page

### 1. Register the route in `src/app/router.tsx`

```tsx
import { <PageName> } from "@/modules/<module>/pages/<PageName>"

// Add inside the correct route group:
{
  path: "<slug>",
  element: <<PageName> />,
}
```

### 2. Choose the right layout

Wrap in a layout if the route needs shared chrome (navbar, sidebar):

```tsx
// Protected/app route → uses MainLayout
{
  path: "app",
  element: <MainLayout />,
  children: [
    { path: "profile/:id", element: <ProfilePage /> },
  ],
}

// Auth route → uses AuthLayout
{
  path: "auth",
  element: <AuthLayout />,
  children: [
    { path: "login", element: <LoginPage /> },
  ],
}
```

---

## Layouts reference

| Layout | Location | Use for |
|---|---|---|
| `MainLayout` | `src/layouts/MainLayout.tsx` | Authenticated app pages |
| `AuthLayout` | `src/layouts/AuthLayout.tsx` | Login, register, forgot password |
| `RootLayout` | `src/app/layouts/RootLayout.tsx` | Top-level shell (providers only) |

---

## Conventions

- Named export: `export function <PageName>() {}`
- No `default` export
- Page file = route boundary — keep it thin; delegate data fetching to hooks, UI to components
- Use `useParams`, `useNavigate`, `useSearchParams` from `react-router-dom` for routing state
- Load states: always handle `isLoading` and `error` before rendering content
