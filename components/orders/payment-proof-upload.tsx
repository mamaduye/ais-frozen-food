"use client"

import { useState } from "react"
import Image from "next/image"
import { Upload, CheckCircle2, ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { BankTransferCard } from "@/components/bank-transfer-card"
import { uploadPaymentProof } from "@/lib/supabase/orders-client"
import { Button } from "@/components/ui/button"
import { paymentConfig } from "@/lib/payment-config"


export function PaymentProofUpload({
  orderId,
  paymentStatus,
  paymentProof,
}: {
  orderId: string
  paymentStatus: string
  paymentProof: string | null
}) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile = e.target.files?.[0]

    if (!selectedFile) return

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ]

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Format file tidak didukung", {
        description: "Gunakan JPG, PNG, atau WebP.",
      })
      return
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar", {
        description: "Maksimal ukuran file adalah 5 MB.",
      })
      return
    }

    setFile(selectedFile)

    const previewUrl = URL.createObjectURL(selectedFile)
    setPreview(previewUrl)

    e.target.value = ""
  }

  async function handleUpload() {
    if (!file) {
      toast.error("Pilih bukti pembayaran terlebih dahulu")
      return
    }

    try {
      setLoading(true)

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(
        "/api/upload-payment-proof",
        {
          method: "POST",
          body: formData,
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(
          result.error || "Upload gagal"
        )
      }

      await uploadPaymentProof(
        orderId,
        result.url
      )

      toast.success(
        "Bukti pembayaran berhasil dikirim"
      )

      window.location.reload()
    } catch (error) {
      console.error(error)

      toast.error("Upload gagal", {
        description:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan.",
      })
    } finally {
      setLoading(false)
    }
  }

  if (paymentProof) {
    return (
      <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600" />

          <div>
            <h3 className="font-semibold text-green-900">
              Bukti pembayaran berhasil dikirim
            </h3>

            <p className="text-sm text-green-700">
              terima kasih atas partisipannya.
            </p>
          </div>
        </div>

        <a
          href={paymentProof}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block"
        >
          <div className="relative h-80 w-full overflow-hidden rounded-xl border bg-muted">
            <Image
              src={paymentProof}
              alt="Bukti pembayaran"
              fill
              sizes="(max-width:768px) 100vw, 500px"
              className="object-contain"
            />
          </div>
        </a>
      </div>
    )
  }

  if (
    paymentStatus !== "pending"
  ) {
    return null
  }

  return (
    <div className="mt-6 space-y-6 rounded-2xl border bg-muted/30 p-5">

      <div>
        <h3 className="text-lg font-semibold">
          Pembayaran
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          Silakan lakukan pembayaran sesuai total pesanan.
        </p>
      </div>

      <BankTransferCard
        bank={paymentConfig.bank.name}
        accountNumber={paymentConfig.bank.accountNumber}
        accountName={paymentConfig.bank.accountName}
      />

      <div className="rounded-xl border bg-background p-4">
        <div className="mb-3 flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />

          <p className="font-medium">
            Atau scan QRIS
          </p>
        </div>

        <div className="relative mx-auto aspect-square max-w-xs overflow-hidden rounded-xl border">
          <Image
            src={paymentConfig.qris.image}
            alt="QRIS AIS Frozen Food"
            fill
            className="object-contain"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="payment-proof"
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition hover:bg-background"
        >
          <Upload className="mb-3 h-8 w-8 text-muted-foreground" />

          <span className="font-medium">
            Pilih bukti pembayaran
          </span>

          <span className="mt-1 text-xs text-muted-foreground">
            JPG, PNG, WebP • Maksimal 5 MB
          </span>

          <input
            id="payment-proof"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {preview && (
        <div>
          <p className="mb-2 text-sm font-medium">
            Preview bukti pembayaran
          </p>

          <div className="relative h-80 w-full overflow-hidden rounded-xl border bg-muted">
            <Image
              src={preview}
              alt="Preview bukti pembayaran"
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-contain"
            />
          </div>
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={!file || loading}
        className="w-full"
      >
        {loading
          ? "Mengupload..."
          : "Kirim Bukti Pembayaran"}
      </Button>

    </div>
  )
}