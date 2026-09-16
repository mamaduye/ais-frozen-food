import { PutObjectCommand } from "@aws-sdk/client-s3"
import { r2 } from "./client"

export async function uploadFile(
  key: string,
  buffer: Buffer,
  contentType: string
) {
  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  )

  return key
}