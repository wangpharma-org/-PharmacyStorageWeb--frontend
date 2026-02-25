import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { roomService, zoneService, rackService, shelfService } from "../stock.service"
import type {
  CreateRoomPayload, UpdateRoomPayload, ListParams,
  CreateZonePayload, UpdateZonePayload, FindZonesParams,
  CreateRackPayload, UpdateRackPayload, FindRacksParams,
  CreateShelfPayload, UpdateShelfPayload, FindShelvesParams,
} from "../types/stock.types"


export function useRooms(params?: ListParams) {
  return useQuery({
    queryKey: ["storage", "rooms", params],
    queryFn: () => roomService.getAll(params),
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  })
}

export function useCreateRoom() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateRoomPayload) => roomService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["storage", "rooms"] })
    },
  })
}

export function useUpdateRoom() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRoomPayload }) =>
      roomService.update(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["storage", "rooms"] })
    },
  })
}

export function useDeleteRoom() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => roomService.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["storage", "rooms"] })
    },
  })
}

// ─── Zones ───────────────────────────────────────────────────────
export function useZones(params?: FindZonesParams) {
  return useQuery({
    queryKey: ["storage", "zones", params],
    queryFn: () => zoneService.getAll(params),
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  })
}

export function useCreateZone() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateZonePayload) => zoneService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["storage", "zones"] })
    },
  })
}

export function useUpdateZone() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateZonePayload }) =>
      zoneService.update(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["storage", "zones"] })
    },
  })
}

export function useDeleteZone() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => zoneService.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["storage", "zones"] })
    },
  })
}

// ─── Racks ───────────────────────────────────────────────────────
export function useRacks(params?: FindRacksParams) {
  return useQuery({
    queryKey: ["storage", "racks", params],
    queryFn: () => rackService.getAll(params),
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  })
}

export function useCreateRack() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateRackPayload) => rackService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["storage", "racks"] })
    },
  })
}

export function useUpdateRack() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRackPayload }) =>
      rackService.update(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["storage", "racks"] })
    },
  })
}

export function useDeleteRack() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => rackService.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["storage", "racks"] })
    },
  })
}

// ─── Shelves ─────────────────────────────────────────────────────
export function useShelves(params?: FindShelvesParams) {
  return useQuery({
    queryKey: ["storage", "shelves", params],
    queryFn: () => shelfService.getAll(params),
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  })
}

export function useCreateShelf() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateShelfPayload) => shelfService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["storage", "shelves"] })
    },
  })
}

export function useUpdateShelf() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateShelfPayload }) =>
      shelfService.update(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["storage", "shelves"] })
    },
  })
}

export function useDeleteShelf() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => shelfService.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["storage", "shelves"] })
    },
  })
}
