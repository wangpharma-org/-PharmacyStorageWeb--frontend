import { useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeftIcon, 
  AlertCircleIcon, 
  RefreshCwIcon,
  FileTextIcon,
  CheckCircleIcon,
  XCircleIcon
} from "lucide-react"
import { useDebounce } from "@/hooks/useDebounce"
import { useProblematicPrescriptions, useRetryReserve } from "../hooks/usePrescriptions"
import { PrescriptionFilters } from "../components/PrescriptionFilters"
import { PrescriptionTable } from "../components/PrescriptionTable"
import { Pagination } from "../components/Pagination"
import type { FindPrescriptionsParams } from "../types/prescription.types"

export function ProblematicPrescriptionsPage() {
  const navigate = useNavigate()
  
  const [filters, setFilters] = useState<FindPrescriptionsParams>({
    page: 1,
    limit: 20
  })

  // Remove status filter for problematic prescriptions (it's handled by the API)
  const problematicFilters = {
    ...filters,
    status: undefined,
    isProblematic: undefined // This is handled by the endpoint
  }

  // Debounce filters to avoid too many API calls
  const debouncedFilters = useDebounce(problematicFilters, 300)

  const { 
    data: prescriptionData, 
    isLoading, 
    error,
    refetch
  } = useProblematicPrescriptions(debouncedFilters)

  const retryMutation = useRetryReserve()

  const prescriptions = prescriptionData?.data || []
  const pagination = prescriptionData?.meta ? {
    total: prescriptionData.meta.total,
    page: prescriptionData.meta.page,
    limit: prescriptionData.meta.limit,
    totalPages: prescriptionData.meta.totalPages
  } : null

  const handleFiltersChange = (newFilters: FindPrescriptionsParams) => {
    // Remove problematic-specific filters that don't apply here
    const { status, isProblematic, ...safeFilters } = newFilters
    setFilters(safeFilters)
  }

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: filters.limit || 20
    })
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const handleItemsPerPageChange = (limit: number) => {
    setFilters(prev => ({ ...prev, limit, page: 1 }))
  }

  const handleViewDetails = (prescriptionId: string) => {
    navigate(`/app/prescriptions/${prescriptionId}`)
  }

  const handleGoBack = () => {
    navigate("/app/prescriptions")
  }

  const handleRetryAll = async () => {
    const retryableIds = prescriptions
      .filter(p => p.canRetry)
      .map(p => p.id)

    if (retryableIds.length === 0) {
      toast.info("ไม่มีใบยาที่สามารถลองใหม่ได้")
      return
    }

    const confirmed = confirm(`คุณต้องการลองจองสต็อกใหม่สำหรับใบยา ${retryableIds.length} ใบหรือไม่?`)
    if (!confirmed) return

    try {
      // Retry all prescriptions in parallel
      await Promise.all(
        retryableIds.map(id => retryMutation.mutateAsync({ id }))
      )
      
      toast.success(`ลองจองสต็อกใหม่แล้ว ${retryableIds.length} ใบยา`, {
        description: "กำลังตรวจสอบการจองสต็อก"
      })
      
      // Refresh the list
      refetch()
    } catch (error) {
      console.error("Failed to retry multiple prescriptions:", error)
      toast.error("เกิดข้อผิดพลาดในการลองใหม่บางใบยา")
    }
  }

  const handleRetryOne = async (prescriptionId: string) => {
    try {
      await retryMutation.mutateAsync({ id: prescriptionId })
      toast.success("ลองจองสต็อกใหม่แล้ว")
      refetch()
    } catch (error) {
      console.error("Failed to retry prescription:", error)
      toast.error("เกิดข้อผิดพลาดในการลองใหม่")
    }
  }

  const retryableCount = prescriptions.filter(p => p.canRetry).length
  const failedCount = prescriptions.filter(p => p.failedItems > 0).length
  const partialCount = prescriptions.filter(p => p.status === 'PARTIAL_RESERVED').length

  return (
    <div className="container mx-auto px-4 py-6">
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
            <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
              <AlertCircleIcon className="size-6 text-red-600" />
              ใบยาที่มีปัญหา
            </h1>
            <p className="text-sm text-muted-foreground">
              รายการใบยาที่ไม่สามารถจองสต็อกได้หรือมีปัญหาอื่นๆ
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Retry All */}
          {retryableCount > 0 && (
            <Button
              onClick={handleRetryAll}
              disabled={retryMutation.isPending}
              className="gap-2"
            >
              <RefreshCwIcon className="size-4" />
              ลองใหม่ทั้งหมด ({retryableCount})
            </Button>
          )}

          {/* Refresh */}
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
            size="sm"
          >
            <RefreshCwIcon className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-red-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-red-600">
                <AlertCircleIcon className="size-4" />
                ใบยามีปัญหา
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {pagination?.total.toLocaleString() || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-orange-600">
                <RefreshCwIcon className="size-4" />
                ลองใหม่ได้
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {retryableCount.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-yellow-600">
                <FileTextIcon className="size-4" />
                จองได้บางส่วน
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {partialCount.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <XCircleIcon className="size-4" />
                จองไม่สำเร็จ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {failedCount.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Alert */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircleIcon className="size-5 text-blue-600 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-blue-800">
                  เกี่ยวกับใบยาที่มีปัญหา
                </h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• <strong>จองได้บางส่วน:</strong> สามารถจองสต็อกได้บางรายการ รายการที่เหลือยังคงรอการจอง</p>
                  <p>• <strong>จองไม่สำเร็จ:</strong> ไม่สามารถจองสต็อกได้เลย อาจเนื่องจากสต็อกหมดหรือสินค้าไม่มีอยู่</p>
                  <p>• <strong>หมดเวลา:</strong> การจองสต็อกใช้เวลานานเกินไป ระบบได้ยกเลิกการจองอัตโนมัติ</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters - Simplified for problematic prescriptions */}
        <PrescriptionFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />

        {/* Error State */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-destructive">
                <AlertCircleIcon className="size-5" />
                <div>
                  <p className="font-medium">เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
                  <p className="text-sm text-muted-foreground">
                    กรุณาลองใหม่อีกครั้ง หรือติดต่อผู้ดูแลระบบ
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="ml-auto"
                >
                  ลองใหม่
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Prescription Table */}
        <Card>
          <CardContent className="p-0">
            <PrescriptionTable
              prescriptions={prescriptions}
              isLoading={isLoading}
              onViewDetails={handleViewDetails}
            />
          </CardContent>
        </Card>

        {/* Empty State */}
        {!isLoading && prescriptions.length === 0 && !error && (
          <Card className="border-green-200 bg-green-50/50">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <CheckCircleIcon className="size-12 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800">
                    ยินดีด้วย! ไม่มีใบยาที่มีปัญหา
                  </h3>
                  <p className="text-sm text-green-700">
                    ใบยาทั้งหมดสามารถดำเนินการได้ปกติ
                  </p>
                </div>
                <Button
                  onClick={handleGoBack}
                  variant="outline"
                  className="gap-2"
                >
                  <ArrowLeftIcon className="size-4" />
                  กลับไปรายการใบยา
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {pagination && !isLoading && prescriptions.length > 0 && (
          <div className="flex justify-center">
            <Card className="w-full">
              <CardContent className="pt-6">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.total}
                  itemsPerPage={pagination.limit}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}