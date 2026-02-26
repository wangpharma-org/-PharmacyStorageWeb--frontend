import { Controller } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { UserIcon } from "lucide-react"
import type { Control, FieldErrors } from "react-hook-form"
import type { CreatePrescriptionPayload } from "../types/prescription.types"
import { useRooms } from "../../storage/hooks/useStock"

interface PatientInfoFormProps {
  control: Control<CreatePrescriptionPayload>
  errors: FieldErrors<CreatePrescriptionPayload>
}

export function PatientInfoForm({ control, errors }: PatientInfoFormProps) {
  const { data: roomsResponse, isLoading: isLoadingRooms, isError: isErrorRooms } = useRooms()
  const rooms = roomsResponse?.data || []

  const renderRoomSelect = (field: any) => {
    if (isLoadingRooms) {
      return <Skeleton className="h-10 w-full" />
    }
    
    if (isErrorRooms) {
      return (
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger>
            <SelectValue placeholder="ไม่สามารถโหลดข้อมูลห้องได้" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fallback">ห้องอื่น ๆ</SelectItem>
          </SelectContent>
        </Select>
      )
    }

    return (
      <Select value={field.value} onValueChange={field.onChange}>
        <SelectTrigger>
          <SelectValue placeholder="เลือกห้องที่จัดยา" />
        </SelectTrigger>
        <SelectContent>
          {rooms.map((room) => (
            <SelectItem key={room.id} value={room.id}>
              {room.name}
            </SelectItem>
          ))}
          {rooms.length === 0 && (
            <SelectItem value="no_rooms" disabled>
              ไม่มีข้อมูลห้อง
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    )
  }

  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="size-4" />
          ข้อมูลผู้ป่วย
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Patient Name */}
          <Field data-invalid={!!errors.patientName}>
            <FieldLabel>ชื่อผู้ป่วย *</FieldLabel>
            <Controller
              name="patientName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="กรอกชื่อผู้ป่วย"
                  aria-invalid={!!errors.patientName}
                />
              )}
            />
            <FieldError>{errors.patientName?.message}</FieldError>
          </Field>

          {/* Patient ID */}
          <Field data-invalid={!!errors.patientCode}>
            <FieldLabel>รหัสผู้ป่วย</FieldLabel>
            <Controller
              name="patientCode"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="รหัสผู้ป่วย (ถ้ามี)"
                />
              )}
            />
            <FieldError>{errors.patientCode?.message}</FieldError>
          </Field>

          {/* Age */}
          <Field data-invalid={!!errors.age}>
            <FieldLabel>อายุ</FieldLabel>
            <Controller
              name="age"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <Input
                  {...field}
                  type="number"
                  placeholder="อายุ (ปี)"
                  value={value || ""}
                  onChange={(e) => {
                    const num = e.target.value ? parseInt(e.target.value) : undefined
                    onChange(num)
                  }}
                />
              )}
            />
            <FieldError>{errors.age?.message}</FieldError>
          </Field>

          {/* Gender */}
          <Field data-invalid={!!errors.gender}>
            <FieldLabel>เพศ</FieldLabel>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกเพศ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">ชาย</SelectItem>
                    <SelectItem value="F">หญิง</SelectItem>
                    <SelectItem value="OTHER">อื่นๆ</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError>{errors.gender?.message}</FieldError>
          </Field>

          {/* HN */}
          <Field data-invalid={!!errors.hn}>
            <FieldLabel>HN (Hospital Number)</FieldLabel>
            <Controller
              name="hn"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="หมายเลขผู้ป่วยในโรงพยาบาล"
                />
              )}
            />
            <FieldError>{errors.hn?.message}</FieldError>
          </Field>

          {/* VN */}
          <Field data-invalid={!!errors.vn}>
            <FieldLabel>VN (Visit Number)</FieldLabel>
            <Controller
              name="vn"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="หมายเลขการมาพบแพทย์"
                />
              )}
            />
            <FieldError>{errors.vn?.message}</FieldError>
          </Field>
        </div>

        {/* Phone */}
        <Field data-invalid={!!errors.phoneNumber}>
          <FieldLabel>เบอร์โทรศัพท์</FieldLabel>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="เบอร์โทรศัพท์ติดต่อ"
               type="tel"
              />
            )}
          />
          <FieldError>{errors.phoneNumber?.message}</FieldError>
        </Field>

        {/* Address */}
        <Field data-invalid={!!errors.address}>
          <FieldLabel>ที่อยู่</FieldLabel>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="ที่อยู่ผู้ป่วย"
                rows={3}
              />
            )}
          />
          <FieldError>{errors.address?.message}</FieldError>
        </Field>

        {/* Room */}
        <Field data-invalid={!!errors.roomId}>
          <FieldLabel>ห้องที่จัดยา</FieldLabel>
          <Controller
            name="roomId"
            control={control}
            render={({ field }) => renderRoomSelect(field)}
          />
          <FieldError>{errors.roomId?.message}</FieldError>
        </Field>
      </CardContent>
    </Card>
  )
}