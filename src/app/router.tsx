import { createBrowserRouter } from "react-router-dom"

import { RootLayout } from "@/layouts/RootLayout"
import { MainLayout } from "@/layouts/MainLayout"
import { ProtectedRoute, GuestRoute } from "@/components/layout/ProtectedRoute"
import { LandingPage } from "@/modules/landing/pages/LandingPage"
import { LoginPage } from "@/modules/auth/pages/LoginPage"
import { RegisterPage } from "@/modules/auth/pages/RegisterPage"
import { DashboardPage } from "@/modules/dashboard/pages/DashboardPage"
import { PrescriptionDashboardPage } from "@/modules/dashboard/pages/PrescriptionDashboardPage"
import { StockDashboardPage } from "@/modules/dashboard/pages/StockDashboardPage"
import { ProductDashboardPage } from "@/modules/dashboard/pages/ProductDashboardPage"
import { UsersPage } from "@/modules/admin/pages/UsersPage"
import { RolesPage } from "@/modules/admin/pages/RolesPage"
import { StorageDashboardPage } from "@/modules/storage/pages/StorageDashboardPage"
import { StockManagementPage } from "@/modules/storage/pages/StockManagementPage"
import { MedicineManagementPage } from "@/modules/storage/pages/MedicineManagementPage"
import { NotFoundPage } from "./pages/NotFoundPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        element: <GuestRoute />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
          {
            path: "register",
            element: <RegisterPage />,
          },
        ],
      },
      {
        path: "app",
        element: <ProtectedRoute />,
        children: [
          {
            element: <MainLayout />,
            children: [
              {
                path: "dashboard",
                children: [
                  {
                    index: true,
                    element: <DashboardPage />,
                  },
                  {
                    path: "prescription",
                    element: <PrescriptionDashboardPage />,
                  },
                  {
                    path: "stock",
                    element: <StockDashboardPage />,
                  },
                  {
                    path: "product",
                    element: <ProductDashboardPage />,
                  },
                ],
              },
              {
                path: "admin/users",
                element: <UsersPage />,
              },
              {
                path: "admin/roles",
                element: <RolesPage />,
              },
              {
                path: "storage",
                children: [
                  {
                    index: true,
                    element: <StorageDashboardPage />,
                  },
                  {
                    path: "stock",
                    element: <StockManagementPage />,
                  },
                  {
                    path: "medicines",
                    element: <MedicineManagementPage />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
])
