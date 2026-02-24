import { Skeleton } from "@/components/ui/skeleton"
import { TableCell, TableRow } from "@/components/ui/table"

export function SkeletonRows({ cols, rows = 4 }: { cols: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: cols }).map((__, j) => (
            <TableCell key={j}>
              <Skeleton className="h-4 w-full max-w-40" />
            </TableCell>
          ))}
          <TableCell>
            <Skeleton className="h-7 w-16 rounded-md" />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

export function EmptyRow({ cols, label }: { cols: number; label: string }) {
  return (
    <TableRow>
      <TableCell colSpan={cols + 1} className="py-12 text-center text-sm text-muted-foreground">
        No {label} found.
      </TableCell>
    </TableRow>
  )
}
