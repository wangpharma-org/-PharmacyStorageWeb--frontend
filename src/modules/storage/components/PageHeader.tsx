import type { ReactNode } from "react"
import { ArrowLeftIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

interface PageHeaderProps {
  backTo: string
  icon: ReactNode
  title: string
  subtitle: string
}

export function PageHeader({ backTo, icon, title, subtitle }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <Button variant="ghost" size="icon" className="size-8" asChild>
        <Link to={backTo}>
          <ArrowLeftIcon className="size-4" />
        </Link>
      </Button>
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          {icon}
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  )
}
