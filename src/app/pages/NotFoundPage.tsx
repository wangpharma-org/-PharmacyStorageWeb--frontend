import { Link } from "react-router-dom"
import { ArrowLeftIcon, SearchXIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-[400px] rounded-2xl bg-white px-10 py-10 shadow-[0_4px_32px_rgba(0,0,0,0.08)] text-center">
        
        {/* Icon */}
        <div className="mb-5 flex justify-center">
          <div className="flex size-[64px] items-center justify-center rounded-full border-2 border-green-700 bg-white">
            <SearchXIcon className="size-7 text-green-700" strokeWidth={1.5} />
          </div>
        </div>

        {/* Status code */}
        <p className="mb-1 font-mono text-4xl font-semibold text-gray-800">404</p>

        <Separator className="my-5" />

        {/* Message */}
        <h1 className="mb-2 text-[1.1rem] font-semibold text-gray-800">
          ไม่พบหน้าที่คุณต้องการ
        </h1>
        <p className="mb-7 text-sm text-gray-500">
          หน้านี้อาจถูกย้าย ลบ หรือ URL ที่พิมพ์อาจไม่ถูกต้อง
        </p>

        {/* Action */}
        <div className="flex justify-center">
          <Button
            asChild
            className="h-9 min-w-[160px] rounded-md bg-blue-600 px-8 text-sm font-medium text-white hover:bg-blue-700 active:bg-blue-800 transition-colors duration-150"
          >
            <Link to="/">
              <ArrowLeftIcon className="size-4" />
              กลับหน้าหลัก
            </Link>
          </Button>
        </div>

      </div>
    </div>
  )
}
