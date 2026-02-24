import { adminApi } from "./api/admin.api"
import type {
  AdminUser,
  GetUsersQuery,
  Role,
  CreateRolePayload,
  CreateUserPayload,
  UpdateRolePayload,
  UpdateUserPayload,
  AdminUserResponse,
  AdminRoleResponse,
  AdminPermissionResponse,
} from "./types/admin.types"

export const adminService = {
  getUsers: async (query?: GetUsersQuery): Promise<AdminUserResponse> => {
    const { data } = await adminApi.getUsers(query)
    return data
  },

  createUser: async (payload: CreateUserPayload): Promise<AdminUser> => {
    const { data } = await adminApi.createUser(payload)
    return data
  },

  approveUser: async (id: string): Promise<void> => {
    await adminApi.approveUser(id)
  },

  deapproveUser: async (id: string): Promise<void> => {
    await adminApi.deapproveUser(id)
  },
  
  updateUser: async (id: string, payload: UpdateUserPayload): Promise<AdminUser> => {
    const { data } = await adminApi.updateUser(id, payload)
    return data
  },

  softDeleteUser: async (id: string): Promise<void> => {
    await adminApi.softDeleteUser(id)
  },

  getRoles: async (): Promise<AdminRoleResponse> => {
    const { data } = await adminApi.getRoles()
    return data
  },

  createRole: async (payload: CreateRolePayload): Promise<Role> => {
    const { data } = await adminApi.createRole(payload)
    return data
  },

  updateRole: async (id: string, payload: UpdateRolePayload): Promise<Role> => {
    const { data } = await adminApi.updateRole(id, payload)
    return data
  },

  deleteRole: async (id: string): Promise<void> => {
    await adminApi.deleteRole(id)
  },

  getPermissions: async (): Promise<AdminPermissionResponse> => {
    const { data } = await adminApi.getPermissions()
    return data
  },
}
