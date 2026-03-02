
import { productApiClient } from "@/services/api"
import type {
  Medicine,
  CreateMedicinePayload,
  UpdateMedicinePayload,
  FindMedicinesParams,
} from "../types/medicine.types"
import type { ListParams, MedicineRoomSnapshot, PaginatedResponse } from "../types/stock.types"

export const medicineApi = {
  getAll: (params?: FindMedicinesParams) =>
    productApiClient.get<PaginatedResponse<Medicine>>("/medicines", { params }),

  getById: (id: string) =>
    productApiClient.get<Medicine>(`/medicines/${id}`),

  create: (payload: CreateMedicinePayload) =>
    productApiClient.post<Medicine>("/medicines", payload),

  update: (id: string, payload: UpdateMedicinePayload) =>
    productApiClient.patch<Medicine>(`/medicines/${id}`, payload),

  remove: (id: string) =>
    productApiClient.delete<void>(`/medicines/${id}`),

  getRoomSnapshotAll: (params?: ListParams) =>
    productApiClient.get<PaginatedResponse<MedicineRoomSnapshot>>("/stock-snapshots", { params }),
}
