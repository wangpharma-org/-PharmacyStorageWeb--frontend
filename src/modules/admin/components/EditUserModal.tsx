import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

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
import { useUpdateUser } from "../hooks/useUsers"
import type { AdminUser, UpdateUserPayload } from "../types/admin.types"

interface EditUserModalProps {
  user: AdminUser | null
  onOpenChange: (open: boolean) => void
}

interface EditUserForm {
  firstName: string
  lastName: string
  email: string
}

export function EditUserModal({ user, onOpenChange }: EditUserModalProps) {
  const open = !!user
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([])

  const { data: rolesData, isLoading: rolesLoading } = useRoles()
  const updateUser = useUpdateUser()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditUserForm>()

  // Populate form when a user is selected
  useEffect(() => {
    if (user) {
      reset({ firstName: user.firstName, lastName: user.lastName, email: user.email })
      setSelectedRoleIds(user.roles.map((r) => r.id))
    }
  }, [user, reset])

  // Reset on close
  useEffect(() => {
    if (!open) {
      reset()
      setSelectedRoleIds([])
    }
  }, [open, reset])

  function toggleRole(id: string) {
    setSelectedRoleIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    )
  }

  function onSubmit(formData: EditUserForm) {
    if (!user) return
    const payload: UpdateUserPayload = {
      ...formData,
      roleIds: selectedRoleIds,
    }
    updateUser.mutate({ id: user.id, payload }, {
      onSuccess: () => onOpenChange(false),
    })
  }

  const roles = rolesData?.data ?? []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and role assignments. Password cannot be changed here.
          </DialogDescription>
        </DialogHeader>

        <form id="edit-user-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup className="gap-4">

            {/* First name + Last name */}
            <div className="grid grid-cols-2 gap-3">
              <Field data-invalid={!!errors.firstName}>
                <FieldLabel
                  htmlFor="edit-firstName"
                  className="text-sm font-medium group-data-[invalid=true]/field:text-destructive"
                >
                  First name
                </FieldLabel>
                <Input
                  id="edit-firstName"
                  type="text"
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
                  htmlFor="edit-lastName"
                  className="text-sm font-medium group-data-[invalid=true]/field:text-destructive"
                >
                  Last name
                </FieldLabel>
                <Input
                  id="edit-lastName"
                  type="text"
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
                htmlFor="edit-email"
                className="text-sm font-medium group-data-[invalid=true]/field:text-destructive"
              >
                Email
              </FieldLabel>
              <Input
                id="edit-email"
                type="email"
                autoComplete="off"
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
                        id={`edit-role-${role.id}`}
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
            {updateUser.isError && (
              <p className="text-xs text-destructive">
                Failed to update user. Please try again.
              </p>
            )}

          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateUser.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-user-form"
            disabled={updateUser.isPending}
          >
            {updateUser.isPending ? "Saving…" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
