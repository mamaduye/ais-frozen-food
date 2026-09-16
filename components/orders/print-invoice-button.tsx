"use client"

import { Printer } from "lucide-react"

import { Button } from "@/components/ui/button"

export function PrintInvoiceButton() {
  function handlePrint() {
    window.print()
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handlePrint}
      className="print:hidden"
    >
      <Printer className="h-4 w-4" />
      Cetak Invoice
    </Button>
  )
}