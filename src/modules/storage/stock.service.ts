import { roomApi, zoneApi, rackApi, shelfApi } from "./api/stock.api"
import type {
  Room, CreateRoomPayload, UpdateRoomPayload,
  Zone, CreateZonePayload, UpdateZonePayload,
  Rack, CreateRackPayload, UpdateRackPayload,
  Shelf, CreateShelfPayload, UpdateShelfPayload,
  PaginatedResponse,
  ListParams, FindZonesParams, FindRacksParams, FindShelvesParams,
} from "./types/stock.types"

// ─── Rooms ───────────────────────────────────────────────────────
export const roomService = {
  getAll: async (params?: ListParams): Promise<PaginatedResponse<Room>> => {
    const { data } = await roomApi.getAll(params)
    return data
  },
  getById: async (id: string): Promise<Room> => {
    const { data } = await roomApi.getById(id)
    return data
  },
  create: async (payload: CreateRoomPayload): Promise<Room> => {
    const { data } = await roomApi.create(payload)
    return data
  },
  update: async (id: string, payload: UpdateRoomPayload): Promise<Room> => {
    const { data } = await roomApi.update(id, payload)
    return data
  },
  remove: async (id: string): Promise<void> => {
    await roomApi.remove(id)
  },
}

// ─── Zones ───────────────────────────────────────────────────────
export const zoneService = {
  getAll: async (params?: FindZonesParams): Promise<PaginatedResponse<Zone>> => {
    const { data } = await zoneApi.getAll(params)
    return data
  },
  getById: async (id: string): Promise<Zone> => {
    const { data } = await zoneApi.getById(id)
    return data
  },
  create: async (payload: CreateZonePayload): Promise<Zone> => {
    const { data } = await zoneApi.create(payload)
    return data
  },
  update: async (id: string, payload: UpdateZonePayload): Promise<Zone> => {
    const { data } = await zoneApi.update(id, payload)
    return data
  },
  remove: async (id: string): Promise<void> => {
    await zoneApi.remove(id)
  },
}

// ─── Racks ───────────────────────────────────────────────────────
export const rackService = {
  getAll: async (params?: FindRacksParams): Promise<PaginatedResponse<Rack>> => {
    const { data } = await rackApi.getAll(params)
    return data
  },
  getById: async (id: string): Promise<Rack> => {
    const { data } = await rackApi.getById(id)
    return data
  },
  create: async (payload: CreateRackPayload): Promise<Rack> => {
    const { data } = await rackApi.create(payload)
    return data
  },
  update: async (id: string, payload: UpdateRackPayload): Promise<Rack> => {
    const { data } = await rackApi.update(id, payload)
    return data
  },
  remove: async (id: string): Promise<void> => {
    await rackApi.remove(id)
  },
}

// ─── Shelves ─────────────────────────────────────────────────────
export const shelfService = {
  getAll: async (params?: FindShelvesParams): Promise<PaginatedResponse<Shelf>> => {
    const { data } = await shelfApi.getAll(params)
    return data
  },
  getById: async (id: string): Promise<Shelf> => {
    const { data } = await shelfApi.getById(id)
    return data
  },
  create: async (payload: CreateShelfPayload): Promise<Shelf> => {
    const { data } = await shelfApi.create(payload)
    return data
  },
  update: async (id: string, payload: UpdateShelfPayload): Promise<Shelf> => {
    const { data } = await shelfApi.update(id, payload)
    return data
  },
  remove: async (id: string): Promise<void> => {
    await shelfApi.remove(id)
  },
}
