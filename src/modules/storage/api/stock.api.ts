
import { stockApiClient } from "@/services/api"
import type {
  Room, CreateRoomPayload, UpdateRoomPayload,
  Zone, CreateZonePayload, UpdateZonePayload,
  Rack, CreateRackPayload, UpdateRackPayload,
  Shelf, CreateShelfPayload, UpdateShelfPayload,
  PaginatedResponse,
  ListParams, FindZonesParams, FindRacksParams, FindShelvesParams,
} from "../types/stock.types"

// ─── Rooms ──────────────────────────────────────────────────────
export const roomApi = {
  getAll: (params?: ListParams) =>
    stockApiClient.get<PaginatedResponse<Room>>("/rooms", { params }),

  getById: (id: string) =>
    stockApiClient.get<Room>(`/rooms/${id}`),

  create: (payload: CreateRoomPayload) =>
    stockApiClient.post<Room>("/rooms", payload),

  update: (id: string, payload: UpdateRoomPayload) =>
    stockApiClient.patch<Room>(`/rooms/${id}`, payload),

  remove: (id: string) =>
    stockApiClient.delete<void>(`/rooms/${id}`),
}

// ─── Zones ──────────────────────────────────────────────────────
export const zoneApi = {
  getAll: (params?: FindZonesParams) =>
    stockApiClient.get<PaginatedResponse<Zone>>("/zones", { params }),

  getById: (id: string) =>
    stockApiClient.get<Zone>(`/zones/${id}`),

  create: (payload: CreateZonePayload) =>
    stockApiClient.post<Zone>("/zones", payload),

  update: (id: string, payload: UpdateZonePayload) =>
    stockApiClient.patch<Zone>(`/zones/${id}`, payload),

  remove: (id: string) =>
    stockApiClient.delete<void>(`/zones/${id}`),
}

// ─── Racks ──────────────────────────────────────────────────────
export const rackApi = {
  getAll: (params?: FindRacksParams) =>
    stockApiClient.get<PaginatedResponse<Rack>>("/racks", { params }),

  getById: (id: string) =>
    stockApiClient.get<Rack>(`/racks/${id}`),

  create: (payload: CreateRackPayload) =>
    stockApiClient.post<Rack>("/racks", payload),

  update: (id: string, payload: UpdateRackPayload) =>
    stockApiClient.patch<Rack>(`/racks/${id}`, payload),

  remove: (id: string) =>
    stockApiClient.delete<void>(`/racks/${id}`),
}

// ─── Shelves ─────────────────────────────────────────────────────
export const shelfApi = {
  getAll: (params?: FindShelvesParams) =>
    stockApiClient.get<PaginatedResponse<Shelf>>("/shelves", { params }),

  getById: (id: string) =>
    stockApiClient.get<Shelf>(`/shelves/${id}`),

  create: (payload: CreateShelfPayload) =>
    stockApiClient.post<Shelf>("/shelves", payload),

  update: (id: string, payload: UpdateShelfPayload) =>
    stockApiClient.patch<Shelf>(`/shelves/${id}`, payload),

  remove: (id: string) =>
    stockApiClient.delete<void>(`/shelves/${id}`),
}
