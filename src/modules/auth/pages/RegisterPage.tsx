import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, UserPlusIcon } from "lucide-react"

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
import { useRegister } from "../hooks/useRegister"
import type { RegisterPayload } from "../types/auth.types"

export function RegisterPage() {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { register: registerUser, isLoading, error: serverError } = useRegister()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterPayload>()

  const onSubmit = (data: RegisterPayload) => {
    registerUser(data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-[440px] rounded-2xl bg-white px-10 py-10 shadow-[0_4px_32px_rgba(0,0,0,0.08)]">

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
            <UserPlusIcon className="size-7 text-green-700" strokeWidth={1.5} />
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-5 text-center text-[1.35rem] font-semibold text-gray-800">
          {t("auth.register.title")}
        </h1>

        <Separator className="mb-7" />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup className="gap-5">

            {/* First Name + Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!errors.firstName}>
                <FieldLabel
                  htmlFor="register-firstName"
                  className="text-sm font-medium text-gray-700 group-data-[invalid=true]/field:text-destructive"
                >
                  {t("auth.register.firstNameLabel")}
                </FieldLabel>
                <Input
                  id="register-firstName"
                  type="text"
                  placeholder={t("auth.register.firstNamePlaceholder")}
                  autoComplete="given-name"
                  aria-invalid={!!errors.firstName}
                  className="h-10 rounded-md border-gray-300 bg-white text-sm placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20 aria-invalid:border-destructive"
                  {...register("firstName", {
                    required: t("auth.register.errors.firstNameRequired"),
                    minLength: { value: 2, message: t("auth.register.errors.firstNameMin") },
                  })}
                />
                <FieldError errors={[errors.firstName]} className="text-xs text-destructive" />
              </Field>

              <Field data-invalid={!!errors.lastName}>
                <FieldLabel
                  htmlFor="register-lastName"
                  className="text-sm font-medium text-gray-700 group-data-[invalid=true]/field:text-destructive"
                >
                  {t("auth.register.lastNameLabel")}
                </FieldLabel>
                <Input
                  id="register-lastName"
                  type="text"
                  placeholder={t("auth.register.lastNamePlaceholder")}
                  autoComplete="family-name"
                  aria-invalid={!!errors.lastName}
                  className="h-10 rounded-md border-gray-300 bg-white text-sm placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20 aria-invalid:border-destructive"
                  {...register("lastName", {
                    required: t("auth.register.errors.lastNameRequired"),
                    minLength: { value: 2, message: t("auth.register.errors.lastNameMin") },
                  })}
                />
                <FieldError errors={[errors.lastName]} className="text-xs text-destructive" />
              </Field>
            </div>

            {/* Email */}
            <Field data-invalid={!!errors.email}>
              <FieldLabel
                htmlFor="register-email"
                className="text-sm font-medium text-gray-700 group-data-[invalid=true]/field:text-destructive"
              >
                {t("auth.register.emailLabel")}
              </FieldLabel>
              <Input
                id="register-email"
                type="email"
                placeholder={t("auth.register.emailPlaceholder")}
                autoComplete="email"
                aria-invalid={!!errors.email}
                className="h-10 rounded-md border-gray-300 bg-white text-sm placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20 aria-invalid:border-destructive"
                {...register("email", {
                  required: t("auth.register.errors.emailRequired"),
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t("auth.register.errors.emailPattern"),
                  },
                })}
              />
              <FieldError errors={[errors.email]} className="text-xs text-destructive" />
            </Field>

            {/* Password */}
            <Field data-invalid={!!errors.password}>
              <FieldLabel
                htmlFor="register-password"
                className="text-sm font-medium text-gray-700 group-data-[invalid=true]/field:text-destructive"
              >
                {t("auth.register.passwordLabel")}
              </FieldLabel>
              <div className="relative">
                <Input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("auth.register.passwordPlaceholder")}
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  className="h-10 rounded-md border-gray-300 bg-white pr-10 text-sm placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20 aria-invalid:border-destructive"
                  {...register("password", {
                    required: t("auth.register.errors.passwordRequired"),
                    minLength: { value: 8, message: t("auth.register.errors.passwordMin") },
                  })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? t("auth.register.hidePassword") : t("auth.register.showPassword")}
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

            {/* Confirm Password */}
            <Field data-invalid={!!errors.confirmPassword}>
              <FieldLabel
                htmlFor="register-confirm"
                className="text-sm font-medium text-gray-700 group-data-[invalid=true]/field:text-destructive"
              >
                {t("auth.register.confirmPasswordLabel")}
              </FieldLabel>
              <div className="relative">
                <Input
                  id="register-confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder={t("auth.register.confirmPasswordPlaceholder")}
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirmPassword}
                  className="h-10 rounded-md border-gray-300 bg-white pr-10 text-sm placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-blue-500/20 aria-invalid:border-destructive"
                  {...register("confirmPassword", {
                    required: t("auth.register.errors.confirmRequired"),
                    validate: (value) =>
                      value === watch("password") || t("auth.register.errors.confirmMatch"),
                  })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? t("auth.register.hidePassword") : t("auth.register.showPassword")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 size-7 text-gray-400 hover:bg-transparent hover:text-gray-600"
                >
                  {showConfirm
                    ? <EyeOffIcon className="size-4" />
                    : <EyeIcon className="size-4" />
                  }
                </Button>
              </div>
              <FieldError errors={[errors.confirmPassword]} className="text-xs text-destructive" />
            </Field>

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
                {isLoading ? t("auth.register.submitting") : t("auth.register.submit")}
              </Button>
            </div>

          </FieldGroup>
        </form>

        {/* Footer */}
        <p className="mt-7 text-center text-sm text-gray-500">
          {t("auth.register.hasAccount")}{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 transition-colors hover:text-blue-800"
          >
            {t("auth.register.loginLink")}
          </Link>
        </p>

      </div>
    </div>
  )
}
