import { MessageCircle } from "lucide-react"

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/6281234567890?text=Halo%20AIS%20Frozen%20Food%2C%20saya%20ingin%20pesan."
      target="_blank"
      rel="noreferrer"
      aria-label="Order via WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-600 sm:bottom-6 sm:right-6"
    >
      <MessageCircle className="h-4 w-4" />
      <span className="hidden sm:inline">Quick order on WhatsApp</span>
      <span className="sm:hidden">WhatsApp</span>
    </a>
  )
}
