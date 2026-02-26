import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserIcon, PhoneIcon, MapPinIcon, CalendarIcon } from "lucide-react"
import type { PatientInfo } from "../types/prescription.types"

interface PatientInfoCardProps {
  patient: PatientInfo
  className?: string
  showFullDetails?: boolean
}

export function PatientInfoCard({ 
  patient, 
  className, 
  showFullDetails = true 
}: PatientInfoCardProps) {
  const getGenderLabel = (gender?: string) => {
    switch (gender) {
      case "M": return "ชาย"
      case "F": return "หญิง"
      case "OTHER": return "อื่นๆ"
      default: return "-"
    }
  }

  const getGenderVariant = (gender?: string) => {
    switch (gender) {
      case "M": return "outline" as const
      case "F": return "secondary" as const
      default: return "outline" as const
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <UserIcon className="size-4" />
          ข้อมูลผู้ป่วย
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Patient Name and Basic Info */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">
              {patient.patientName}
            </h3>
            <div className="flex items-center gap-2">
              {patient.patientId && (
                <span className="font-mono text-xs text-muted-foreground">
                  ID: {patient.patientId}
                </span>
              )}
              {patient.hn && (
                <span className="font-mono text-xs text-muted-foreground">
                  HN: {patient.hn}
                </span>
              )}
              {patient.vn && (
                <span className="font-mono text-xs text-muted-foreground">
                  VN: {patient.vn}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {patient.patientAge && (
              <Badge variant="outline" className="text-xs">
                <CalendarIcon className="mr-1 size-3" />
                {patient.patientAge} ปี
              </Badge>
            )}
            {patient.patientGender && (
              <Badge variant={getGenderVariant(patient.patientGender)} className="text-xs">
                {getGenderLabel(patient.patientGender)}
              </Badge>
            )}
          </div>
        </div>

        {showFullDetails && (
          <>
            {/* Contact Information */}
            {patient.patientPhone && (
              <div className="flex items-center gap-2 text-sm">
                <PhoneIcon className="size-4 text-muted-foreground" />
                <span>{patient.patientPhone}</span>
              </div>
            )}

            {/* Address */}
            {patient.patientAddress && (
              <div className="flex items-start gap-2 text-sm">
                <MapPinIcon className="mt-0.5 size-4 text-muted-foreground" />
                <span className="flex-1">{patient.patientAddress}</span>
              </div>
            )}
          </>
        )}

        {/* Compact view for lists */}
        {!showFullDetails && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {patient.patientPhone && (
              <span className="flex items-center gap-1">
                <PhoneIcon className="size-3" />
                {patient.patientPhone}
              </span>
            )}
            {patient.patientAge && (
              <span>{patient.patientAge} ปี</span>
            )}
           {patient.patientGender && (
              <span>{getGenderLabel(patient.patientGender)}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}