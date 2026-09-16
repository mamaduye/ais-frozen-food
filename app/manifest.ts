import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AIS Frozen Food",

    short_name: "AIS Frozen Food",

    description:
      "Belanja frozen food berkualitas dengan mudah.",

    start_url: "/",

    display: "standalone",

    background_color: "#ffffff",

    theme_color: "#0A49A1",

    lang: "id",

    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },

      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  }
}