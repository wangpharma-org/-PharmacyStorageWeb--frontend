import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { adminService } from "../admin.service"
import type { CreateUserPayload, GetUsersQuery, UpdateUserPayload } from "../types/admin.types"

export function useUsers(query?: GetUsersQuery) {
  return useQuery({
    queryKey: ["admin", "users", query],
    queryFn: () => adminService.getUsers(query),
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => adminService.createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      adminService.updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
    },
  })
}

export function useApproveUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminService.approveUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
    },
  })
}

export function useDeapproveUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminService.deapproveUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
    },
  })
}

export function useSoftDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => adminService.softDeleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
    },
  })
}
