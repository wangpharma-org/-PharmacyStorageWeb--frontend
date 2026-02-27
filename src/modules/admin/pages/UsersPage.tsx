import { useState } from "react"
import { MoreHorizontalIcon, SearchIcon, UserPlusIcon, ShieldAlertIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDebounce } from "@/hooks/useDebounce"
import { useApproveUser, useDeapproveUser, useSoftDeleteUser, useUsers } from "../hooks/useUsers"
import { InviteUserModal } from "../components/InviteUserModal"
import { EditUserModal } from "../components/EditUserModal"
import { Pagination } from "../../prescription/components/Pagination"
import type { AdminUser } from "../types/admin.types"

function UserAvatar({ user }: { user: AdminUser }) {
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
  return (
    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
      {initials || "?"}
    </span>
  )
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <div className="flex items-center gap-2.5">
              <Skeleton className="size-8 shrink-0 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-3.5 w-40" /></TableCell>
          <TableCell><Skeleton className="h-5 w-14 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-5 w-20 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
          <TableCell><Skeleton className="size-7 rounded-md" /></TableCell>
        </TableRow>
      ))}
    </>
  )
}

export function UsersPage() {
  const [search, setSearch] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null)
  const [editTarget, setEditTarget] = useState<AdminUser | null>(null)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)

  const debouncedSearch = useDebounce(search)
  const { data: users, isLoading, isError } = useUsers({
    ...(debouncedSearch && { search: debouncedSearch }),
    page,
    limit,
  })
  const approveUser = useApproveUser()
  const deapproveUser = useDeapproveUser()
  const softDeleteUser = useSoftDeleteUser()

  const filtered = users?.data ?? []

  function handleConfirmDelete() {
    if (!deleteTarget) return
    softDeleteUser.mutate(deleteTarget.id)
    setDeleteTarget(null)
  }

  function handlePageChange(newPage: number) {
    setPage(newPage)
  }

  function handleItemsPerPageChange(newLimit: number) {
    setLimit(newLimit)
    setPage(1) // Reset to first page when changing items per page
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">User Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage accounts, roles, and access for all users.
          </p>
        </div>
        <Button size="sm" onClick={() => setInviteOpen(true)}>
          <UserPlusIcon className="size-4" />
          Invite User
        </Button>
      </div>

      {/* Search bar */}
      <div className="relative max-w-sm">
        <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search users…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Approved</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead className="w-10"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableSkeleton />}

            {isError && (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                    <ShieldAlertIcon className="size-8 text-muted-foreground/50" />
                    <p className="text-sm font-medium text-foreground">Failed to load users</p>
                    <p className="text-sm text-muted-foreground">Check your connection and try again.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !isError && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                    <UserPlusIcon className="size-8 text-muted-foreground/50" />
                    <p className="text-sm font-medium text-foreground">No users found</p>
                    <p className="text-sm text-muted-foreground">
                      {search ? "Try a different search term." : "Invite someone to get started."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !isError && filtered.map((user) => (
              <TableRow key={user.id}>
                {/* User cell */}
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <UserAvatar user={user} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                  </div>
                </TableCell>

                {/* Email */}
                <TableCell className="text-muted-foreground">{user.email}</TableCell>

                {/* Status */}
                <TableCell>
                  <Badge variant={user.isActive ? "secondary" : "outline"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>

                {/* Approved */}
                <TableCell>
                  <Badge variant={user.approved ? "secondary" : "outline"}>
                    {user.approved ? "Approved" : "Pending"}
                  </Badge>
                </TableCell>

                {/* Roles */}
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.roles.length > 0 ? (
                      user.roles.map((role) => (
                        <Badge key={role.id} variant="outline" className="font-normal">
                          {role.name}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">No roles</span>
                    )}
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="size-8 p-0"
                        aria-label="User actions"
                      >
                        <MoreHorizontalIcon className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem onClick={() => setEditTarget(user)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.approved ? (
                        <DropdownMenuItem onClick={() => deapproveUser.mutate(user.id)}>
                          Deapprove
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => approveUser.mutate(user.id)}>
                          Approve
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setDeleteTarget(user)}
                      >
                        Delete user
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && !isError && users && users.meta.total > 0 && (
        <Pagination
          currentPage={users.meta.page}
          totalPages={users.meta.totalPages}
          totalItems={users.meta.total}
          itemsPerPage={users.meta.limit}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}

      {/* Invite user modal */}
      <InviteUserModal open={inviteOpen} onOpenChange={setInviteOpen} />

      {/* Edit user modal */}
      <EditUserModal user={editTarget} onOpenChange={(open) => !open && setEditTarget(null)} />

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.firstName} {deleteTarget?.lastName}
              </span>{" "}
              and revoke all their access. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
