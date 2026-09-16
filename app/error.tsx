"use client"

import { Button } from "@/components/ui/button"

export default function Error({
  reset,
}: {
  reset: () => void
}) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">
        Terjadi Kesalahan
      </h1>

      <p className="text-muted-foreground">
        Coba lagi beberapa saat lagi.
      </p>

      <Button onClick={reset}>
        Coba Lagi
      </Button>
    </div>
  )
}