import { useParams, useNavigate } from "react-router"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  ArrowLeftIcon, 
  RefreshCwIcon, 
  XIcon, 
  CheckIcon, 
  TruckIcon,
  AlertCircleIcon,
  FileTextIcon,
  EditIcon
} from "lucide-react"
import { 
  usePrescriptionById, 
  useRetryReserve, 
  useCancelPrescription,
  useMarkDispensed,
  useCompletePrescription
} from "../hooks/usePrescriptions"
import { PatientInfoCard } from "../components/PatientInfoCard"
import { StatusTimeline } from "../components/StatusTimeline"
import { PrescriptionItemsTable } from "../components/PrescriptionItemsTable"
import { StatusBadge } from "../components/StatusBadge"
import { PrescriptionStatus } from "../types/prescription.types"

export function PrescriptionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: prescription, isLoading, error, refetch } = usePrescriptionById(id!)
  const retryMutation = useRetryReserve()
  const cancelMutation = useCancelPrescription()
  const dispenseMutation = useMarkDispensed()
  const completeMutation = useCompletePrescription()

  const handleGoBack = () => {
    navigate("/app/prescriptions")
  }

  const handleRetryReserve = async () => {
    if (!prescription) return
    
    try {
      await retryMutation.mutateAsync({ id: prescription.id })
      toast.success("ลองจองสต็อกใหม่แล้ว", {
        description: "กำลังตรวจสอบการจองสต็อก"
      })
    } catch (error) {
      console.error("Failed to retry reserve:", error)
      toast.error("เกิดข้อผิดพลาดในการลองใหม่")
    }
  }

  const handleCancel = async () => {
    if (!prescription) return
    
    const reason = prompt("เหตุผลในการยกเลิกใบยา:")
    if (!reason) return

    try {
      await cancelMutation.mutateAsync({ id: prescription.id, reason })
      toast.success("ยกเลิกใบยาแล้ว")
    } catch (error) {
      console.error("Failed to cancel prescription:", error)
      toast.error("เกิดข้อผิดพลาดในการยกเลิกใบยา")
    }
  }

  const handleMarkDispensed = async () => {
    if (!prescription) return
    
    try {
      await dispenseMutation.mutateAsync({ id: prescription.id })
      toast.success("อัปเดตสถานะเป็น 'จ่ายยาแล้ว'")
    } catch (error) {
      console.error("Failed to mark as dispensed:", error)
      toast.error("เกิดข้อผิดพลาดในการอัปเดตสถานะ")
    }
  }

  const handleComplete = async () => {
    if (!prescription) return
    
    try {
      await completeMutation.mutateAsync({ id: prescription.id })
      toast.success("ใบยาเสร็จสมบูรณ์แล้ว")
    } catch (error) {
      console.error("Failed to complete prescription:", error)
      toast.error("เกิดข้อผิดพลาดในการอัปเดตสถานะ")
    }
  }

  const handleItemAction = (itemId: string, action: string) => {
    if (action === "retry" && prescription) {
      retryMutation.mutate({ 
        id: prescription.id,
        payload: { itemIds: [itemId] }
      })
    }
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-64" />
          </div>
          
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-40" />
              <Skeleton className="h-60" />
            </div>
            <div>
              <Skeleton className="h-80" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error State
  if (error || !prescription) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <AlertCircleIcon className="size-12 text-destructive" />
              <div>
                <h3 className="text-lg font-semibold">ไม่พบข้อมูลใบยา</h3>
                <p className="text-muted-foreground">
                  {error ? "เกิดข้อผิดพลาดในการโหลดข้อมูล" : "ไม่พบใบยาที่คุณต้องการ"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handleGoBack}>
                  <ArrowLeftIcon className="size-4 mr-2" />
                  กลับไปรายการใบยา
                </Button>
                <Button onClick={() => refetch()}>
                  <RefreshCwIcon className="size-4 mr-2" />
                  ลองใหม่
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const canRetry = prescription.canRetry && prescription.isProblematic
  const canCancel = (
    prescription.status === PrescriptionStatus.CREATED ||
    prescription.status === PrescriptionStatus.STOCK_RESERVED ||
    prescription.status === PrescriptionStatus.PARTIAL_RESERVED
  )
  const canDispense = prescription.status === PrescriptionStatus.STOCK_RESERVED
  const canComplete = prescription.status === PrescriptionStatus.DISPENSED
  const isCompleted = prescription.status === PrescriptionStatus.COMPLETED

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={handleGoBack}
            variant="ghost"
            size="sm"
          >
            <ArrowLeftIcon className="size-4" />
            กลับ
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                ใบยา {prescription.vn}
              </h1>
              <StatusBadge status={prescription.status} />
              {prescription.isProblematic && (
                <Badge variant="destructive" className="gap-1">
                  <AlertCircleIcon className="size-3" />
                  มีปัญหา
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              สร้างเมื่อ {new Date(prescription.createdAt).toLocaleString('th-TH')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
          >
            <RefreshCwIcon className="size-4" />
          </Button>
          
          {/* Action Buttons */}
          {canRetry && (
            <Button
              onClick={handleRetryReserve}
              disabled={retryMutation.isPending}
              size="sm"
            >
              <RefreshCwIcon className="size-4 mr-2" />
              ลองจองใหม่
            </Button>
          )}

          {canDispense && (
            <Button
              onClick={handleMarkDispensed}
              disabled={dispenseMutation.isPending}
              size="sm"
            >
              <TruckIcon className="size-4 mr-2" />
              จ่ายยาแล้ว
            </Button>
          )}

          {canComplete && (
            <Button
              onClick={handleComplete}
              disabled={completeMutation.isPending}
              size="sm"
            >
              <CheckIcon className="size-4 mr-2" />
              เสร็จสมบูรณ์
            </Button>
          )}

          {canCancel && (
            <Button
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
              variant="destructive"
              size="sm"
            >
              <XIcon className="size-4 mr-2" />
              ยกเลิก
            </Button>
          )}
        </div>
      </div>

      <Separator className="mb-6" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Information */}
          {/* <PatientInfoCard 
            patient={prescription}
            showFullDetails={true}
          /> */}

          {/* Prescription Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileTextIcon className="size-4" />
                รายการยา ({prescription.items.length} รายการ)
              </CardTitle>
              {prescription.isProblematic && (
                <div className="text-sm text-muted-foreground">
                  มีรายการยาที่ไม่สามารถจองได้ กรุณาตรวจสอบและดำเนินการ
                </div>
              )}
            </CardHeader>
            <CardContent>
              <PrescriptionItemsTable
                items={prescription.items}
                showActions={canRetry}
                onItemAction={handleItemAction}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Timeline */}
          {/* <StatusTimeline
            timeline={prescription.currentTimeline}
            currentStatus={prescription.status}
          /> */}

          {/* Summary Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">สรุปข้อมูล</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">รายการทั้งหมด:</span>
                  <span className="font-medium">{prescription.items.length} รายการ</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">จองสำเร็จ:</span>
                  <span className="font-medium text-green-600">
                    {prescription.reservedItems ?? 0} รายการ
                  </span>
                </div>
                
                {prescription.failedItems > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">จองไม่สำเร็จ:</span>
                    <span className="font-medium text-red-600">
                      {prescription.failedItems} รายการ
                    </span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">สถานะปัจจุบัน:</span>
                  <StatusBadge status={prescription.status} />
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">อัปเดตล่าสุด:</span>
                  <span className="font-medium">
                    {new Date(prescription.updatedAt).toLocaleString('th-TH')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}