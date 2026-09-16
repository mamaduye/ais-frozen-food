import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { CartProvider } from "@/components/cart-provider"

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider>
      <div className="print:hidden">
        <SiteHeader />
      </div>

      <main>
        {children}
      </main>

      <div className="print:hidden">
        <SiteFooter />
      </div>

      <div className="print:hidden">
        <WhatsAppButton />
      </div>
    </CartProvider>
  )
}
