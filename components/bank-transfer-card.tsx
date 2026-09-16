"use client"

import { Copy, Check, Building2 } from "lucide-react"
import { useState } from "react"

type BankTransferCardProps = {
  bank: string
  accountNumber: string
  accountName: string
}

export function BankTransferCard({
  bank,
  accountNumber,
  accountName,
}: BankTransferCardProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(accountNumber)

    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A49A1] via-[#0754B8] to-[#00529C] p-6 text-white shadow-xl">
      {/* Background decoration */}
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-300/20 blur-2xl" />

      <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-blue-400/10 blur-2xl" />

      <div className="relative z-10 flex min-h-[220px] flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15">
              <Building2 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs text-blue-100">
                
              </p>

              <p className="text-lg font-bold">
                {bank}
              </p>
            </div>
          </div>

          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
            BANK TRANSFER
          </span>
        </div>

        {/* Account Number */}
        <div>
          <p className="mb-2 text-xs uppercase tracking-widest text-blue-100">
            Nomor Rekening
          </p>

          <div className="flex items-center justify-between gap-4">
            <p className="text-2xl font-bold tracking-[0.12em]">
              {accountNumber}
            </p>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#EA7815] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#d9690f]"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Tersalin
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Salin
                </>
              )}
            </button>
          </div>
        </div>

        {/* Account Name */}
        <div>
          <p className="text-xs text-blue-100">
            Atas Nama
          </p>

          <p className="font-semibold uppercase tracking-wide">
            {accountName}
          </p>
        </div>
      </div>
    </div>
  )
}