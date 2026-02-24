import { NavLink, Outlet } from "react-router-dom"
import { LogOutIcon, ShieldCheckIcon, UsersIcon, ShieldIcon, LayoutDashboardIcon, WarehouseIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"

const navItems = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { to: "/app/storage", label: "Storage", icon: WarehouseIcon },
  { to: "/app/admin/users", label: "Users", icon: UsersIcon },
  { to: "/app/admin/roles", label: "Roles", icon: ShieldIcon },
]

export function MainLayout() {
  const { user, logout } = useAuth()

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "?"

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Topbar */}
      <header className="sticky top-0 z-10 border-b border-border bg-background">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          {/* Brand + nav */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="size-5 text-primary" strokeWidth={1.5} />
              <span className="text-sm font-semibold text-foreground">Demo Project</span>
            </div>
            <nav className="hidden items-center gap-0.5 sm:flex">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors duration-150",
                      isActive
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                    )
                  }
                >
                  <Icon className="size-3.5" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* User avatar dropdown */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <Avatar className="cursor-pointer transition-opacity hover:opacity-80">
                    <AvatarFallback className="text-xs font-medium">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="flex flex-col gap-0.5 py-2">
                  <span className="text-sm font-medium text-foreground">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {user.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={logout}>
                  <LogOutIcon />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      {/* Page content */}
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  )
}
