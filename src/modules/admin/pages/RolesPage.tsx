import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { PlusIcon, ShieldIcon, ShieldAlertIcon, Trash2Icon, PencilIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { useCreateRole, useDeleteRole, usePermissions, useRoles, useUpdateRole } from "../hooks/useRoles"
import type {CreateRolePayload, Permission, Role } from "../types/admin.types"

// ─── Permission matrix ──────────────────────────────────────────────────────

function groupByResource(permissions: Permission[]): Record<string, Permission[]> {
  return permissions.reduce<Record<string, Permission[]>>((acc, perm) => {
    if (!acc[perm.resource]) acc[perm.resource] = []
    acc[perm.resource].push(perm)
    return acc
  }, {})
}

interface PermissionMatrixProps {
  permissions: Permission[]
  selected: Set<string>
  onChange: (id: string, checked: boolean) => void
}

function PermissionMatrix({ permissions, selected, onChange }: PermissionMatrixProps) {
  const grouped = groupByResource(permissions)

  if (permissions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No permissions available.</p>
    )
  }

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([resource, perms]) => (
        <div key={resource}>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {resource}
          </p>
          <div className="flex flex-wrap gap-3">
            {perms.map((perm) => {
              const checked = selected.has(perm.id)
              return (
                <label
                  key={perm.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-1.5 transition-colors duration-150 hover:bg-muted",
                    checked && "border-primary bg-primary/5",
                  )}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(value) => onChange(perm.id, !!value)}
                  />
                  <span className="text-sm text-foreground">{perm.action}</span>
                </label>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Role form ───────────────────────────────────────────────────────────────

interface RoleFormValues {
  name: string
  description: string
}

interface RoleFormPanelProps {
  editingRole: Role | null
  permissions: Permission[]
  permissionsLoading: boolean
  onCancel: () => void
  onSaved: () => void
}

function RoleFormPanel({
  editingRole,
  permissions,
  permissionsLoading,
  onCancel,
  onSaved,
}: RoleFormPanelProps) {
  const createRole = useCreateRole()
  const updateRole = useUpdateRole()

  const [selectedPerms, setSelectedPerms] = useState<Set<string>>(new Set())

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleFormValues>({
    defaultValues: { name: "", description: "" },
  })

  useEffect(() => {
    if (editingRole) {
      reset({ name: editingRole.name, description: editingRole.description })
      setSelectedPerms(new Set(editingRole?.permissions?.map((p) => p.id)))
    } else {
      reset({ name: "", description: "" })
      setSelectedPerms(new Set())
    }
  }, [editingRole, reset])

  function handlePermissionChange(id: string, checked: boolean) {
    setSelectedPerms((prev) => {
      const next = new Set(prev)
      checked ? next.add(id) : next.delete(id)
      return next
    })
  }

  const onSubmit = async (values: RoleFormValues): Promise<void> => {
    const payload: CreateRolePayload = {
      name: values.name.trim(),
      description: values.description.trim(),
      permissionIds: Array.from(selectedPerms),
    }
    if (editingRole) {
      await updateRole.mutateAsync({ id: editingRole.id, payload })
    } else {
      await createRole.mutateAsync(payload)
    }
    onSaved()
  }

  const isPending = createRole.isPending || updateRole.isPending

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">
          {editingRole ? "Edit role" : "New role"}
        </CardTitle>
        <CardDescription>
          {editingRole
            ? "Update the role name, description, and assigned permissions."
            : "Define a new role and assign permissions to it."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <Field data-invalid={!!errors.name}>
            <FieldLabel>Name</FieldLabel>
            <Input
              {...register("name", { required: "Role name is required" })}
              placeholder="e.g. Editor"
              aria-invalid={!!errors.name}
            />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>

          <Field data-invalid={!!errors.description}>
            <FieldLabel>Description</FieldLabel>
            <Input
              {...register("description", { required: "Description is required" })}
              placeholder="Brief description of this role's purpose"
              aria-invalid={!!errors.description}
            />
            {errors.description && <FieldError>{errors.description.message}</FieldError>}
          </Field>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Permissions</p>
            {permissionsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20 rounded-md" />
                  <Skeleton className="h-8 w-20 rounded-md" />
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
              </div>
            ) : (
              <PermissionMatrix
                permissions={permissions || []}
                selected={selectedPerms}
                onChange={handlePermissionChange}
              />
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? "Saving…" : editingRole ? "Save changes" : "Create role"}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// ─── Role card ───────────────────────────────────────────────────────────────

interface RoleCardProps {
  role: Role
  isSelected: boolean
  onEdit: () => void
  onDelete: () => void
}

function RoleCard({ role, isSelected, onEdit, onDelete }: RoleCardProps) {
  const resourceCount = new Set(role?.permissions?.map((p) => p.resource)).size

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 transition-colors duration-150",
        isSelected && "border-primary/50 bg-primary/5",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className="text-sm font-semibold text-foreground">{role.name}</p>
        </div>
        <div className="flex shrink-0 gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="size-7 p-0"
            onClick={onEdit}
            aria-label="Edit role"
          >
            <PencilIcon className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="size-7 p-0 text-destructive hover:text-destructive"
            onClick={onDelete}
            aria-label="Delete role"
          >
            <Trash2Icon className="size-3.5" />
          </Button>
        </div>
      </div>

      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{role.description}</p>

      <Separator className="my-3" />

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span>
          <span className="font-medium text-foreground">{role?.permissions?.length}</span>{" "}
          {role?.permissions?.length === 1 ? "permission" : "permissions"}
        </span>
        {resourceCount > 0 && (
          <span>
            <span className="font-medium text-foreground">{resourceCount}</span>{" "}
            {resourceCount === 1 ? "resource" : "resources"}
          </span>
        )}
        <span>
          <span className="font-medium text-foreground">{role?.userCount}</span>{" "}
          {role?.userCount === 1 ? "user" : "users"}
        </span>
      </div>

      {role?.permissions?.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {Array.from(new Set(role.permissions.map((p) => p.resource)))
            .slice(0, 4)
            .map((resource) => (
              <Badge key={resource} variant="outline" className="text-[10px] font-normal">
                {resource}
              </Badge>
            ))}
          {new Set(role.permissions.map((p) => p.resource)).size > 4 && (
            <Badge variant="outline" className="text-[10px] font-normal">
              +{new Set(role.permissions.map((p) => p.resource)).size - 4} more
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export function RolesPage() {
  const { data: roles, isLoading: rolesLoading, isError: rolesError } = useRoles()
  const { data: permissions = [], isLoading: permsLoading } = usePermissions()
  const deleteRole = useDeleteRole()

  const [panel, setPanel] = useState<"closed" | "create" | "edit">("closed")
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null)

  function openCreate() {
    setSelectedRole(null)
    setPanel("create")
  }

  function openEdit(role: Role) {
    setSelectedRole(role)
    setPanel("edit")
  }

  function closePanel() {
    setPanel("closed")
    setSelectedRole(null)
  }

  function handleSaved() {
    closePanel()
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return
    deleteRole.mutate(deleteTarget.id)
    setDeleteTarget(null)
  }

  const showForm = panel !== "closed"

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Roles & Permissions</h1>
          <p className="text-sm text-muted-foreground">
            Define roles and control what each role can access.
          </p>
        </div>
        <Button size="sm" onClick={openCreate} disabled={showForm && panel === "create"}>
          <PlusIcon className="size-4" />
          New role
        </Button>
      </div>

      {/* Two-column layout: role list + form panel */}
      <div className={cn("gap-6", showForm ? "grid grid-cols-1 lg:grid-cols-[320px_1fr]" : "")}>
        {/* Roles list */}
        <div className="space-y-3">
          {rolesLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}

          {rolesError && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card py-16 text-center">
              <ShieldAlertIcon className="size-8 text-muted-foreground/50" />
              <p className="text-sm font-medium text-foreground">Failed to load roles</p>
            </div>
          )}

          {!rolesLoading && !rolesError && roles?.data.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card py-16 text-center">
              <ShieldIcon className="size-8 text-muted-foreground/50" />
              <p className="text-sm font-medium text-foreground">No roles yet</p>
              <p className="text-sm text-muted-foreground">
                Create your first role to get started.
              </p>
              <Button size="sm" onClick={openCreate}>
                <PlusIcon className="size-4" />
                New role
              </Button>
            </div>
          )}

          {!rolesLoading &&
            !rolesError &&
            roles?.data?.map((role) => (
              <RoleCard
                key={role.id}
                role={role}
                isSelected={selectedRole?.id === role.id && showForm}
                onEdit={() => openEdit(role)}
                onDelete={() => setDeleteTarget(role)}
              />
            ))}
        </div>

        {/* Form panel */}
        {showForm && (
          <RoleFormPanel
            editingRole={panel === "edit" ? selectedRole : null}
            permissions={Array.isArray(permissions) ? permissions : permissions?.data || []}
            permissionsLoading={permsLoading}
            onCancel={closePanel}
            onSaved={handleSaved}
          />
        )}
      </div>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete role?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the{" "}
              <span className="font-medium text-foreground">"{deleteTarget?.name}"</span> role
              and remove it from all users assigned to it. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
