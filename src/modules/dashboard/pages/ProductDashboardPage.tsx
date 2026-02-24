import { Link } from "react-router-dom"
import { ArrowLeftIcon, PillIcon } from "lucide-react"

export function ProductDashboardPage() {
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
          <div className="flex size-10 items-center justify-center rounded-lg bg-violet-500/10">
            <PillIcon className="size-5 text-violet-500" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Product Dashboard</h1>
            <p className="text-sm text-muted-foreground">Overview of medicine catalogue and product inventory</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pb-6">
        {[
          { label: "Total Medicines", value: "—" },
          { label: "Added This Month", value: "—" },
          { label: "Out of Stock", value: "—" },
          { label: "Low Stock", value: "—" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Placeholder content */}
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <PillIcon className="mx-auto mb-3 size-10 text-muted-foreground/40" strokeWidth={1} />
        <p className="text-sm text-muted-foreground">Product and medicine data will appear here</p>
      </div>
    </div>
  )
}
