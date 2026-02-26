import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { EyeIcon, AlertCircleIcon, CheckCircleIcon, ClockIcon } from "lucide-react"
import { StatusBadge } from "./StatusBadge"
import type { Prescription } from "../types/prescription.types"

interface PrescriptionTableProps {
  prescriptions: Prescription[]
  isLoading?: boolean
  onViewDetails: (prescriptionId: string) => void
}

export function PrescriptionTable({ 
  prescriptions, 
  isLoading = false,
  onViewDetails 
}: PrescriptionTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>หมายเลขใบยา</TableHead>
              <TableHead>ผู้ป่วย</TableHead>
              <TableHead>รายการยา</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead>วันที่สร้าง</TableHead>
              <TableHead className="w-20">การดำเนินการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5).fill(0).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell><Skeleton className="h-8 w-8" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (prescriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center border-2 border-dashed border-muted rounded-lg">
        <ClockIcon className="size-8 text-muted-foreground/50" />
        <p className="text-sm font-medium text-foreground">ไม่พบข้อมูลใบยา</p>
        <p className="text-sm text-muted-foreground">
          ไม่มีใบยาที่ตรงกับเงื่อนไขที่เลือก
        </p>
      </div>
    )
  }

  const getItemsSummaryIcon = (prescription: Prescription) => {
    const { reservedItems, failedItems, totalItems } = prescription
    
    if (failedItems > 0) {
      return <AlertCircleIcon className="size-4 text-red-600" />
    } else if (reservedItems === totalItems) {
      return <CheckCircleIcon className="size-4 text-green-600" />
    } else {
      return <ClockIcon className="size-4 text-orange-600" />
    }
  }

  const getItemsSummaryText = (prescription: Prescription) => {
    const { reservedItems, failedItems, items } = prescription
    
    if (failedItems > 0) {
      return `${reservedItems ?? 0}/${items.length} (${failedItems} ล้มเหลว)`
    }
    return `${reservedItems ?? 0}/${items.length}`
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>หมายเลขใบยา</TableHead>
            <TableHead>ผู้ป่วย</TableHead>
            <TableHead>รายการยา</TableHead>
            <TableHead>สถานะ</TableHead>
            <TableHead>วันที่สร้าง</TableHead>
            <TableHead className="w-20">การดำเนินการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prescriptions.map((prescription) => (
            <TableRow 
              key={prescription.vn}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onViewDetails(prescription.id)}
            >
              <TableCell>
                <div className="space-y-1">
                  <div className="font-mono font-medium">
                    {prescription.vn}
                  </div>
                  {prescription.isProblematic && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertCircleIcon className="mr-1 size-3" />
                      มีปัญหา
                    </Badge>
                  )}
                </div>
              </TableCell>

              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">
                    {prescription.patientName}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {prescription.age && (
                      <span>{prescription.age} ปี</span>
                    )}
                    {prescription.hn && (
                      <span className="font-mono">HN: {prescription.hn}</span>
                    )}
                    {prescription.vn && (
                      <span className="font-mono">VN: {prescription.vn}</span>
                    )}
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  {getItemsSummaryIcon(prescription)}
                  <div className="space-y-1">
                    <div className="text-sm font-medium">
                      {getItemsSummaryText(prescription)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {prescription.items.length} รายการ
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <StatusBadge status={prescription.status} />
              </TableCell>

              <TableCell>
                <div className="space-y-1">
                  <div className="text-sm">
                    {new Date(prescription.createdAt).toLocaleDateString('th-TH')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(prescription.createdAt).toLocaleTimeString('th-TH', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    onViewDetails(prescription.id)
                  }}
                >
                  <EyeIcon className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}