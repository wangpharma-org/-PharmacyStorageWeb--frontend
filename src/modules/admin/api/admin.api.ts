import { apiClient } from "@/services/api"
import type {
  AdminUser,
  Role,
  CreateRolePayload,
  CreateUserPayload,
  GetUsersQuery,
  UpdateRolePayload,
  UpdateUserPayload,
  AdminUserResponse,
  AdminRoleResponse,
  AdminPermissionResponse,
} from "../types/admin.types"

export const adminApi = {
  getUsers: (query?: GetUsersQuery) =>
    apiClient.get<AdminUserResponse>("/users", { params: query }),

  createUser: (payload: CreateUserPayload) =>
    apiClient.post<AdminUser>("/admin/users", payload),

  approveUser: (id: string) =>
    apiClient.patch<void>(`/admin/users/${id}/approve`),

  deapproveUser: (id: string) =>
    apiClient.patch<void>(`/admin/users/${id}/deapprove`),

  updateUser: (id: string, payload: UpdateUserPayload) =>
    apiClient.patch<AdminUser>(`/admin/users/${id}`, payload),

  softDeleteUser: (id: string) =>
    apiClient.patch<void>(`/admin/users/${id}/remove`),

  getRoles: () =>
    apiClient.get<AdminRoleResponse>("/roles"),

  createRole: (payload: CreateRolePayload) =>
    apiClient.post<Role>("/roles", payload),

  updateRole: (id: string, payload: UpdateRolePayload) =>
    apiClient.patch<Role>(`/roles/${id}`, payload),

  deleteRole: (id: string) =>
    apiClient.delete<void>(`/roles/${id}`),

  getPermissions: () =>
    apiClient.get<AdminPermissionResponse>("/permissions"),
}
