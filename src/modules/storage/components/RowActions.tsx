import { PencilIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface RowActionsProps {
  onEdit: () => void
  onDelete: () => void
}

export function RowActions({ onEdit, onDelete }: RowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button variant="ghost" size="icon" className="size-7" onClick={onEdit}>
        <PencilIcon className="size-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-7 text-destructive/70 hover:text-destructive"
        onClick={onDelete}
      >
        <Trash2Icon className="size-3.5" />
      </Button>
    </div>
  )
}
