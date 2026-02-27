import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { AlertCircleIcon, CheckCircleIcon, InfoIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PrescriptionItem } from "../types/prescription.types"
import { StatusBadge } from "./StatusBadge"

interface PrescriptionItemsTableProps {
  items: PrescriptionItem[]
  className?: string
  showActions?: boolean
  onItemAction?: (itemId: string, action: string) => void
}

export function PrescriptionItemsTable({ 
  items, 
  className,
  showActions = false,
  onItemAction 
}: PrescriptionItemsTableProps) {
  const getQuantityDisplay = (item: PrescriptionItem) => {
    if (item.reservedQuantity !== undefined && item.reservedQuantity !== item.quantity) {
      return (
        <div className="space-y-1">
          <div className="font-medium">
            {item.quantity} {item.unit}
          </div>
          <div className="text-xs text-muted-foreground">
            จองได้: {item.reservedQuantity} {item.unit}
          </div>
        </div>
      )
    }
    return `${item.quantity} ${item.unit}`
  }

  const getItemIcon = (item: PrescriptionItem) => {
    switch (item.status) {
      case "RESERVED":
        return <CheckCircleIcon className="size-4 text-green-600" />
      case "FAILED":
        return <AlertCircleIcon className="size-4 text-red-600" />  
      default:
        return null
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <InfoIcon className="size-8 text-muted-foreground/50" />
        <p className="text-sm font-medium text-foreground">ไม่มีรายการยา</p>
        <p className="text-sm text-muted-foreground">ยังไม่มีรายการยาในใบยานี้</p>
      </div>
    )
  }

  return (
    <div className={cn("rounded-md border", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>รายการยา</TableHead> 
            <TableHead className="text-right">จำนวน</TableHead>
            <TableHead className="w-32">สถานะการจอง</TableHead>
            <TableHead>หมายเหตุ</TableHead>
            {showActions && <TableHead className="w-20">การดำเนินการ</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell className="text-center text-sm text-muted-foreground">
                {index + 1}
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-2">
                  {getItemIcon(item)}
                  <div>
                    <div className="font-medium">{item.medicineName}</div>
                    <div className="text-xs text-muted-foreground font-mono">
                      {item.medicineCode}
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell className="text-right">
                {getQuantityDisplay(item)}
              </TableCell>

              <TableCell>
                <StatusBadge status={item.status} />
              </TableCell>

              <TableCell>
                <div className="space-y-1">
                  {item.instructions && (
                    <div className="text-sm">{item.instructions}</div>
                  )}
                  {item.failureReason && (
                    <div className="text-xs text-red-600 bg-red-50 p-1 rounded">
                      <AlertCircleIcon className="mr-1 inline size-3" />
                      {item.failureReason}
                    </div>
                  )}
                </div>
              </TableCell>

              {showActions && (
                <TableCell>
                  <div className="flex items-center gap-1">
                    {item.status === "FAILED" && onItemAction && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onItemAction(item.id, "retry")}
                        className="h-7 text-xs"
                      >
                        ลองใหม่
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Summary */}
      <div className="border-t bg-muted/30 px-4 py-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            รวม {items.length} รายการ
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircleIcon className="size-3" />
              จองแล้ว: {items.filter(i => i.status === "RESERVED").length}
            </span>
            <span className="flex items-center gap-1 text-red-600">
              <AlertCircleIcon className="size-3" />
              ไม่สำเร็จ: {items.filter(i => i.status === "FAILED").length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}