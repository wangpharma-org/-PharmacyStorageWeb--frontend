import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuthContext } from "@/modules/auth/context/AuthContext"
import { Skeleton } from "@/components/ui/skeleton"

export function ProtectedRoute() {
  const { status } = useAuthContext()
  const location = useLocation()

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Skeleton className="h-8 w-48" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export function GuestRoute() {
  const { status } = useAuthContext()

  if (status === "loading") {
    return null
  }

  if (status === "authenticated") {
    return <Navigate to="/app/dashboard" replace />
  }

  return <Outlet />
}
