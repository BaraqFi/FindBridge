import { NextResponse } from "next/server"
import type { ChainData, ApiResponse } from "@/types/bridge"

const mockChainData: ChainData[] = [
  {
    id: "ethereum",
    name: "Ethereum",
    icon: "⟠",
    bridges: 25,
    totalTVL: "$3.2B",
    marketShare: 37.6,
    volume24h: "$150M",
    status: "active",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "arbitrum",
    name: "Arbitrum",
    icon: "🔵",
    bridges: 18,
    totalTVL: "$1.1B",
    marketShare: 12.9,
    volume24h: "$55M",
    status: "active",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "polygon",
    name: "Polygon",
    icon: "🟣",
    bridges: 20,
    totalTVL: "$800M",
    marketShare: 9.4,
    volume24h: "$40M",
    status: "active",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "bsc",
    name: "BSC",
    icon: "🟡",
    bridges: 16,
    totalTVL: "$650M",
    marketShare: 7.6,
    volume24h: "$35M",
    status: "active",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "avalanche",
    name: "Avalanche",
    icon: "🔴",
    bridges: 15,
    totalTVL: "$520M",
    marketShare: 6.1,
    volume24h: "$28M",
    status: "active",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "optimism",
    name: "Optimism",
    icon: "🔴",
    bridges: 12,
    totalTVL: "$450M",
    marketShare: 5.3,
    volume24h: "$25M",
    status: "active",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "solana",
    name: "Solana",
    icon: "🟢",
    bridges: 8,
    totalTVL: "$380M",
    marketShare: 4.5,
    volume24h: "$20M",
    status: "active",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "bitcoin",
    name: "Bitcoin",
    icon: "₿",
    bridges: 6,
    totalTVL: "$600M",
    marketShare: 7.1,
    volume24h: "$30M",
    status: "active",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "base",
    name: "Base",
    icon: "🔷",
    bridges: 4,
    totalTVL: "$200M",
    marketShare: 2.4,
    volume24h: "$12M",
    status: "active",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "sui",
    name: "Sui",
    icon: "🟦",
    bridges: 1,
    totalTVL: "$150M",
    marketShare: 1.8,
    volume24h: "$5M",
    status: "active",
    lastUpdated: new Date().toISOString(),
  },
  {
    id: "ton",
    name: "TON",
    icon: "💎",
    bridges: 2,
    totalTVL: "$60M",
    marketShare: 0.7,
    volume24h: "$1M",
    status: "active",
    lastUpdated: new Date().toISOString(),
  },
]

export async function GET() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 100))

    const response: ApiResponse<ChainData[]> = {
      data: mockChainData,
      success: true,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    const errorResponse: ApiResponse<ChainData[]> = {
      data: [],
      success: false,
      lastUpdated: new Date().toISOString(),
      error: "Failed to fetch chain data",
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}
