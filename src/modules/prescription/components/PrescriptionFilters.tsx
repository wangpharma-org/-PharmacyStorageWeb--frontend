import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { SearchIcon, FilterIcon, XIcon } from "lucide-react"
import { PrescriptionStatus } from "../types/prescription.types"
import type { FindPrescriptionsParams } from "../types/prescription.types"

interface PrescriptionFiltersProps {
  filters: FindPrescriptionsParams
  onFiltersChange: (filters: FindPrescriptionsParams) => void
  onClearFilters: () => void
}

export function PrescriptionFilters({
  filters,
  onFiltersChange,
  onClearFilters
}: PrescriptionFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (key: keyof FindPrescriptionsParams, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
      page: 1 // Reset to first page when filters change
    })
  }

  const handleStatusToggle = (status: PrescriptionStatus) => {
    const currentStatuses = filters.status || []
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status]
    
    handleFilterChange('status', newStatuses.length > 0 ? newStatuses : undefined)
  }

  const activeFilterCount = [
    filters.patientName,
    filters.prescriptionNo,
    filters.startDate,
    filters.endDate,
    filters.status?.length,
    filters.isProblematic
  ].filter(Boolean).length

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Quick Search Row */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Field>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหาชื่อผู้ป่วย, หมายเลขใบยา..."
                    value={filters.patientName || filters.prescriptionNo || ""}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value) {
                        // Auto-detect if it's prescription number (starts with numbers/codes)
                        if (/^[A-Z0-9\-]+$/i.test(value)) {
                          handleFilterChange('prescriptionNo', value)
                          handleFilterChange('patientName', undefined)
                        } else {
                          handleFilterChange('patientName', value)
                          handleFilterChange('prescriptionNo', undefined)
                        }
                      } else {
                        handleFilterChange('patientName', undefined)
                        handleFilterChange('prescriptionNo', undefined)
                      }
                    }}
                    className="pl-10"
                  />
                </div>
              </Field>
            </div>

            <Button
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className="gap-2"
            >
              <FilterIcon className="size-4" />
              ตัวกรอง
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>

            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                onClick={onClearFilters}
                size="sm"
                className="gap-2"
              >
                <XIcon className="size-4" />
                ล้างทั้งหมด
              </Button>
            )}
          </div>

          {/* Expanded Filters */}
          {isExpanded && (
            <div className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Start Date */}
                <Field>
                  <FieldLabel>วันที่เริ่มต้น</FieldLabel>
                  <Input
                    type="date"
                    value={filters.startDate || ""}
                    onChange={(e) => handleFilterChange('startDate', e.target.value || undefined)}
                  />
                </Field>

                {/* End Date */}
                <Field>
                  <FieldLabel>วันที่สิ้นสุด</FieldLabel>
                  <Input
                    type="date"
                    value={filters.endDate || ""}
                    onChange={(e) => handleFilterChange('endDate', e.target.value || undefined)}
                  />
                </Field>

                {/* Problematic Filter */}
                <Field>
                  <FieldLabel>ประเภทใบยา</FieldLabel>
                  <Select
                    value={filters.isProblematic ? "problematic" : "all"}
                    onValueChange={(value) => 
                      handleFilterChange('isProblematic', value === "problematic" ? true : undefined)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทั้งหมด</SelectItem>
                      <SelectItem value="problematic">ใบยาที่มีปัญหา</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                {/* Items per page */}
                <Field>
                  <FieldLabel>แสดงต่อหน้า</FieldLabel>
                  <Select
                    value={(filters.limit || 20).toString()}
                    onValueChange={(value) => handleFilterChange('limit', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 รายการ</SelectItem>
                      <SelectItem value="20">20 รายการ</SelectItem>
                      <SelectItem value="50">50 รายการ</SelectItem>
                      <SelectItem value="100">100 รายการ</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              {/* Status Filters */}
              <div>
                <FieldLabel className="mb-3">สถานะใบยา</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {Object.values(PrescriptionStatus).map((status) => {
                    const isSelected = filters.status?.includes(status)
                    return (
                      <Button
                        key={status}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleStatusToggle(status)}
                        className="text-xs"
                      >
                        {status.toLowerCase().replace('_', ' ')}
                      </Button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Summary */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="text-muted-foreground">ตัวกรองที่เลือก:</span>
              
              {filters.patientName && (
                <Badge variant="outline">
                  ชื่อ: {filters.patientName}
                </Badge>
              )}
              
              {filters.prescriptionNo && (
                <Badge variant="outline">
                  หมายเลข: {filters.prescriptionNo}
                </Badge>
              )}
              
              {filters.startDate && (
                <Badge variant="outline">
                  จาก: {filters.startDate}
                </Badge>
              )}
              
              {filters.endDate && (
                <Badge variant="outline">
                  ถึง: {filters.endDate}
                </Badge>
              )}
              
              {filters.status && filters.status.length > 0 && (
                <Badge variant="outline">
                  สถานะ: {filters.status.length} รายการ
                </Badge>
              )}
              
              {filters.isProblematic && (
                <Badge variant="destructive">
                  ใบยาที่มีปัญหา
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}