import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MessageSquareText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getCurrentServerUser } from "@/lib/supabase/server-auth"
import { getOrderById } from "@/lib/supabase/orders"
import { ReviewForm } from "./review-form"
import { getExistingReview } from "@/lib/supabase/reviews"

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function ReviewPage({ params }: Props) {
  const { id } = await params

  const user = await getCurrentServerUser()

  if (!user) {
    redirect("/login")
  }

  const order = await getOrderById(user.id, id)

  if (!order) {
    redirect("/orders")
  }
  const reviews = await Promise.all(
    order.items.map(async (item) => {
      const existingReview = await getExistingReview({
        userId: user.id,
        orderId: order.id,
        productId: item.productId,
      })

      return {
        item,
        existingReview,
      }
    })
  )


  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">

        {/* Back Button */}
        <Button
          asChild
          variant="ghost"
          className="mb-6 -ml-2 gap-2 text-muted-foreground transition-colors hover:text-white"
        >
          <Link href={`/orders/${order.id}`}>
            <ArrowLeft className=" h-4 w-4"  />
            Kembali ke Detail Pesanan
          </Link>
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <MessageSquareText className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-medium text-primary">
                Bagikan pengalamanmu
              </p>

              <h1 className="font-display text-3xl font-semibold tracking-tight">
                Tulis Ulasan
              </h1>
            </div>
          </div>

          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Bantu pelanggan lain dengan membagikan pengalamanmu setelah mencoba
            produk dari AIS Frozen Food.
          </p>
        </div>

        {/* Review Forms */}
        <div className="space-y-6">
          {reviews.map(({ item, existingReview }) => (
            <div key={item.productId}>
              {existingReview ? (
                <div className="rounded-xl border bg-background p-6 shadow-sm">
                  <h2 className="text-lg font-semibold">
                    {item.name}
                  </h2>

                  <div className="mt-3 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span
                        key={index}
                        className={
                          index < existingReview.rating
                            ? "text-yellow-400"
                            : "text-muted-foreground/30"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground">
                    {existingReview.comment}
                  </p>

                  <p className="mt-4 text-sm font-medium text-green-600">
                    ✓ Ulasan sudah diberikan
                  </p>
                </div>
              ) : (
                <ReviewForm
                  userId={user.id}
                  orderId={order.id}
                  productId={item.productId}
                  productName={item.name}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}