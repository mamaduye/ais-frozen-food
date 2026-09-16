import { FaWhatsapp } from "react-icons/fa"

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/6285226122121?text=Halo%20AIS%20Frozen%20Food%2C%20saya%20ingin%20memesan."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Pesan melalui WhatsApp"
      className="
        fixed bottom-5 right-5 z-50
        inline-flex items-center gap-2
        rounded-full
        bg-emerald-500
        px-4 py-3
        text-sm font-semibold text-white
        shadow-lg shadow-emerald-500/30
        transition-all duration-200
        hover:-translate-y-0.5
        hover:bg-emerald-600
        hover:shadow-xl
        hover:shadow-emerald-500/40
        sm:bottom-6 sm:right-6
      "
    >
      <FaWhatsapp className="h-5 w-5" />

      <span className="hidden sm:inline">
        Pesan via WhatsApp
      </span>

      <span className="sm:hidden">
        WhatsApp
      </span>
    </a>
  )
}