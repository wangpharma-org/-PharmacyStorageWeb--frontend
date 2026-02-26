import { Controller, useFieldArray } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { PlusIcon, TrashIcon, PillIcon, AlertCircleIcon } from "lucide-react"
import { MedicineSearchCombobox } from "./MedicineSearchCombobox"
import type { Control, FieldErrors } from "react-hook-form"
import type { CreatePrescriptionPayload } from "../types/prescription.types"

interface PrescriptionItemsFormProps {
  control: Control<CreatePrescriptionPayload>
  errors: FieldErrors<CreatePrescriptionPayload>
}

export function PrescriptionItemsForm({ control, errors }: PrescriptionItemsFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  })

  const addNewItem = () => {
    append({
      medicineId: "",
      quantity: 1,
      unit: "",
      instructions: ""
    })
  }

  const removeItem = (index: number) => {
    remove(index)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <PillIcon className="size-4" />
            รายการยา
          </CardTitle>
          <Button
            type="button"
            onClick={addNewItem}
            size="sm"
            className="gap-2"
          >
            <PlusIcon className="size-4" />
            เพิ่มรายการยา
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center border-2 border-dashed border-muted rounded-lg">
            <PillIcon className="size-8 text-muted-foreground/50" />
            <p className="text-sm font-medium text-foreground">ยังไม่มีรายการยา</p>
            <p className="text-sm text-muted-foreground">คลิก "เพิ่มรายการยา" เพื่อเริ่มต้น</p>
            <Button
              type="button"
              onClick={addNewItem}
              size="sm"
              variant="outline"
              className="gap-2"
            >
              <PlusIcon className="size-4" />
              เพิ่มรายการยา
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    รายการที่ {index + 1}
                  </Badge>
                  <Button
                    type="button"
                    onClick={() => removeItem(index)}
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <TrashIcon className="size-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Medicine Search */}
                  <Field 
                    data-invalid={!!errors.items?.[index]?.medicineId}
                    className="sm:col-span-2"
                  >
                    <FieldLabel>รายการยา *</FieldLabel>
                    <Controller
                      name={`items.${index}.medicineId`}
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <MedicineSearchCombobox
                          value={value}
                          onValueChange={(medicineId, medicine) => {
                            onChange(medicineId)
                            // Auto-fill unit with default value if medicine is selected
                            if (medicine && control._formValues.items[index]) {
                              const currentItem = control._formValues.items[index]
                              if (!currentItem.unit) {
                                currentItem.unit = "เม็ด" // Default unit
                              }
                            }
                          }}
                          placeholder="ค้นหาและเลือกรายการยา..."
                        />
                      )}
                    />
                    <FieldError>{errors.items?.[index]?.medicineId?.message}</FieldError>
                  </Field>

                  {/* Quantity */}
                  <Field data-invalid={!!errors.items?.[index]?.quantity}>
                    <FieldLabel>จำนวน *</FieldLabel>
                    <Controller
                      name={`items.${index}.quantity`}
                      control={control}
                      render={({ field: { value, onChange, ...field } }) => (
                        <Input
                          {...field}
                          type="number"
                          min="1"
                          step="1"
                          placeholder="จำนวน"
                          value={value || ""}
                          onChange={(e) => {
                            const num = e.target.value ? parseInt(e.target.value) : 0
                            onChange(num)
                          }}
                          aria-invalid={!!errors.items?.[index]?.quantity}
                        />
                      )}
                    />
                    <FieldError>{errors.items?.[index]?.quantity?.message}</FieldError>
                  </Field>

                  {/* Unit */}
                  <Field data-invalid={!!errors.items?.[index]?.unit}>
                    <FieldLabel>หน่วย *</FieldLabel>
                    <Controller
                      name={`items.${index}.unit`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="เช่น เม็ด, ขวด, กล่อง"
                          aria-invalid={!!errors.items?.[index]?.unit}
                        />
                      )}
                    />
                    <FieldError>{errors.items?.[index]?.unit?.message}</FieldError>
                  </Field>
                </div>

                {/* Instructions */}
                <Field data-invalid={!!errors.items?.[index]?.instructions}>
                  <FieldLabel>หมายเหตุ</FieldLabel>
                  <Controller
                    name={`items.${index}.instructions`}
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
                        rows={2}
                      />
                    )}
                  />
                  <FieldError>{errors.items?.[index]?.instructions?.message}</FieldError>
                </Field>
              </div>
            ))}

            {/* Add More Button */}
            <Button
              type="button"
              onClick={addNewItem}
              variant="outline"
              className="w-full gap-2"
            >
              <PlusIcon className="size-4" />
              เพิ่มรายการยาอีก
            </Button>

            {/* Summary */}
            <div className="bg-muted/30 p-3 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">รวมรายการทั้งหมด:</span>
                <Badge variant="secondary">
                  {fields.length} รายการ
                </Badge>
              </div>
            </div>
          </div>
        )}

        {errors.items && typeof errors.items.message === 'string' && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircleIcon className="size-4" />
            {errors.items.message}
          </div>
        )}
      </CardContent>
    </Card>
  )
}