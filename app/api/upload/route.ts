import { NextResponse } from "next/server"
import sharp from "sharp"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { r2 } from "@/lib/cloudflare/r2"

export async function POST(req: Request) {
  const formData = await req.formData()

  const file = formData.get("file") as File

  if (!file) {
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
      { error: "Invalid file type" },
      { status: 400 }
    )
  }

  const maxSize = 5 * 1024 * 1024

  if (file.size > maxSize) {
    return NextResponse.json(
      { error: "Maximum size is 5MB" },
      { status: 400 }
    )
  }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const resized = await sharp(buffer)
      .rotate()
      .resize({
          width:800,
          height:800,
          fit:"inside",
          withoutEnlargement:true,
      })
      .webp({
          quality:75,
          effort:6,
      })
      .toBuffer()

      const filename = `products/${Date.now()}-${crypto.randomUUID()}.webp`
      await r2.send(
        new PutObjectCommand({
          Bucket: process.env.R2_PRODUCT_BUCKET!,
          Key: filename,
          Body: resized,
          ContentType: "image/webp",
        })
      )

      const imageUrl =`${process.env.R2_PRODUCT_PUBLIC_URL}/${filename}`

  return NextResponse.json({
    success: true,
    url: imageUrl,
  })
}