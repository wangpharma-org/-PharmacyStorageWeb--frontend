# Skill: add-shadcn

Add a shadcn/ui component to the project.

## Usage

```
/add-shadcn <component-name>
```

Examples:
- `/add-shadcn dialog`
- `/add-shadcn table`
- `/add-shadcn toast`
- `/add-shadcn command`

---

## Install command

```bash
npx shadcn add <component-name>
```

This writes the component into `src/components/ui/`. **Never hand-edit these files** — re-run the command to regenerate if the primitive needs updating.

---

## Common components and their import paths

| Component | Import |
|---|---|
| Button | `@/components/ui/button` |
| Input | `@/components/ui/input` |
| Textarea | `@/components/ui/textarea` |
| Label | `@/components/ui/label` |
| Field / FieldGroup | `@/components/ui/field` |
| Card | `@/components/ui/card` |
| Badge | `@/components/ui/badge` |
| Dialog | `@/components/ui/dialog` |
| Sheet | `@/components/ui/sheet` |
| Dropdown Menu | `@/components/ui/dropdown-menu` |
| Select | `@/components/ui/select` |
| Separator | `@/components/ui/separator` |
| Table | `@/components/ui/table` |
| Tabs | `@/components/ui/tabs` |
| Toast / Toaster | `@/components/ui/toast` |
| Tooltip | `@/components/ui/tooltip` |
| Alert Dialog | `@/components/ui/alert-dialog` |
| Avatar | `@/components/ui/avatar` |
| Skeleton | `@/components/ui/skeleton` |
| Combobox | `@/components/ui/combobox` |
| Input Group | `@/components/ui/input-group` |

---

## Usage patterns

### Button

```tsx
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

// Standard
<Button>Click me</Button>

// Variants: default | outline | secondary | ghost | destructive | link
<Button variant="outline">Cancel</Button>
<Button variant="destructive">Delete</Button>

// Sizes: default | sm | lg | icon | icon-sm | icon-lg | xs
<Button size="sm">Small</Button>

// As a router link
<Button asChild><Link to="/somewhere">Go</Link></Button>

// With icon inline
import { SaveIcon } from "lucide-react"
<Button><SaveIcon data-icon="inline-start" /> Save</Button>
```

---

### Dialog

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description text</DialogDescription>
    </DialogHeader>
    {/* body content */}
    <DialogFooter>
      <Button type="submit">Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### Table

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {items.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.status}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

### Toast

```tsx
// 1. Add <Toaster /> to the root layout (once)
import { Toaster } from "@/components/ui/toaster"
// in RootLayout or providers.tsx:
<Toaster />

// 2. Use the hook in any component
import { useToast } from "@/components/ui/use-toast"

const { toast } = useToast()

toast({
  title: "Saved",
  description: "Your changes have been saved.",
})

// Error toast
toast({
  variant: "destructive",
  title: "Error",
  description: "Something went wrong.",
})
```

---

### Alert Dialog (confirmation)

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## Project configuration

- **Style:** `radix-nova`
- **Icon library:** `lucide`
- **Base UI primitives** (not Radix UI directly)
- **Config file:** `components.json` at project root
- **Output dir:** `src/components/ui/`

Never modify `components.json` manually — use `npx shadcn init` to reconfigure.
