import { Link } from "react-router-dom"
import { ArrowLeftIcon, WarehouseIcon } from "lucide-react"

export function StockDashboardPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 pb-6">
        <Link
          to="/app/dashboard"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeftIcon className="size-4" />
          Dashboard
        </Link>
      </div>

      <div className="flex items-center justify-between gap-4 pb-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
            <WarehouseIcon className="size-5 text-emerald-500" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Stock Dashboard</h1>
            <p className="text-sm text-muted-foreground">Overview of rooms, zones, racks and shelf inventory</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pb-6">
        {[
          { label: "Total Rooms", value: "—" },
          { label: "Total Shelves", value: "—" },
          { label: "Occupied Shelves", value: "—" },
          { label: "Available Shelves", value: "—" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Placeholder content */}
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <WarehouseIcon className="mx-auto mb-3 size-10 text-muted-foreground/40" strokeWidth={1} />
        <p className="text-sm text-muted-foreground">Stock and shelf data will appear here</p>
      </div>
    </div>
  )
}
