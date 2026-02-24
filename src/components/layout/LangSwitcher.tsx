import { useTranslation } from "react-i18next"
import { ChevronDownIcon, GlobeIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LangSwitcher() {
  const { i18n } = useTranslation()
  const lang = i18n.language

  function handleChange(value: string) {
    i18n.changeLanguage(value)
    localStorage.setItem("lang", value)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
        >
          <GlobeIcon className="size-4" />
          <span className="hidden sm:inline">{lang === "th" ? "ไทย" : "EN"}</span>
          <ChevronDownIcon className="size-3.5 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[130px]">
        <DropdownMenuRadioGroup value={lang} onValueChange={handleChange}>
          <DropdownMenuRadioItem value="th">
            <span className="mr-2">🇹🇭</span> ไทย
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="en">
            <span className="mr-2">🇺🇸</span> English
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
