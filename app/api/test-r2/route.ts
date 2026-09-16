import { uploadFile } from "@/lib/storage/upload"

export async function GET() {
  const buffer = Buffer.from("Halo dari Next.js!")

  const key = `test/test-${Date.now()}.txt`

  await uploadFile(key, buffer, "text/plain")

  return Response.json({
    success: true,
    key,
  })
}