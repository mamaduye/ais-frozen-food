import type { OrderStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

const styles: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800 ring-amber-200",
  paid: "bg-sky-100 text-sky-800 ring-sky-200",
  processing: "bg-indigo-100 text-indigo-800 ring-indigo-200",
  shipped: "bg-blue-100 text-blue-800 ring-blue-200",
  delivered: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  cancelled: "bg-rose-100 text-rose-700 ring-rose-200",
}

const labels: Record<OrderStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
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
