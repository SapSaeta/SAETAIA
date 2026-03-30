/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Anthropic CDN (imágenes og:image de artículos)
      { protocol: 'https', hostname: '**.anthropic.com' },
      { protocol: 'https', hostname: '**.sanity.io' },
      // GitHub (avatares, og:image de releases)
      { protocol: 'https', hostname: '**.githubusercontent.com' },
      { protocol: 'https', hostname: 'github.com' },
      // Comodín para otras fuentes que se añadan en el futuro
      { protocol: 'https', hostname: '**.openai.com' },
      { protocol: 'https', hostname: '**.deepmind.google' },
    ],
  },
}

export default nextConfig
