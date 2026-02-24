export interface UserRole {
  id: string
  name: string
}

export interface AdminUser {
  id: string
  firstName: string
  lastName: string
  email: string
  roles: UserRole[]
  isActive: boolean
  approved: boolean
  lastLogin: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface AdminUserResponse {
  data: AdminUser[]
  meta: PaginationMeta
}

export interface Permission {
  id: string
  name: string
  description: string
  resource: string
  action: string
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
  userCount: number
  createdAt: string
}

export interface CreateRolePayload {
  name: string
  description: string
  permissionIds: string[]
}

export interface UpdateRolePayload {
  name?: string
  description?: string
  permissionIds?: string[]
}

export interface UpdateUserPayload {
  firstName?: string
  lastName?: string
  email?: string
  roleIds?: string[]
  isActive?: boolean
}

export interface GetUsersQuery {
  search?: string
  isActive?: boolean
  role?: string
  page?: number
  limit?: number
}

export interface AdminRoleResponse {
  data: Role[]
  meta: PaginationMeta
}

export interface AdminPermissionResponse {
  data: Permission[]
  meta: PaginationMeta
}

export interface CreateUserPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  roleIds?: string[]
}