import { AuthProvider } from "@/modules/auth/context/AuthContext"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./QueryClientProvider"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
