import { Link } from "react-router-dom"
import { ArrowRightIcon, ShieldCheckIcon, SparklesIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import { LangSwitcher } from "@/components/layout/LangSwitcher"

export function LandingPage() {
  const { t, i18n } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <Navbar
        t={t}
        lang={i18n.language}
        onLangChange={(lang) => {
          i18n.changeLanguage(lang)
          localStorage.setItem("lang", lang)
        }}
      />
      <main className="flex flex-1 flex-col">
        <HeroSection t={t} />
      </main>
    </div>
  )
}

interface NavbarProps {
  t: ReturnType<typeof useTranslation>["t"]
  lang: string
  onLangChange: (lang: string) => void
}

function Navbar({ t }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-full border border-green-700">
            <ShieldCheckIcon className="size-3.5 text-green-700" strokeWidth={1.5} />
          </div>
          <span className="text-sm font-semibold text-gray-800 tracking-tight">{t("landing.brand")}</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">

          {/* Language switcher */}
          <LangSwitcher />

          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          >
            <Link to="/login">{t("landing.login")}</Link>
          </Button>

          <Button
            size="sm"
            asChild
            className="bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors duration-150"
          >
            <Link to="/register">{t("landing.register")}</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

interface HeroSectionProps {
  t: ReturnType<typeof useTranslation>["t"]
}

function HeroSection({ t }: HeroSectionProps) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-4 py-24 sm:px-6 sm:py-32">
      <div className="w-full max-w-2xl rounded-2xl bg-white px-10 py-14 shadow-[0_4px_32px_rgba(0,0,0,0.08)] text-center">

        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex size-[64px] items-center justify-center rounded-full border-2 border-green-700 bg-white">
            <ShieldCheckIcon className="size-7 text-green-700" strokeWidth={1.5} />
          </div>
        </div>

        {/* Badge */}
        <div className="mb-5 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-500">
            <SparklesIcon className="size-3 text-green-600" />
            {t("landing.badge")}
          </span>
        </div>

        {/* Headline */}
        <h1 className="mb-4 text-balance text-3xl font-semibold tracking-tight text-gray-800 sm:text-4xl">
          {t("landing.headline")}
        </h1>
        <p className="mx-auto mb-8 max-w-md text-balance text-sm text-gray-500 sm:text-base">
          {t("landing.description")}
        </p>

        {/* CTA */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            asChild
            className="bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition-colors duration-150"
          >
            <Link to="/register">
              {t("landing.ctaPrimary")}
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-800 transition-colors duration-150"
          >
            <Link to="/">{t("landing.ctaSecondary")}</Link>
          </Button>
        </div>

        <p className="mt-6 text-xs text-gray-400">{t("landing.note")}</p>
      </div>
    </section>
  )
}
