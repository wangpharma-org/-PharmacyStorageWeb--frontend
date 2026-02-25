// ─── Pagination ────────────────────────────────────────────────
export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

// ─── Room ───────────────────────────────────────────────────────
export interface Room {
  id: string
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateRoomPayload {
  name: string
  description?: string
}

export interface UpdateRoomPayload {
  name?: string
  description?: string
}

// ─── Zone ───────────────────────────────────────────────────────
export interface Zone {
  id: string
  name: string
  description: string | null
  roomId: string
  createdAt: string
  updatedAt: string
}

export interface CreateZonePayload {
  name: string
  description?: string
  roomId: string
}

export interface UpdateZonePayload {
  name?: string
  description?: string
  roomId?: string
}

// ─── Rack ───────────────────────────────────────────────────────
export interface Rack {
  id: string
  name: string
  description: string | null
  zoneId: string
  createdAt: string
  updatedAt: string
}

export interface CreateRackPayload {
  name: string
  description?: string
  zoneId: string
}

export interface UpdateRackPayload {
  name?: string
  description?: string
  zoneId?: string
}

// ─── Shelf ──────────────────────────────────────────────────────
export interface Shelf {
  id: string
  name: string
  description: string | null
  rackId: string
  medicineCode: string | null
  capacity: number | null
  quantity: number
  createdAt: string
  updatedAt: string
  medicineSnapshot: {
    medicineCode: string | null
    medicineName_en: string | null
    medicineName_th: string | null
  }
}

export interface CreateShelfPayload {
  name: string
  description?: string
  rackId: string
  medicineCode?: string
  capacity?: number
  quantity?: number
}

export interface UpdateShelfPayload {
  name?: string
  description?: string
  rackId?: string
  medicineCode?: string
  capacity?: number
  quantity?: number
}

// ─── Query params ────────────────────────────────────────────────
export interface ListParams {
  page?: number
  limit?: number
  name?: string
}

export interface FindZonesParams extends ListParams {
  roomId?: string
}

export interface FindRacksParams extends ListParams {
  zoneId?: string
}

export interface FindShelvesParams extends ListParams {
  rackId?: string
  medicineCode?: string
}
