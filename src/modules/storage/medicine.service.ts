import { medicineApi } from "./api/medicine.api"
import type {
  Medicine,
  CreateMedicinePayload,
  UpdateMedicinePayload,
  FindMedicinesParams,
} from "./types/medicine.types"
import type { PaginatedResponse } from "./types/stock.types"

export const medicineService = {
  getAll: async (params?: FindMedicinesParams): Promise<PaginatedResponse<Medicine>> => {
    const { data } = await medicineApi.getAll(params)
    return data
  },

  getById: async (id: string): Promise<Medicine> => {
    const { data } = await medicineApi.getById(id)
    return data
  },

  create: async (payload: CreateMedicinePayload): Promise<Medicine> => {
    const { data } = await medicineApi.create(payload)
    return data
  },

  update: async (id: string, payload: UpdateMedicinePayload): Promise<Medicine> => {
    const { data } = await medicineApi.update(id, payload)
    return data
  },

  remove: async (id: string): Promise<void> => {
    await medicineApi.remove(id)
  },
}
