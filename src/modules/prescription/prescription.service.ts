import { prescriptionApi } from "./api/prescription.api"
import type {
  CreatePrescriptionPayload,
  UpdatePrescriptionPayload,
  FindPrescriptionsParams,
  RetryReservePayload,
  FindProductsParams
} from "./types/prescription.types"

export const prescriptionService = {
  // Get all prescriptions with pagination and filters  
  getAll: async (params?: FindPrescriptionsParams) => {
    const { data } = await prescriptionApi.getAll(params)
    return data
  },

  // Get prescription by ID
  getById: async (id: string) => {
    const { data } = await prescriptionApi.getById(id)
    return data
  },

  // Create new prescription
  create: async (payload: CreatePrescriptionPayload) => {
    const { data } = await prescriptionApi.create(payload)
    return data
  },

  // Update prescription
  update: async (id: string, payload: UpdatePrescriptionPayload) => {
    const { data } = await prescriptionApi.update(id, payload)
    return data
  },

  // Delete prescription
  remove: async (id: string) => {
    await prescriptionApi.remove(id)
  },

  // Retry stock reservation
  retryReserve: async (id: string, payload?: RetryReservePayload) => {
    const { data } = await prescriptionApi.retryReserve(id, payload)
    return data
  },

  // Get problematic prescriptions
  getProblematic: async (params?: Omit<FindPrescriptionsParams, 'status'>) => {
    const { data } = await prescriptionApi.getProblematic(params)
    return data
  },

  // Search products for prescription creation
  searchProducts: async (params?: FindProductsParams) => {
    const { data } = await prescriptionApi.searchProducts(params)
    return data
  },

  // Get statistics
  getStats: async (startDate?: string, endDate?: string) => {
    const { data } = await prescriptionApi.getStats(startDate, endDate)
    return data
  },

  // Cancel prescription
  cancel: async (id: string, reason?: string) => {
    const { data } = await prescriptionApi.cancel(id, reason)
    return data
  },

  // Mark as dispensed
  markDispensed: async (id: string, dispensedBy?: string) => {
    const { data } = await prescriptionApi.markDispensed(id, dispensedBy)
    return data
  },

  // Complete prescription
  complete: async (id: string, completedBy?: string) => {
    const { data } = await prescriptionApi.complete(id, completedBy)
    return data
  }
}