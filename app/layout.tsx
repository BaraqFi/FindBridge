import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "FindBridge - Cross-Chain Bridge Aggregator",
    template: "%s | FindBridge"
  },
  description: "Discover and compare cross-chain bridges for seamless cryptocurrency transfers across multiple blockchains. Monitor TVL, fees, and activity with comprehensive analytics.",
  keywords: [
    "cross-chain bridge",
    "blockchain bridge",
    "crypto bridge",
    "DeFi bridge",
    "multi-chain",
    "bridge aggregator",
    "cryptocurrency transfer",
    "Ethereum bridge",
    "Polygon bridge",
    "Arbitrum bridge",
    "BSC bridge",
    "Avalanche bridge",
    "bridge comparison",
    "bridge analytics",
    "TVL tracking"
  ],
  authors: [{ name: "FindBridge Team" }],
  creator: "FindBridge",
  publisher: "FindBridge",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://findbridge.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'FindBridge - Cross-Chain Bridge Aggregator',
    description: 'Discover and compare cross-chain bridges for seamless cryptocurrency transfers across multiple blockchains.',
    siteName: 'FindBridge',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FindBridge - Cross-Chain Bridge Aggregator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FindBridge - Cross-Chain Bridge Aggregator',
    description: 'Discover and compare cross-chain bridges for seamless cryptocurrency transfers across multiple blockchains.',
    images: ['/og-image.png'],
    creator: '@findbridge',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
