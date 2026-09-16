import { NextResponse } from "next/server"
import sharp from "sharp"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { r2 } from "@/lib/cloudflare/r2"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      )
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Only JPG, PNG, and WebP are allowed.",
        },
        { status: 400 }
      )
    }

    const maxSize = 5 * 1024 * 1024

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: "Maximum file size is 5MB.",
        },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const optimizedImage = await sharp(buffer)
      .resize({
        width: 1000,
        withoutEnlargement: true,
      })
      .webp({
        quality: 80,
      })
      .toBuffer()

    const filename = `payment-proofs/${Date.now()}-${crypto.randomUUID()}.webp`

    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: filename,
        Body: optimizedImage,
        ContentType: "image/webp",
      })
    )

    const imageUrl = `${process.env.R2_PAYMENT_PUBLIC_URL}/${filename}`

    return NextResponse.json({
      success: true,
      url: imageUrl,
    })
  } catch (error) {
    console.error("PAYMENT PROOF UPLOAD ERROR:", error)

    return NextResponse.json(
      {
        error: "Upload failed",
      },
      {
        status: 500,
      }
    )
  }
}