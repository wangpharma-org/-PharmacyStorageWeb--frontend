export interface Medicine {
  id: string
  medicineCode: string
  medicineName_en: string | null
  medicineName_th: string | null
  medicineMethod_en: string | null
  medicineMethod_th: string | null
  medicineCondition_th: string | null
  medicineCondition_en: string | null
  medicineNote: string | null
  roomId: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateMedicinePayload {
  medicineCode: string
  medicineName_en?: string
  medicineName_th?: string
  medicineMethod_en?: string
  medicineMethod_th?: string
  medicineCondition_th?: string
  medicineCondition_en?: string
  medicineNote?: string
  roomId?: string
}

export interface UpdateMedicinePayload {
  medicineCode?: string
  medicineName_en?: string
  medicineName_th?: string
  medicineMethod_en?: string
  medicineMethod_th?: string
  medicineCondition_th?: string
  medicineCondition_en?: string
  medicineNote?: string
  roomId?: string
}

export interface FindMedicinesParams {
  page?: number
  limit?: number
  medicineCode?: string
  medicineName?: string
}
