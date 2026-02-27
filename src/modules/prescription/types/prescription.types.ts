// Prescription Status Enum
export const PrescriptionStatus = {
  CREATED: "CREATED",
  STOCK_RESERVED: "STOCK_RESERVED", 
  PARTIAL_RESERVED: "PARTIAL_RESERVED",
  DISPENSED: "DISPENSED",
  COMPLETED: "COMPLETED",
  PROBLEM: "PROBLEM",
  CANCELLED: "CANCELLED",
  REJECTED: "REJECTED",
  TIMEOUT: "TIMEOUT"
} as const

export type PrescriptionStatus = typeof PrescriptionStatus[keyof typeof PrescriptionStatus]

// Status for individual prescription items
export const ItemReserveStatus = {
  PENDING: "PENDING",
  RESERVED: "RESERVED", 
  FAILED: "FAILED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
} as const

export type ItemReserveStatus = typeof ItemReserveStatus[keyof typeof ItemReserveStatus]

// Patient Information
export interface PatientInfo {
  patientId: string
  patientName: string
  patientAge?: number
  patientGender?: "M" | "F" | "OTHER"
  patientPhone?: string
  patientAddress?: string
  hn?: string // Hospital Number
  vn?: string // Visit Number
}

// Individual Medicine Item in Prescription
export interface PrescriptionItem {
  id: string
  medicineCode: string
  medicineName: string
  quantity: number
  unit: string
  status: ItemReserveStatus
  reservedQuantity?: number
  failureReason?: string
  instructions?: string
}

// Status Timeline Entry
export interface StatusTimeline {
  status: PrescriptionStatus
  timestamp: string
  updatedBy?: string
  notes?: string
}

// Main Prescription Entity
export interface Prescription {
  id: string
  vn: string,
  hn: string,
  patientName: string,
  patientCode: string,
  age: number,
  gender: string,
  phoneNumber: string,
  address: string,
  items: PrescriptionItem[]
  status: PrescriptionStatus
  currentTimeline: StatusTimeline[]
  createdAt: string
  updatedAt: string
  createdBy?: string
  totalItems: number
  reservedItems: number
  failedItems: number
  // Calculated fields
  isProblematic: boolean
  canRetry: boolean
}

// Create Prescription payload
export interface CreatePrescriptionPayload {
  vn: string,
  hn: string,
  patientName: string,
  patientCode: string,
  age: number,
  gender: string,
  phoneNumber: string,
  address: string,
  roomId?: string,
  items: Array<{
    medicineId: string
    medicineName_en?: string
    quantity: number
    unit: string
    instructions?: string
  }>
}

// Update Prescription payload
export interface UpdatePrescriptionPayload {
  patientInfo?: Partial<PatientInfo>
  items?: Array<{
    id?: string
    medicineId: string
    quantity: number
    unit: string
    instructions?: string
  }>
  status?: PrescriptionStatus
  notes?: string
}

// Filter/Query parameters
export interface FindPrescriptionsParams {
  page?: number
  limit?: number
  status?: PrescriptionStatus[]
  patientName?: string
  prescriptionNo?: string
  startDate?: string
  endDate?: string
  isProblematic?: boolean
}

// Retry Reserve payload
export interface RetryReservePayload {
  itemIds?: string[] // If not provided, retry all failed items
  force?: boolean
}

// API Response types
export interface PrescriptionListResponse {
  data: Prescription[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ProductInfo {
  id: string
  name: string
  unit: string
  stockQuantity: number
  isAvailable: boolean
}

// For product search/lookup
export interface FindProductsParams {
  search?: string
  limit?: number
}

// Statistics for dashboard
export interface PrescriptionStats {
  total: number
  byStatus: Record<PrescriptionStatus, number>
  todayCreated: number
  problematicCount: number
  averageProcessingTime?: number
}