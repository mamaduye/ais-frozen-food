"use client"

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

const phrases = [
  "Lagi laper?",
  "Pengen ngemil?",
  "Mager masak?",
  "Ngidam dimsum?",
  "Butuh stok?",
]

export function HeroDynamicText() {
  const [index, setIndex] = useState(0)
  const [displayText, setDisplayText] = useState(
    phrases[0],
  )
  const [width, setWidth] = useState(0)
  const [isVisible, setIsVisible] =
    useState(true)

  const measureRef =
    useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    if (!measureRef.current) return

    setWidth(
      measureRef.current.offsetWidth,
    )
  }, [displayText])

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)

      setTimeout(() => {
        setIndex((current) => {
          const next =
            (current + 1) %
            phrases.length

          setDisplayText(
            phrases[next],
          )

          return next
        })

        setTimeout(() => {
          setIsVisible(true)
        }, 180)
      }, 280)
    }, 3200)

    return () =>
      clearInterval(interval)
  }, [])

  return (
    <span className="relative inline-flex align-middle">
      {/* hidden measurement */}
      <span
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none absolute whitespace-nowrap px-4 opacity-0"
      >
        {displayText}
      </span>

      <span
        className="hero-motion inline-flex h-[1.55em] items-center overflow-hidden rounded-2xl border border-sky-300/60 bg-primary shadow-sm transition-[width,box-shadow,background-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          width:
            width > 0
              ? `${width}px`
              : "auto",
        }}
      >
        <span
          className={[
            "whitespace-nowrap px-4 text-white",
            "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-1.5 opacity-0",
          ].join(" ")}
        >
          {displayText}
        </span>
      </span>
    </span>
  )
}