import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FindBridge - Cross-Chain Bridge Aggregator',
    short_name: 'FindBridge',
    description: 'Discover and compare cross-chain bridges for seamless cryptocurrency transfers across multiple blockchains.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/findbridge.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}
