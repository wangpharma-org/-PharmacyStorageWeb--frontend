import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { PrescriptionStatus, ItemReserveStatus } from "../types/prescription.types"

interface StatusBadgeProps {
  status: PrescriptionStatus | ItemReserveStatus
  className?: string
}

const prescriptionStatusConfig: Record<PrescriptionStatus, {
  variant: "default" | "secondary" | "destructive" | "outline"
  className: string
  label: string
}> = {
  [PrescriptionStatus.CREATED]: {
    variant: "outline",
    className: "border-blue-300 text-blue-700 bg-blue-50",
    label: "Created"
  },
  [PrescriptionStatus.STOCK_RESERVED]: {
    variant: "secondary", 
    className: "bg-green-100 text-green-800 border-green-300",
    label: "Stock Reserved"
  },
  [PrescriptionStatus.PARTIAL_RESERVED]: {
    variant: "outline",
    className: "border-orange-300 text-orange-700 bg-orange-50",
    label: "Partial Reserved"
  },
  [PrescriptionStatus.DISPENSED]: {
    variant: "secondary",
    className: "bg-purple-100 text-purple-800 border-purple-300", 
    label: "Dispensed"
  },
  [PrescriptionStatus.COMPLETED]: {
    variant: "secondary",
    className: "bg-emerald-100 text-emerald-800 border-emerald-300",
    label: "Completed"
  },
  [PrescriptionStatus.PROBLEM]: {
    variant: "destructive",
    className: "bg-red-100 text-red-800 border-red-300",
    label: "Problem"
  },
  [PrescriptionStatus.CANCELLED]: {
    variant: "outline",
    className: "border-gray-400 text-gray-600 bg-gray-50",
    label: "Cancelled"
  },
  [PrescriptionStatus.REJECTED]: {
    variant: "destructive",
    className: "bg-red-100 text-red-800 border-red-300", 
    label: "Rejected"
  },
  [PrescriptionStatus.TIMEOUT]: {
    variant: "outline",
    className: "border-yellow-400 text-yellow-700 bg-yellow-50",
    label: "Timeout"
  }
}

const itemStatusConfig: Record<ItemReserveStatus, {
  variant: "default" | "secondary" | "destructive" | "outline"
  className: string
  label: string
}> = {
  [ItemReserveStatus.PENDING]: {
    variant: "outline",
    className: "border-blue-300 text-blue-700 bg-blue-50",
    label: "Pending"
  },
  [ItemReserveStatus.RESERVED]: {
    variant: "secondary",
    className: "bg-green-100 text-green-800 border-green-300",
    label: "Reserved"
  },
  [ItemReserveStatus.PARTIAL]: {
    variant: "outline", 
    className: "border-orange-300 text-orange-700 bg-orange-50",
    label: "Partial"
  },
  [ItemReserveStatus.FAILED]: {
    variant: "destructive",
    className: "bg-red-100 text-red-800 border-red-300",
    label: "Failed"
  },
  [ItemReserveStatus.CANCELLED]: {
    variant: "outline",
    className: "border-gray-400 text-gray-600 bg-gray-50", 
    label: "Cancelled"
  }
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const isPrescriptionStatus = Object.values(PrescriptionStatus).includes(status as PrescriptionStatus)
  const config = isPrescriptionStatus 
    ? prescriptionStatusConfig[status as PrescriptionStatus]
    : itemStatusConfig[status as ItemReserveStatus]

  if (!config) {
    return (
      <Badge variant="outline" className={className}>
        {status}
      </Badge>
    )
  }

  return (
    <Badge 
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  )
}