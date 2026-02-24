import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useRoles } from "../hooks/useRoles"
import { useCreateUser } from "../hooks/useUsers"
import type { CreateUserPayload } from "../types/admin.types"

interface InviteUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface InviteUserForm {
  firstName: string
  lastName: string
  email: string
  password: string
}

export function InviteUserModal({ open, onOpenChange }: InviteUserModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([])

  const { data: rolesData, isLoading: rolesLoading } = useRoles()
  const createUser = useCreateUser()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteUserForm>()

  // Reset form & role selection when modal closes
  useEffect(() => {
    if (!open) {
      reset()
      setSelectedRoleIds([])
      setShowPassword(false)
    }
  }, [open, reset])

  function toggleRole(id: string) {
    setSelectedRoleIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    )
  }

  function onSubmit(formData: InviteUserForm) {
    const payload: CreateUserPayload = {
      ...formData,
      roleIds: selectedRoleIds.length > 0 ? selectedRoleIds : undefined,
    }
    createUser.mutate(payload, {
      onSuccess: () => onOpenChange(false),
    })
  }

  const roles = rolesData?.data ?? []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>
            Create a new user account and optionally assign roles.
          </DialogDescription>
        </DialogHeader>

        <form id="invite-user-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup className="gap-4">

            {/* First name + Last name */}
            <div className="grid grid-cols-2 gap-3">
              <Field data-invalid={!!errors.firstName}>
                <FieldLabel
                  htmlFor="invite-firstName"
                  className="text-sm font-medium group-data-[invalid=true]/field:text-destructive"
                >
                  First name
                </FieldLabel>
                <Input
                  id="invite-firstName"
                  type="text"
                  placeholder="John"
                  autoComplete="given-name"
                  aria-invalid={!!errors.firstName}
                  className="h-9 text-sm aria-invalid:border-destructive"
                  {...register("firstName", {
                    required: "First name is required",
                    minLength: { value: 2, message: "Min 2 characters" },
                  })}
                />
                <FieldError errors={[errors.firstName]} className="text-xs text-destructive" />
              </Field>

              <Field data-invalid={!!errors.lastName}>
                <FieldLabel
                  htmlFor="invite-lastName"
                  className="text-sm font-medium group-data-[invalid=true]/field:text-destructive"
                >
                  Last name
                </FieldLabel>
                <Input
                  id="invite-lastName"
                  type="text"
                  placeholder="Doe"
                  autoComplete="family-name"
                  aria-invalid={!!errors.lastName}
                  className="h-9 text-sm aria-invalid:border-destructive"
                  {...register("lastName", {
                    required: "Last name is required",
                    minLength: { value: 2, message: "Min 2 characters" },
                  })}
                />
                <FieldError errors={[errors.lastName]} className="text-xs text-destructive" />
              </Field>
            </div>

            {/* Email */}
            <Field data-invalid={!!errors.email}>
              <FieldLabel
                htmlFor="invite-email"
                className="text-sm font-medium group-data-[invalid=true]/field:text-destructive"
              >
                Email
              </FieldLabel>
              <Input
                id="invite-email"
                type="email"
                placeholder="john@example.com"
                autoComplete="email"
                aria-invalid={!!errors.email}
                className="h-9 text-sm aria-invalid:border-destructive"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
              />
              <FieldError errors={[errors.email]} className="text-xs text-destructive" />
            </Field>

            {/* Password */}
            <Field data-invalid={!!errors.password}>
              <FieldLabel
                htmlFor="invite-password"
                className="text-sm font-medium group-data-[invalid=true]/field:text-destructive"
              >
                Password
              </FieldLabel>
              <div className="relative">
                <Input
                  id="invite-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 characters"
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  className="h-9 pr-9 text-sm aria-invalid:border-destructive"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Min 6 characters" },
                  })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 size-6 text-muted-foreground hover:bg-transparent hover:text-foreground"
                >
                  {showPassword ? <EyeOffIcon className="size-3.5" /> : <EyeIcon className="size-3.5" />}
                </Button>
              </div>
              <FieldError errors={[errors.password]} className="text-xs text-destructive" />
            </Field>

            {/* Roles */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Roles</p>
              {rolesLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-5 w-32" />
                  ))}
                </div>
              ) : roles.length === 0 ? (
                <p className="text-sm text-muted-foreground">No roles available.</p>
              ) : (
                <div className="max-h-40 space-y-2 overflow-y-auto rounded-md border border-border p-3">
                  {roles.map((role) => (
                    <label
                      key={role.id}
                      className="flex cursor-pointer items-center gap-2.5 select-none"
                    >
                      <Checkbox
                        checked={selectedRoleIds.includes(role.id)}
                        onCheckedChange={() => toggleRole(role.id)}
                        id={`role-${role.id}`}
                      />
                      <div className="min-w-0">
                        <span className="text-sm font-medium text-foreground">{role.name}</span>
                        {role.description && (
                          <span className="ml-1.5 text-xs text-muted-foreground">
                            — {role.description}
                          </span>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Server error */}
            {createUser.isError && (
              <p className="text-xs text-destructive">
                Failed to create user. Please try again.
              </p>
            )}

          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createUser.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="invite-user-form"
            disabled={createUser.isPending}
            className={cn("min-w-[100px]", createUser.isPending && "opacity-60")}
          >
            {createUser.isPending ? "Creating…" : "Create user"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
