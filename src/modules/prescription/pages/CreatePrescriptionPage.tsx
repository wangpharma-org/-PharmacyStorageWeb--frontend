import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeftIcon, SendIcon } from "lucide-react"
import { PatientInfoForm } from "../components/PatientInfoForm"
import { PrescriptionItemsForm } from "../components/PrescriptionItemsForm"
import { useCreatePrescription } from "../hooks/usePrescriptions"
import type { CreatePrescriptionPayload } from "../types/prescription.types"

// Validation Schema
const createPrescriptionSchema = z.object({
  vn: z.string().optional(),
  hn: z.string().optional(),
  patientName: z.string().min(1, "กรุณากรอกชื่อผู้ป่วย"),
  patientCode: z.string().optional(),
  age: z.number().min(0).max(200).optional(),
  gender: z.enum(["M", "F", "OTHER"]).optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  roomId: z.string().optional(),
  items: z.array(z.object({
    medicineId: z.string().min(1, "กรุณาเลือกรายการยา"),
    medicineName_en: z.string().optional(),
    quantity: z.number().min(1, "จำนวนต้องมากกว่า 0"),
    unit: z.string().min(1, "กรุณากรอกหน่วย"),
    instructions: z.string().optional()
  })).min(1, "กรุณาเพิ่มรายการยาอย่างน้อย 1 รายการ")
})

type CreatePrescriptionForm = z.infer<typeof createPrescriptionSchema>

export function CreatePrescriptionPage() {
  const navigate = useNavigate()
  
  const form = useForm<CreatePrescriptionForm>({
    resolver: zodResolver(createPrescriptionSchema),
    defaultValues: {
      vn: "",
      hn: "",
      patientName: "",
      patientCode: "",
      age: undefined,
      gender: undefined,
      phoneNumber: "",
      address: "",
      roomId: "",
      items: []
    }
  })

  const createMutation = useCreatePrescription()

  const handleSubmit = async (data: CreatePrescriptionForm) => {
    try {
      const payload: CreatePrescriptionPayload = {
        vn: data.vn || "",
        hn: data.hn || "",
        patientName: data.patientName,
        patientCode: data.patientCode || "",
        age: data.age || 0,
        gender: data.gender || "OTHER",
        phoneNumber: data.phoneNumber || "",
        address: data.address || "",
        roomId: data.roomId || "",
        items: data.items.map(item => ({
          medicineId: item.medicineId,
          medicineName_en: item.medicineName_en,
          quantity: item.quantity,
          unit: item.unit,
          instructions: item.instructions
        }))
      }
      
      const result = await createMutation.mutateAsync(payload)
      
      toast.success("สร้างใบยาสำเร็จ", {
        description: `หมายเลขใบยา: ${result.vn}`
      })
      
      // Navigate to the created prescription
      navigate(`/app/prescriptions/${result.id}`)
      
    } catch (error) {
      console.error("Failed to create prescription:", error)
      toast.error("เกิดข้อผิดพลาดในการสร้างใบยา", {
        description: "กรุณาลองใหม่อีกครั้ง"
      })
    }
  }

  const handleGoBack = () => {
    navigate("/app/prescriptions")
  }

  const isSubmitting = createMutation.isPending

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
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
            <h1 className="text-2xl font-semibold tracking-tight">สร้างใบยาใหม่</h1>
            <p className="text-sm text-muted-foreground">
              กรอกข้อมูลผู้ป่วยและรายการยาที่ต้องการ
            </p>
          </div>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Form */}
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Patient Information */}
        <PatientInfoForm 
          control={form.control} 
          errors={form.formState.errors} 
        />

        {/* Prescription Items */}
        <PrescriptionItemsForm 
          control={form.control} 
          errors={form.formState.errors} 
        />

        {/* Submit Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                ตรวจสอบข้อมูลให้ถูกต้องก่อนบันทึก
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoBack}
                  disabled={isSubmitting}
                >
                  ยกเลิก
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      กำลังสร้าง...
                    </>
                  ) : (
                    <>
                      <SendIcon className="size-4" />
                      สร้างใบยา
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Debug Info (Development only)
      {process.env.NODE_ENV === "development" && (
        <Card className="mt-6 border-dashed">
          <CardContent className="pt-6">
            <details>
              <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
                Debug: Form State
              </summary>
              <pre className="mt-2 text-xs text-muted-foreground overflow-auto">
                {JSON.stringify(form.formState.errors, null, 2)}
              </pre>
            </details>
          </CardContent>
        </Card>
      )} */}
    </div>
  )
}