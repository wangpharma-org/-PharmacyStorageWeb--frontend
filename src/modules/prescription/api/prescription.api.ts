import { prescriptionApiClient } from "@/services/api"
import type {
  Prescription,
  CreatePrescriptionPayload,
  UpdatePrescriptionPayload,
  FindPrescriptionsParams,
  PrescriptionListResponse,
  RetryReservePayload,
  ProductInfo,
  FindProductsParams,
  PrescriptionStats,
  PrescriptionRoomSnapshot,
  PrescriptionMedicineSnapshot
} from "../types/prescription.types"
import type { ListParams, PaginatedResponse } from "@/modules/storage/types/stock.types"

export const prescriptionApi = {
  // Get all prescriptions with filters
  getAll: (params?: FindPrescriptionsParams) =>
    prescriptionApiClient.get<PrescriptionListResponse>("/prescriptions", { params }),

  // Get single prescription by ID
  getById: (id: string) =>
    prescriptionApiClient.get<Prescription>(`/prescriptions/${id}`),

  // Create new prescription
  create: (payload: CreatePrescriptionPayload) =>
    prescriptionApiClient.post<Prescription>("/prescriptions", payload),

  // Update prescription
  update: (id: string, payload: UpdatePrescriptionPayload) =>
    prescriptionApiClient.patch<Prescription>(`/prescriptions/${id}`, payload),

  // Delete prescription
  remove: (id: string) =>
    prescriptionApiClient.delete(`/prescriptions/${id}`),

  // Retry stock reservation for failed items
  retryReserve: (id: string, payload?: RetryReservePayload) =>
    prescriptionApiClient.post<Prescription>(`/prescriptions/${id}/retry`, payload || {}),

  // Get problematic prescriptions
  getProblematic: (params?: Omit<FindPrescriptionsParams, 'status'>) =>
    prescriptionApiClient.get<PrescriptionListResponse>("/prescriptions/problematic", { params }),

  // Search products for prescription items
  searchProducts: (params?: FindProductsParams) =>
    prescriptionApiClient.get<ProductInfo[]>("/prescriptions/products/search", { params }),

  // Get prescription statistics
  getStats: (startDate?: string, endDate?: string) =>
    prescriptionApiClient.get<PrescriptionStats>("/prescriptions/stats", { 
      params: { startDate, endDate } 
    }),

  // Cancel prescription
  cancel: (id: string, reason?: string) =>
    prescriptionApiClient.post<Prescription>(`/prescriptions/${id}/cancel`, { reason }),

  // Mark as dispensed
  markDispensed: (id: string, dispensedBy?: string) =>
    prescriptionApiClient.post<Prescription>(`/prescriptions/${id}/dispense`, { dispensedBy }),

  // Complete prescription
  complete: (id: string, completedBy?: string) =>
    prescriptionApiClient.post<Prescription>(`/prescriptions/${id}/complete`, { completedBy }),

  // Update item reserve status (for real-time updates)
  updateItemStatus: (prescriptionId: string, itemId: string, status: any) =>
    prescriptionApiClient.patch(`/prescriptions/${prescriptionId}/items/${itemId}`, { status }),

  getRoomSnapshotAll: (params?: ListParams) =>
    prescriptionApiClient.get<PaginatedResponse<PrescriptionRoomSnapshot>>("/stock-snapshots", { params }),

  getMedicineSnapshotAll: (params?: ListParams) =>
    prescriptionApiClient.get<PaginatedResponse<PrescriptionMedicineSnapshot>>("/medicine-snapshots", { params }),
}