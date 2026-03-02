import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { prescriptionService } from "../prescription.service"
import type {
  CreatePrescriptionPayload,
  UpdatePrescriptionPayload,
  FindPrescriptionsParams,
  RetryReservePayload,
  FindProductsParams
} from "../types/prescription.types"
import type { ListParams } from "@/modules/storage/types/stock.types"
import type { FindMedicinesParams } from "@/modules/storage/types/medicine.types"

// Query key factory for consistent cache management
export const prescriptionKeys = {
  all: ["prescription"] as const,
  lists: () => [...prescriptionKeys.all, "list"] as const,
  list: (params?: FindPrescriptionsParams) => [...prescriptionKeys.lists(), params] as const,
  details: () => [...prescriptionKeys.all, "detail"] as const,
  detail: (id: string) => [...prescriptionKeys.details(), id] as const,
  problematic: (params?: Omit<FindPrescriptionsParams, 'status'>) => 
    [...prescriptionKeys.all, "problematic", params] as const,
  products: (params?: FindProductsParams) => 
    [...prescriptionKeys.all, "products", params] as const,
  stats: (startDate?: string, endDate?: string) => 
    [...prescriptionKeys.all, "stats", { startDate, endDate }] as const,
}

// Get prescriptions with filtering and pagination
export function usePrescriptions(params?: FindPrescriptionsParams) {
  return useQuery({
    queryKey: prescriptionKeys.list(params),
    queryFn: () => prescriptionService.getAll(params),
    staleTime: 30_000, // 30 seconds
  })
}

// Get single prescription by ID
export function usePrescriptionById(id: string) {
  return useQuery({
    queryKey: prescriptionKeys.detail(id),
    queryFn: () => prescriptionService.getById(id),
    enabled: !!id,
    staleTime: 10_000, // 10 seconds
  })
}

// Get problematic prescriptions
export function useProblematicPrescriptions(params?: Omit<FindPrescriptionsParams, 'status'>) {
  return useQuery({
    queryKey: prescriptionKeys.problematic(params),
    queryFn: () => prescriptionService.getProblematic(params),
    staleTime: 15_000, // 15 seconds
  })
}

// Search products for prescription creation
export function useProductSearch(params?: FindProductsParams) {
  return useQuery({
    queryKey: prescriptionKeys.products(params),
    queryFn: () => prescriptionService.searchProducts(params),
    enabled: !!params?.search && params.search.length > 0,
    staleTime: 60_000, // 1 minute
  })
}

// Get prescription statistics  
export function usePrescriptionStats(startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: prescriptionKeys.stats(startDate, endDate),
    queryFn: () => prescriptionService.getStats(startDate, endDate),
    staleTime: 300_000, // 5 minutes
  })
}

// Create new prescription mutation
export function useCreatePrescription() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (payload: CreatePrescriptionPayload) => prescriptionService.create(payload),
    onSuccess: (newPrescription) => {
      // Invalidate all prescription lists
      void queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: prescriptionKeys.stats() })
      
      // Set the new prescription in cache
      queryClient.setQueryData(
        prescriptionKeys.detail(newPrescription.id),
        newPrescription
      )
    },
  })
}

// Update prescription mutation
export function useUpdatePrescription() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePrescriptionPayload }) =>
      prescriptionService.update(id, payload),
    onSuccess: (updatedPrescription) => {
      // Update the detail cache
      queryClient.setQueryData(
        prescriptionKeys.detail(updatedPrescription.id),
        updatedPrescription
      )
      
      // Invalidate lists to reflect changes
      void queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: prescriptionKeys.problematic() })
    },
  })
}

// Delete prescription mutation
export function useDeletePrescription() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => prescriptionService.remove(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: prescriptionKeys.detail(id) })
      
      // Invalidate lists
      void queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: prescriptionKeys.stats() })
    },
  })
}

// Retry stock reservation mutation
export function useRetryReserve() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: RetryReservePayload }) =>
      prescriptionService.retryReserve(id, payload),
    onSuccess: (updatedPrescription) => {
      // Update the detail cache
      queryClient.setQueryData(
        prescriptionKeys.detail(updatedPrescription.id),
        updatedPrescription
      )
      
      // Refresh lists to show updated status
      void queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: prescriptionKeys.problematic() })
    },
  })
}

// Cancel prescription mutation
export function useCancelPrescription() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      prescriptionService.cancel(id, reason),
    onSuccess: (updatedPrescription) => {
      queryClient.setQueryData(
        prescriptionKeys.detail(updatedPrescription.id),
        updatedPrescription
      )
      void queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() })
    },
  })
}

// Mark as dispensed mutation
export function useMarkDispensed() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, dispensedBy }: { id: string; dispensedBy?: string }) =>
      prescriptionService.markDispensed(id, dispensedBy),
    onSuccess: (updatedPrescription) => {
      queryClient.setQueryData(
        prescriptionKeys.detail(updatedPrescription.id),
        updatedPrescription
      )
      void queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() })
    },
  })
}

// Complete prescription mutation  
export function useCompletePrescription() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, completedBy }: { id: string; completedBy?: string }) =>
      prescriptionService.complete(id, completedBy),
    onSuccess: (updatedPrescription) => {
      queryClient.setQueryData(
        prescriptionKeys.detail(updatedPrescription.id),
        updatedPrescription
      )
      void queryClient.invalidateQueries({ queryKey: prescriptionKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: prescriptionKeys.stats() })
    },
  })
}

export function usePrescriptionRoomSnapshots(params?: ListParams) {
  return useQuery({
    queryKey: ["storage", "rooms", params],
    queryFn: () => prescriptionService.getRoomSnapshotAll(params),
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  })
}

export function usePrescriptionMedicineSnapshots(params?: FindMedicinesParams) {
  return useQuery({
    queryKey: ["storage", "medicines", params],
    queryFn: () => prescriptionService.getMedicineSnapshotAll(params),
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  })
}