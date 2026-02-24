import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router-dom"

import "./index.css"
import "./i18n"
import { router } from "./app/router"
import { AppProviders } from "./app/providers/providers"
import { apiClient } from "./services/api"
import { attachRefreshInterceptor } from "./services/interceptor"

attachRefreshInterceptor(apiClient)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>
)
