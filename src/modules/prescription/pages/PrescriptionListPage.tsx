import { useState } from "react"
import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusIcon, FileTextIcon, AlertCircleIcon, RefreshCwIcon } from "lucide-react"
import { useDebounce } from "@/hooks/useDebounce"
import { usePrescriptions } from "../hooks/usePrescriptions"
import { PrescriptionFilters } from "../components/PrescriptionFilters"
import { PrescriptionTable } from "../components/PrescriptionTable"
import { Pagination } from "../components/Pagination"
import type { FindPrescriptionsParams } from "../types/prescription.types"

export function PrescriptionListPage() {
  const navigate = useNavigate()
  
  const [filters, setFilters] = useState<FindPrescriptionsParams>({
    page: 1,
    limit: 20
  })

  // Debounce filters to avoid too many API calls
  const debouncedFilters = useDebounce(filters, 300)

  const { 
    data: prescriptionData, 
    isLoading, 
    error,
    refetch
  } = usePrescriptions(debouncedFilters)

  const prescriptions = prescriptionData?.data || []
  const pagination = prescriptionData?.meta ? {
    total: prescriptionData.meta.total,
    page: prescriptionData.meta.page,
    limit: prescriptionData.meta.limit,
    totalPages: prescriptionData.meta.totalPages
  } : null

  console.log("prescriptionData Info:", prescriptionData)

  const handleFiltersChange = (newFilters: FindPrescriptionsParams) => {
    setFilters(newFilters)
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

  const handleCreateNew = () => {
    navigate("/app/prescriptions/create")
  }

  const handleViewProblematic = () => {
    navigate("/app/prescriptions/problematic")
  }

  const problematicCount = prescriptions.filter(p => p.isProblematic).length

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 pb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">รายการใบยา</h1>
          <p className="text-sm text-muted-foreground">
            จัดการและติดตามสถานะใบยาทั้งหมด
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Problematic Prescriptions */}
          {problematicCount > 0 && (
            <Button
              variant="outline"
              onClick={handleViewProblematic}
              className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <AlertCircleIcon className="size-4" />
              ใบยาที่มีปัญหา
              <Badge variant="destructive" className="text-xs">
                {problematicCount}
              </Badge>
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

          {/* Create New */}
          <Button onClick={handleCreateNew} className="gap-2">
            <PlusIcon className="size-4" />
            สร้างใบยาใหม่
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Filters */}
        <PrescriptionFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />

        {/* Stats Cards */}
        {pagination && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <FileTextIcon className="size-4" />
                  ใบยาทั้งหมด
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pagination.total.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <AlertCircleIcon className="size-4" />
                  ใบยาที่มีปัญหา
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {problematicCount.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  หน้าปัจจุบัน
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {pagination.page} / {pagination.totalPages}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  แสดงต่อหน้า
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pagination.limit} รายการ</div>
              </CardContent>
            </Card>
          </div>
        )}

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