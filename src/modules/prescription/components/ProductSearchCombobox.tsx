import { useState } from "react"
import { Combobox } from "@/components/ui/combobox"
import { useDebounce } from "@/hooks/useDebounce"
import { useProductSearch } from "../hooks/usePrescriptions"
import type { ProductInfo } from "../types/prescription.types"

interface ProductSearchComboboxProps {
  value?: string
  onValueChange: (productId: string, product?: ProductInfo) => void
  placeholder?: string
  className?: string
}

export function ProductSearchCombobox({
  value,
  onValueChange,
  placeholder = "ค้นหารายการยา...",
  className
}: ProductSearchComboboxProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearch = useDebounce(searchTerm, 300)

  const { data: products = [], isLoading } = useProductSearch({
    search: debouncedSearch,
    limit: 20
  })

  const options = products.map(product => ({
    value: product.id,
    label: product.name,
    product
  }))

  const selectedProduct = products.find(p => p.id === value)

  const handleSelect = (productId: string) => {
    const product = products.find(p => p.id === productId)
    onValueChange(productId, product)
  }

  const handleSearchChange = (search: string) => {
    setSearchTerm(search)
  }

  return (
    <Combobox
      value={value}
      onValueChange={handleSelect}
      onSearchChange={handleSearchChange}
      searchValue={searchTerm}
      options={options}
      placeholder={placeholder}
      searchPlaceholder="พิมพ์เพื่อค้นหา..."
      emptyText="ไม่พบรายการยา"
      loading={isLoading}
      className={className}
      renderOption={(option) => (
        <div className="flex flex-col items-start gap-1">
          <div className="font-medium">{option.product.name}</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono">{option.product.id}</span>
            <span>•</span>
            <span>หน่วย: {option.product.unit}</span>
            <span>•</span>
            <span className={
              option.product.stockQuantity > 0 
                ? "text-green-600" 
                : "text-red-600"
            }>
              คงเหลือ: {option.product.stockQuantity}
            </span>
          </div>
        </div>
      )}
      renderValue={() => (
        selectedProduct ? (
          <div className="flex items-center justify-between w-full">
            <span>{selectedProduct.name}</span>
            <span className="text-xs text-muted-foreground">
              คงเหลือ: {selectedProduct.stockQuantity}
            </span>
          </div>
        ) : (
          placeholder
        )
      )}
    />
  )
}