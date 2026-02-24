import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, ShieldCheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useLogin } from "../hooks/useLogin"
import type { LoginPayload } from "../types/auth.types"

export function LoginPage() {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading, error: serverError } = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>()

  const onSubmit = (data: LoginPayload) => {
    login(data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-[420px] rounded-2xl bg-white px-10 py-10 shadow-[0_4px_32px_rgba(0,0,0,0.08)]">

        {/* Back to landing */}
        <div className="-mt-2 mb-4">
          <Button asChild variant="ghost" size="sm" className="-ml-2 text-gray-500 hover:text-gray-800">
            <Link to="/">
              <ArrowLeftIcon className="mr-1 size-4" />
              {t("common.backToHome")}
            </Link>
          </Button>
        </div>

        {/* Logo */}
        <div className="mb-5 flex justify-center">
          <div className="flex size-[64px] items-center justify-center rounded-full border-2 border-green-700 bg-white">
            <ShieldCheckIcon className="size-7 text-green-700" strokeWidth={1.5} />
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-5 text-center text-[1.35rem] font-semibold text-gray-800">
          {t("auth.login.title")}
        </h1>

        <Separator className="mb-7" />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup className="gap-5">

            {/* Email / Username */}
            <Field data-invalid={!!errors.email}>
              <FieldLabel
                htmlFor="login-email"
                className="text-sm font-medium text-gray-700 group-data-[invalid=true]/field:text-destructive"
              >
                {t("auth.login.emailLabel")}
              </FieldLabel>
              <Input
                id="login-email"
                type="email"
                placeholder={t("auth.login.emailPlaceholder")}
                autoComplete="email"
                aria-invalid={!!errors.email}
                className="h-10 rounded-md border-gray-300 bg-white text-sm placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20 aria-invalid:border-destructive"
                {...register("email", {
                  required: t("auth.login.errors.emailRequired"),
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t("auth.login.errors.emailPattern"),
                  },
                })}
              />
              <FieldError errors={[errors.email]} className="text-xs text-destructive" />
            </Field>

            {/* Password */}
            <Field data-invalid={!!errors.password}>
              <FieldLabel
                htmlFor="login-password"
                className="text-sm font-medium text-gray-700 group-data-[invalid=true]/field:text-destructive"
              >
                {t("auth.login.passwordLabel")}
              </FieldLabel>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("auth.login.passwordPlaceholder")}
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  className="h-10 rounded-md border-gray-300 bg-white pr-10 text-sm placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20 aria-invalid:border-destructive"
                  {...register("password", {
                    required: t("auth.login.errors.passwordRequired"),
                    minLength: { value: 6, message: t("auth.login.errors.passwordMin") },
                  })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? t("auth.login.hidePassword") : t("auth.login.showPassword")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 size-7 text-gray-400 hover:bg-transparent hover:text-gray-600"
                >
                  {showPassword
                    ? <EyeOffIcon className="size-4" />
                    : <EyeIcon className="size-4" />
                  }
                </Button>
              </div>
              <FieldError errors={[errors.password]} className="text-xs text-destructive" />
            </Field>

            {/* Forgot password */}
            <div className="-mt-2 flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 transition-colors hover:text-blue-800"
              >
                {t("auth.login.forgotPassword")}
              </Link>
            </div>

            {/* Server error */}
            {serverError && (
              <p className="text-center text-xs text-destructive">{serverError}</p>
            )}

            {/* Submit */}
            <div className="flex justify-center pt-1">
              <Button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "h-9 min-w-[140px] rounded-md bg-blue-600 px-8 text-sm font-medium text-white",
                  "hover:bg-blue-700 active:bg-blue-800",
                  "transition-colors duration-150 disabled:opacity-60"
                )}
              >
                {isLoading ? t("auth.login.submitting") : t("auth.login.submit")}
              </Button>
            </div>

          </FieldGroup>
        </form>

        {/* Footer */}
        <p className="mt-7 text-center text-sm text-gray-500">
          {t("auth.login.noAccount")}{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 transition-colors hover:text-blue-800"
          >
            {t("auth.login.registerLink")}
          </Link>
        </p>

      </div>
    </div>
  )
}
