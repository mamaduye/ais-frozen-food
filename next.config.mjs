import bundleAnalyzer from "@next/bundle-analyzer"

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-13cf16590c054065a49ba74d7422002c.r2.dev",
       },
      {
        protocol: "https",
        hostname: "pub-ab88c9b249ca4180bbe0fe50fdf43bf0.r2.dev",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
}

export default withBundleAnalyzer(nextConfig)