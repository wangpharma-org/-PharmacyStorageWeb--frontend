import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { adminService } from "../admin.service"
import type { CreateRolePayload, UpdateRolePayload } from "../types/admin.types"

export function useRoles() {
  return useQuery({
    queryKey: ["admin", "roles"],
    queryFn: adminService.getRoles,
  })
}

export function usePermissions() {
  return useQuery({
    queryKey: ["admin", "permissions"],
    queryFn: adminService.getPermissions,
  })
}

export function useCreateRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateRolePayload) => adminService.createRole(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "roles"] })
    },
  })
}

export function useUpdateRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRolePayload }) =>
      adminService.updateRole(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "roles"] })
    },
  })
}

export function useDeleteRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminService.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "roles"] })
    },
  })
}
