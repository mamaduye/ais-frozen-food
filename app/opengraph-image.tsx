import { ImageResponse } from "next/og"

export const runtime = "edge"

export const alt = "AIS Frozen Food"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",

          background:
            "linear-gradient(135deg,#0A49A1 0%,#1565C0 55%,#42A5F5 100%)",

          color: "white",

          padding: 80,

          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 74,
            fontWeight: 800,
          }}
        >
          AIS Frozen Food
        </div>

        <div
          style={{
            marginTop: 24,
            fontSize: 34,
            opacity: 0.95,
          }}
        >
          Premium Frozen Food for Every Family
        </div>

        <div
          style={{
            marginTop: 16,
            fontSize: 24,
            opacity: 0.8,
          }}
        >
          Nugget • Dimsum • Cireng • Sosis
        </div>

        <div
          style={{
            marginTop: 50,
            padding: "18px 40px",

            background: "#EA7815",

            borderRadius: 999,

            fontWeight: 700,

            fontSize: 24,
          }}
        >
          Praktis • Lezat • Berkualitas
        </div>
      </div>
    ),
    size
  )
}