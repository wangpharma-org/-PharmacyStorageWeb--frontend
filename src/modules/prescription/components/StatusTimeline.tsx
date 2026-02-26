import { CheckCircleIcon, ClockIcon, XCircleIcon, AlertCircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { PrescriptionStatus } from "../types/prescription.types"
import type { StatusTimeline as StatusTimelineType } from "../types/prescription.types"
import { StatusBadge } from "./StatusBadge"
import React from "react"

interface StatusTimelineProps {
  timeline: StatusTimelineType[]
  currentStatus: PrescriptionStatus
  className?: string
}

const statusIcons: Record<PrescriptionStatus, React.ComponentType<{ className?: string }>> = {
  [PrescriptionStatus.CREATED]: ClockIcon,
  [PrescriptionStatus.STOCK_RESERVED]: CheckCircleIcon,
  [PrescriptionStatus.PARTIAL_RESERVED]: AlertCircleIcon, 
  [PrescriptionStatus.DISPENSED]: CheckCircleIcon,
  [PrescriptionStatus.COMPLETED]: CheckCircleIcon,
  [PrescriptionStatus.PROBLEM]: XCircleIcon,
  [PrescriptionStatus.CANCELLED]: XCircleIcon,
  [PrescriptionStatus.REJECTED]: XCircleIcon,
  [PrescriptionStatus.TIMEOUT]: AlertCircleIcon
}

const statusOrder: PrescriptionStatus[] = [
  PrescriptionStatus.CREATED,
  PrescriptionStatus.STOCK_RESERVED,
  PrescriptionStatus.DISPENSED, 
  PrescriptionStatus.COMPLETED
]

export function StatusTimeline({ timeline, currentStatus, className }: StatusTimelineProps) {
  const sortedTimeline = timeline.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )

  const getStatusPosition = (status: PrescriptionStatus): number => {
    const index = statusOrder.indexOf(status)
    return index >= 0 ? index : statusOrder.length
  }

  const isStatusCompleted = (status: PrescriptionStatus): boolean => {
    return getStatusPosition(status) < getStatusPosition(currentStatus)
  }

  const isStatusActive = (status: PrescriptionStatus): boolean => {
    return status === currentStatus
  }

  const isStatusPending = (status: PrescriptionStatus): boolean => {
    return getStatusPosition(status) > getStatusPosition(currentStatus)
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Status Timeline</h3>
        <StatusBadge status={currentStatus} />
      </div>

      <div className="space-y-3">
        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {statusOrder.map((status, index) => {
            const Icon = statusIcons[status]
            const isCompleted = isStatusCompleted(status)
            const isActive = isStatusActive(status)
            const isPending = isStatusPending(status)

            return (
              <div key={status} className="flex flex-col items-center space-y-2">
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full border-2",
                    {
                      "border-green-500 bg-green-500 text-white": isCompleted,
                      "border-blue-500 bg-blue-500 text-white": isActive,
                      "border-gray-300 bg-gray-100 text-gray-400": isPending,
                    }
                  )}
                >
                  <Icon className="size-5" />
                </div>
                
                <div className="text-center">
                  <div
                    className={cn("text-xs font-medium capitalize", {
                      "text-green-600": isCompleted,
                      "text-blue-600": isActive,
                      "text-gray-400": isPending,
                    })}
                  >
                    {status.toLowerCase().replace('_', ' ')}
                  </div>
                </div>

                {/* Connecting line */}
                {index < statusOrder.length - 1 && (
                  <div
                    className={cn(
                      "absolute h-0.5 w-full -translate-y-5 transform",
                      {
                        "bg-green-500": isCompleted,
                        "bg-gray-300": !isCompleted,
                      }
                    )}
                    style={{
                      left: "50%",
                      width: `calc(100% / ${statusOrder.length - 1})`,
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Timeline Details */}
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">History</h4>
          <div className="space-y-2">
            {sortedTimeline.map((entry, index) => (
              <div key={index} className="flex items-start space-x-3 rounded-lg border p-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                  {React.createElement(statusIcons[entry.status] || ClockIcon, {
                    className: "size-4"
                  })}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <StatusBadge status={entry.status} />
                    <time className="text-xs text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleString()}
                    </time>
                  </div>
                  {entry.updatedBy && (
                    <p className="text-xs text-muted-foreground">
                      by {entry.updatedBy}
                    </p>
                  )}
                  {entry.notes && (
                    <p className="text-sm text-foreground">
                      {entry.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}