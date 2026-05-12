import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "card" | "text" | "avatar" | "button" | "table-row"
}

function Skeleton({ className, variant = "text", ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-muted",
        {
          "h-4 w-full": variant === "text",
          "h-64 w-full": variant === "card",
          "h-10 w-10 rounded-full": variant === "avatar",
          "h-10 w-24": variant === "button",
          "h-12 w-full": variant === "table-row",
        },
        className
      )}
      {...props}
    />
  )
}

function SkeletonCard() {
  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-6">
      <Skeleton variant="text" className="h-6 w-3/4" />
      <Skeleton variant="text" className="h-4 w-full" />
      <Skeleton variant="text" className="h-4 w-5/6" />
      <Skeleton variant="button" className="h-10 w-32" />
    </div>
  )
}

function SkeletonProductCard() {
  return (
    <div className="space-y-4 rounded-lg border border-border bg-card overflow-hidden">
      <Skeleton variant="card" className="h-48 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton variant="text" className="h-5 w-3/4" />
        <Skeleton variant="text" className="h-4 w-full" />
        <Skeleton variant="text" className="h-4 w-1/2" />
        <div className="flex gap-2 pt-2">
          <Skeleton variant="button" className="flex-1 h-10" />
          <Skeleton variant="button" className="flex-1 h-10" />
        </div>
      </div>
    </div>
  )
}

function SkeletonTableRow() {
  return (
    <tr>
      <td className="px-4 py-3">
        <Skeleton variant="text" className="h-4 w-24" />
      </td>
      <td className="px-4 py-3">
        <Skeleton variant="text" className="h-4 w-32" />
      </td>
      <td className="px-4 py-3">
        <Skeleton variant="text" className="h-4 w-20" />
      </td>
      <td className="px-4 py-3">
        <Skeleton variant="button" className="h-8 w-16" />
      </td>
    </tr>
  )
}

export { Skeleton, SkeletonCard, SkeletonProductCard, SkeletonTableRow }
