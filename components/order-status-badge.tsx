import type { OrderStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

const styles: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800 ring-amber-200",
  paid: "bg-sky-100 text-sky-800 ring-sky-200",
  processed: "bg-indigo-100 text-indigo-800 ring-indigo-200",
  shipped: "bg-blue-100 text-blue-800 ring-blue-200",
  delivered: "bg-green-100 text-green-800 ring-green-200",
  cancelled: "bg-rose-100 text-rose-700 ring-rose-200",
  completed: "bg-green-100 text-green-800 ring-green-200",
}

const labels: Record<OrderStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  processed: "Processed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  completed: "Completed",
}

export function OrderStatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        styles[status],
        className,
      )}
    >
      {labels[status]}
    </span>
  )
}
