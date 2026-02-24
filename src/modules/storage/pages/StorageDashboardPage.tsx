import { Link } from "react-router-dom"
import { WarehouseIcon, FlaskConicalIcon, ArrowRightIcon } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const sections = [
  {
    to: "/app/storage/stock",
    icon: WarehouseIcon,
    title: "Stock Management",
    description: "Manage rooms, zones, racks, and shelves for physical medicine storage.",
    color: "text-emerald-500",
  },
  {
    to: "/app/storage/medicines",
    icon: FlaskConicalIcon,
    title: "Medicine Management",
    description: "Add, update, and remove medicines in the product catalogue.",
    color: "text-blue-500",
  },
]

export function StorageDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Storage</h1>
        <p className="text-sm text-muted-foreground">
          Manage physical storage locations and the medicine catalogue.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sections.map(({ to, icon: Icon, title, description, color }) => (
          <Link key={to} to={to} className="group">
            <Card className="h-full transition-colors duration-150 hover:bg-muted/50">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <Icon className={`size-6 ${color}`} strokeWidth={1.5} />
                  <ArrowRightIcon className="size-4 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5" />
                </div>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
