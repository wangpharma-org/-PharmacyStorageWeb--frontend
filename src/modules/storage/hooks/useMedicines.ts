import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { medicineService } from "../medicine.service"
import type {
  CreateMedicinePayload,
  FindMedicinesParams,
  UpdateMedicinePayload,
} from "../types/medicine.types"

export function useMedicines(params?: FindMedicinesParams) {
  return useQuery({
    queryKey: ["storage", "medicines", params],
    queryFn: () => medicineService.getAll(params),
  })
}

export function useMedicineById(id: string) {
  return useQuery({
    queryKey: ["storage", "medicines", id],
    queryFn: () => medicineService.getById(id),
    enabled: !!id,
  })
}

export function useCreateMedicine() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateMedicinePayload) => medicineService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["storage", "medicines"] })
    },
  })
}

export function useUpdateMedicine() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateMedicinePayload }) =>
      medicineService.update(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["storage", "medicines"] })
    },
  })
}

export function useDeleteMedicine() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => medicineService.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["storage", "medicines"] })
    },
  })
}
