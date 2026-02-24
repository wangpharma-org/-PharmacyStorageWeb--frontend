# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite)
npm run build     # Type-check + production build (tsc -b && vite build)
npm run lint      # ESLint
npm run preview   # Preview production build locally
```

There are no tests configured in this project.

To add shadcn/ui components:
```bash
npx shadcn add <component-name>
```

## Architecture

React 19 + TypeScript SPA built with Vite. Tailwind CSS v4 (configured via `@tailwindcss/vite` plugin — no `tailwind.config.js` file). shadcn/ui with the **radix-nova** style and **Base UI** primitives (not Radix UI directly).

**Path alias:** `@/` maps to `src/`.

### Directory structure

```
src/
├── app/                        # Application configuration
│   ├── router.tsx              # createBrowserRouter — all routes live here
│   ├── store.ts                # Global state store (if needed)
│   └── providers.tsx           # Context providers wrapper
│
├── modules/                    # Feature modules (Clean Architecture)
│   ├── auth/
│   │   ├── api/                # Raw axios calls only
│   │   ├── components/         # UI components scoped to this feature
│   │   ├── hooks/              # React hooks that call the service
│   │   ├── pages/              # Route-level page components
│   │   ├── types/              # TypeScript interfaces for this module
│   │   └── auth.service.ts     # Business logic — called by hooks
│   └── <feature>/              # Same structure for every feature
│
├── components/                 # Shared, reusable UI components
│   ├── ui/                     # shadcn-generated primitives (do not hand-edit)
│   ├── form/                   # Reusable form building blocks
│   └── layout/                 # Shared layout chrome (PageHeader, etc.)
│
├── layouts/
│   ├── MainLayout.tsx          # Authenticated app shell (navbar, sidebar)
│   └── AuthLayout.tsx          # Auth pages shell (centered card)
│
├── services/                   # Global services
│   ├── api.ts                  # Shared axios instance (apiClient)
│   ├── token.service.ts        # JWT access/refresh token management
│   └── interceptor.ts          # Axios 401 → refresh → retry logic
│
├── hooks/                      # Global hooks (useAuth, useDebounce, etc.)
├── utils/
│   ├── constants.ts
│   ├── helpers.ts
│   └── validators.ts
├── types/
│   └── global.d.ts             # Project-wide type declarations
├── assets/
├── index.css                   # Tailwind imports + CSS variable theme tokens
└── main.tsx                    # Entry point — mounts RouterProvider
```

### Module layer rules

| Layer | File | Calls | Never imports from |
|---|---|---|---|
| `api/` | `<module>.api.ts` | `@/services/api` | anything in the module |
| `service` | `<module>.service.ts` | `api/` only | `hooks/`, `components/`, `pages/` |
| `hooks/` | `use<Name>.ts` | `service` only | `api/` directly |
| `components/` `pages/` | `*.tsx` | `hooks/` only | `api/`, `service` |

**Key files:**
- `src/index.css` — Tailwind imports + CSS variable theme tokens (oklch color space, dark mode via `.dark` class)
- `src/lib/utils.ts` — `cn()` utility (clsx + tailwind-merge)
- `components.json` — shadcn configuration (style: radix-nova, icon library: lucide)

**Routing (React Router v7):**
- `src/app/router.tsx` — `createBrowserRouter` config; add new routes here
- `src/layouts/MainLayout.tsx` — authenticated app layout with `<Outlet />`
- `src/layouts/AuthLayout.tsx` — auth pages layout with `<Outlet />`
- `src/modules/<module>/pages/` — page components for that feature
- `src/main.tsx` — mounts `<RouterProvider router={router} />`

**Component structure:**
- `src/components/ui/` — shadcn-generated UI primitives (do not hand-edit; regenerate with `npx shadcn add`)
- `src/components/layout/` — shared layout chrome (PageHeader, Sidebar, etc.)
- `src/components/form/` — shared form building blocks
- `src/modules/<module>/components/` — components used only within that module

**Forms:** Use `react-hook-form`. Pair with `Field`, `FieldLabel`, `FieldError` from `@/components/ui/field`. Pass `aria-invalid={!!errors.field}` to `Input` to trigger error styles, and `data-invalid={!!errors.field}` to `Field` for label color. Always add `noValidate` to `<form>`. Form submission logic belongs in the page, not the form component — accept `onSubmit` as a prop.

**Dark mode:** Use the `.dark` class on a parent element. CSS variables are defined in `src/index.css` under `:root` and `.dark`. Use semantic color tokens, not hard-coded colors: `text-foreground`, `text-muted-foreground`, `bg-background`, `bg-muted`, `border-border`.

**Icons (lucide-react):**
```tsx
import { ArrowRightIcon } from "lucide-react"
<ArrowRightIcon data-icon="inline-end" />   // inline with adjacent text
<ArrowRightIcon className="size-4 text-muted-foreground" />  // standalone
```

**Button as link:**
```tsx
<Button asChild><Link to="/somewhere">Go</Link></Button>
```

## Skills

Scaffolding prompts live in `.claude/skills/`. Use them when creating any new file:

| Skill | Command | Creates |
|---|---|---|
| `new-module` | `/new-module <name>` | Complete feature module scaffold |
| `new-page` | `/new-page <module>/<PageName>` | Page inside a module |
| `new-component` | `/new-component <module>/<Name>` | Module or shared component |
| `new-form` | `/new-form <module>/<FormName>` | Form with react-hook-form + shadcn |
| `new-service` | `/new-service <module>` | Module service or global service |
| `new-hook` | `/new-hook <module>/use<Name>` | Data fetching or utility hook |
| `new-api` | `/new-api <module>` | API layer for a module |
| `add-shadcn` | `/add-shadcn <component>` | Install a shadcn/ui component |

## UI Style

### Aesthetic direction

**Modern SaaS UI** — clean, neutral, information-dense without feeling cluttered. Light theme as default with full dark mode support. Inspired by Linear, Vercel, and Notion: purposeful whitespace, crisp typography, subtle depth.

---

### Color — always use semantic tokens

Never hardcode hex values in shared/app UI. Use CSS variables via Tailwind semantic classes:

| Purpose | Class |
|---|---|
| Page background | `bg-background` |
| Card / surface | `bg-card` |
| Muted surface | `bg-muted` |
| Primary text | `text-foreground` |
| Secondary text | `text-muted-foreground` |
| Primary action | `bg-primary text-primary-foreground` |
| Borders | `border-border` |
| Input borders | `border-input` |
| Destructive / error | `text-destructive` `border-destructive` |
| Focus ring | `ring-ring` |

> Exception: the Login page and hero sections may use the signature dark-gold palette defined in `src/index.css`.

---

### Typography

| Role | Class | Usage |
|---|---|---|
| Page title | `text-2xl font-semibold tracking-tight` | H1 on each page |
| Section heading | `text-lg font-semibold` | Card titles, section labels |
| Body | `text-sm text-foreground` | Default prose text |
| Secondary / caption | `text-sm text-muted-foreground` | Descriptions, hints, timestamps |
| Label | `text-sm font-medium` | Form labels, column headers |
| Mono / code | `font-mono text-sm` | Codes, IDs, technical values |

Font stack: **Inter Variable** (`font-sans`) for all UI text. `font-cormorant` only for brand/hero display. `font-dm-mono` only for the login page and signature branding.

---

### Spacing & layout

- Page padding: `px-4 py-6 sm:px-6 sm:py-8` or `px-6 py-10`
- Max content width: `max-w-5xl mx-auto` (content) / `max-w-3xl mx-auto` (forms/articles)
- Section gaps: `space-y-6` between sections, `space-y-4` within a section
- Card padding: handled by `CardContent` (`px-4`) — do not add extra padding inside cards
- Grid layouts: `grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3`

---

### Components defaults

**Cards**
```tsx
// Standard content card
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Supporting text</CardDescription>
  </CardHeader>
  <CardContent>…</CardContent>
</Card>
```

**Buttons**
- Primary action: `<Button>` (default variant)
- Secondary / cancel: `<Button variant="outline">`
- Destructive: `<Button variant="destructive">`
- Subtle / nav: `<Button variant="ghost">`
- Page-level CTA: `size="lg"` — all other actions: `size="default"` or `size="sm"`

**Badges**
```tsx
<Badge variant="outline">Draft</Badge>        // neutral state
<Badge variant="secondary">Active</Badge>     // positive/active
<Badge variant="destructive">Error</Badge>    // error/danger
```

**Empty states**
```tsx
<div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
  <SomeIcon className="size-8 text-muted-foreground/50" />
  <p className="text-sm font-medium text-foreground">No items yet</p>
  <p className="text-sm text-muted-foreground">Add your first item to get started.</p>
  <Button size="sm">Add item</Button>
</div>
```

**Loading states** — use `Skeleton` component, never spinners for layout regions:
```tsx
import { Skeleton } from "@/components/ui/skeleton"
<Skeleton className="h-4 w-48" />
<Skeleton className="h-32 w-full rounded-xl" />
```

**Page header pattern**
```tsx
<div className="flex items-center justify-between gap-4 pb-6">
  <div>
    <h1 className="text-2xl font-semibold tracking-tight">Page Title</h1>
    <p className="text-sm text-muted-foreground">Supporting description</p>
  </div>
  <Button size="sm">Primary action</Button>
</div>
```

---

### Motion & transitions

- Use `transition-colors duration-150` on interactive elements (buttons, links, nav items)
- Use `transition-all duration-200` when size/shadow also changes
- Entrance animations only on hero/auth pages — not on app UI
- No animations on data tables or dense UI — keep it fast and responsive

---

### What to avoid

- No hardcoded colors (`text-[#333]`, `bg-white`) in shared components — use tokens
- No `text-black` / `text-white` — use `text-foreground` / `text-primary-foreground`
- No purple gradients, glassmorphism blurs, or heavy drop shadows in app UI
- No decorative fonts (Cormorant) in the app shell — only in marketing/auth pages
- No `inline-flex` gaps manually — use `gap-*` on the parent flex container

---

## Code Conventions

- Named exports only (no default exports)
- Function declarations for components: `export function MyComponent() {}`
- No `any` type — use `unknown` and narrow, or define an interface
- `cn()` for all className merging
- Tailwind utility classes only (no inline styles)
- File naming: `camelCase.ts` for logic files, `PascalCase.tsx` for components
- Every function/method that returns a promise must have a typed return annotation
