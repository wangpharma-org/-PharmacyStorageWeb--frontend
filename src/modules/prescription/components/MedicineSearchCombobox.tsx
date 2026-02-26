"use client"

import { useState } from "react"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { useDebounce } from "@/hooks/useDebounce"
import { useMedicines } from "@/modules/storage/hooks/useMedicines"
import type { Medicine } from "@/modules/storage/types/medicine.types"

interface MedicineSearchComboboxProps {
  value?: string | null
  onValueChange: (medicineId: string, medicine?: Medicine) => void
  placeholder?: string
  className?: string
}

export function MedicineSearchCombobox({
  value,
  onValueChange,
  placeholder = "ค้นหารายการยา...",
  className
}: MedicineSearchComboboxProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearch = useDebounce(searchTerm, 300)

  const { data: medicineResponse, isLoading } = useMedicines({
    medicineName_en: debouncedSearch,
    limit: 20
  })

  const medicines = medicineResponse?.data || []

  // Convert medicines to items format that Combobox expects
  const items = medicines.map(medicine => ({
    value: medicine.id,
    label: medicine.medicineName_th || medicine.medicineName_en || 'ไม่ระบุชื่อ',
    medicine
  }))

  const handleValueChange = (selectedValue: string | null) => {
    
    if (selectedValue) {
      const medicine = medicines.find(m => m.id === selectedValue)
      
      onValueChange(selectedValue, medicine)

      setSearchTerm(medicine?.medicineName_th || medicine?.medicineName_en || "")
    } else {
      onValueChange("", undefined)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

//   console.log("MedicineSearchCombobox - medicines:", searchTerm)

  return (
    <Combobox 
      items={items}
      value={value || null}
      onValueChange={handleValueChange}
      className={className}
    >
      <ComboboxInput 
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        showClear={!!searchTerm}
      />
      <ComboboxContent>
        <ComboboxEmpty>
          {isLoading ? "กำลังค้นหา..." : "ไม่พบรายการยา"}
        </ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.value} value={item.value}>
              <div className="flex flex-col items-start gap-1 w-full">
                <div className="font-medium">
                  {item.medicine.medicineName_th || item.medicine.medicineName_en || 'ไม่ระบุชื่อ'}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                  <span className="font-mono">{item.medicine.medicineCode}</span>
                  {(item.medicine.medicineName_th && item.medicine.medicineName_en) && (
                    <>
                      <span>•</span>
                      <span>{item.medicine.medicineName_en}</span>
                    </>
                  )}
                  {item.medicine.medicineMethod_th && (
                    <>
                      <span>•</span>
                      <span className="truncate">วิธีใช้: {item.medicine.medicineMethod_th}</span>
                    </>
                  )}
                </div>
              </div>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}