import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    remotePatterns: [new URL("https://avatars.githubusercontent.com/u/**")],
  },
}

export default nextConfig
