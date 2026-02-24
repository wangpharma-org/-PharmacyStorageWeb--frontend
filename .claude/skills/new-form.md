# Skill: new-form

Create a validated form using `react-hook-form` + shadcn/ui Field components.

## Usage

```
/new-form <module>/<FormName>
```

Examples:
- `/new-form auth/LoginForm`
- `/new-form user/EditProfileForm`
- `/new-form product/CreateProductForm`

---

## File location

```
src/modules/<module>/components/<FormName>.tsx
```

---

## Required imports

```tsx
import { useForm } from "react-hook-form"

import { Button }     from "@/components/ui/button"
import { Input }      from "@/components/ui/input"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
```

Additional inputs as needed:
```tsx
import { Textarea }  from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
```

---

## Full template

```tsx
// src/modules/<module>/components/<FormName>.tsx
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import type { <FormData>Payload } from "../types/<module>.types"

interface <FormName>Props {
  onSubmit: (data: <FormData>Payload) => Promise<void>
  defaultValues?: Partial<<FormData>Payload>
}

export function <FormName>({ onSubmit, defaultValues }: <FormName>Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<<FormData>Payload>({ defaultValues })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>

        <Field data-invalid={!!errors.<fieldName>}>
          <FieldLabel htmlFor="<formName>-<fieldName>">Label text</FieldLabel>
          <Input
            id="<formName>-<fieldName>"
            type="text"
            placeholder="…"
            aria-invalid={!!errors.<fieldName>}
            {...register("<fieldName>", { required: "Required" })}
          />
          <FieldError errors={[errors.<fieldName>]} />
        </Field>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save"}
        </Button>

      </FieldGroup>
    </form>
  )
}
```

---

## Validation patterns

### Required text
```tsx
{...register("name", { required: "Name is required" })}
```

### Email
```tsx
{...register("email", {
  required: "Email is required",
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Enter a valid email address",
  },
})}
```

### Password (min length)
```tsx
{...register("password", {
  required: "Password is required",
  minLength: { value: 8, message: "At least 8 characters" },
})}
```

### Confirm password (match)
```tsx
const { watch } = useForm<…>()

{...register("confirmPassword", {
  required: "Please confirm your password",
  validate: (value) =>
    value === watch("password") || "Passwords do not match",
})}
```

### Number range
```tsx
{...register("age", {
  required: "Required",
  min: { value: 18, message: "Must be 18 or older" },
  max: { value: 120, message: "Invalid age" },
  valueAsNumber: true,
})}
```

---

## Select field pattern

```tsx
import { Controller } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// inside the form:
<Field data-invalid={!!errors.role}>
  <FieldLabel htmlFor="form-role">Role</FieldLabel>
  <Controller
    name="role"
    control={control}
    rules={{ required: "Role is required" }}
    render={({ field }) => (
      <Select value={field.value} onValueChange={field.onChange}>
        <SelectTrigger id="form-role" aria-invalid={!!errors.role}>
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="member">Member</SelectItem>
        </SelectContent>
      </Select>
    )}
  />
  <FieldError errors={[errors.role]} />
</Field>
```

---

## Calling the form from a page

```tsx
// In the page component:
import { <FormName> } from "../components/<FormName>"
import { <module>Service } from "../<module>.service"

export function SomePage() {
  async function handleSubmit(data: <FormData>Payload) {
    await <module>Service.create(data)
    // navigate or show success
  }

  return (
    <div className="mx-auto max-w-md py-10">
      <<FormName> onSubmit={handleSubmit} />
    </div>
  )
}
```

---

## Conventions

- `noValidate` is required on every `<form>` — prevents browser native validation
- `aria-invalid={!!errors.field}` on `<Input>` — triggers red ring via shadcn styles
- `data-invalid={!!errors.field}` on `<Field>` — triggers red label color
- `<FieldError errors={[errors.field]} />` renders the message or nothing when no error
- Never put form submission logic inside the form component — accept `onSubmit` as a prop
- Use `isSubmitting` from `formState` to disable the submit button during in-flight requests
- Type the form data with an interface from the module's `types/` file, not inline
