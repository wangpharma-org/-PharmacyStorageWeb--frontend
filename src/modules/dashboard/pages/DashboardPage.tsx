import { Link } from "react-router-dom"
import { ClipboardListIcon, WarehouseIcon, PillIcon, ArrowRightIcon } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

const dashboards = [
  {
    to: "/app/dashboard/prescription",
    label: "Prescription Dashboard",
    description: "Track prescriptions, dispensing status and patient history",
    icon: ClipboardListIcon,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    to: "/app/dashboard/stock",
    label: "Stock Dashboard",
    description: "Monitor rooms, zones, racks and available shelf space",
    icon: WarehouseIcon,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    to: "/app/dashboard/product",
    label: "Product Dashboard",
    description: "Browse medicine catalogue and track inventory levels",
    icon: PillIcon,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
]

export function DashboardPage() {
  const { user } = useAuth()

  return (
    <div>
      <div className="flex items-center justify-between gap-4 pb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back{user ? `, ${user.firstName} ${user.lastName}` : ""}. Select a dashboard to get started.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {dashboards.map(({ to, label, description, icon: Icon, color, bg }) => (
          <Link
            key={to}
            to={to}
            className="group flex flex-col gap-4 rounded-lg border border-border bg-card p-6 transition-colors hover:bg-muted/40"
          >
            <div className="flex items-center justify-between">
              <div className={`flex size-10 items-center justify-center rounded-lg ${bg}`}>
                <Icon className={`size-5 ${color}`} strokeWidth={1.5} />
              </div>
              <ArrowRightIcon className="size-4 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-foreground">{label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

