import { NextResponse } from "next/server"
import type { ChainData, ApiResponse } from "@/types/bridge"
import { BRIDGE_CONFIG } from "@/lib/bridgeConfig"
import { fetchChainTvlMap } from "@/lib/defillama"
import { getBridgeableTokens, formatUSD } from "@/lib/transforms"

/**
 * Chains API Endpoint
 *
 * Derives the chain list entirely from BRIDGE_CONFIG — no external API call.
 * Each chain entry includes an accurate bridge count (how many active bridges
 * support that chain) derived from the static config.
 *
 * TVL, volume, and marketShare for chains are kept as curated static values
 * since DeFiLlama's free chain TVL endpoint (/v2/chains) covers the full chain
 * ecosystem, not bridge-specific TVL. These values can be updated manually
 * whenever a significant shift occurs.
 */

// Chain metadata: icon, static TVL/volume/marketShare
// Bridge count is derived dynamically from BRIDGE_CONFIG below
const CHAIN_META: Record<
  string,
  { id: string; icon: string; totalTVL: string; marketShare: number; volume24h: string }
> = {
  Ethereum: { id: "ethereum", icon: "⟠", totalTVL: "$3.2B", marketShare: 37.6, volume24h: "$150M" },
  Arbitrum: { id: "arbitrum", icon: "🔵", totalTVL: "$1.1B", marketShare: 12.9, volume24h: "$55M" },
  Polygon: { id: "polygon", icon: "🟣", totalTVL: "$800M", marketShare: 9.4, volume24h: "$40M" },
  BSC: { id: "bsc", icon: "🟡", totalTVL: "$650M", marketShare: 7.6, volume24h: "$35M" },
  Avalanche: { id: "avalanche", icon: "🔴", totalTVL: "$520M", marketShare: 6.1, volume24h: "$28M" },
  Optimism: { id: "optimism", icon: "🔴", totalTVL: "$450M", marketShare: 5.3, volume24h: "$25M" },
  Solana: { id: "solana", icon: "🟢", totalTVL: "$380M", marketShare: 4.5, volume24h: "$20M" },
  Bitcoin: { id: "bitcoin", icon: "₿", totalTVL: "$600M", marketShare: 7.1, volume24h: "$30M" },
  Base: { id: "base", icon: "🔷", totalTVL: "$200M", marketShare: 2.4, volume24h: "$12M" },
  Sui: { id: "sui", icon: "🟦", totalTVL: "$150M", marketShare: 1.8, volume24h: "$5M" },
  TON: { id: "ton", icon: "💎", totalTVL: "$60M", marketShare: 0.7, volume24h: "$1M" },
  zkSync: { id: "zksync", icon: "🔐", totalTVL: "$120M", marketShare: 1.4, volume24h: "$8M" },
  Cosmos: { id: "cosmos", icon: "⚛️", totalTVL: "$80M", marketShare: 0.9, volume24h: "$3M" },
  NEAR: { id: "near", icon: "🌐", totalTVL: "$40M", marketShare: 0.5, volume24h: "$2M" },
  Fantom: { id: "fantom", icon: "👻", totalTVL: "$30M", marketShare: 0.4, volume24h: "$1M" },
  Ronin: { id: "ronin", icon: "🎮", totalTVL: "$200M", marketShare: 2.3, volume24h: "$5M" },
  Klaytn: { id: "klaytn", icon: "🟠", totalTVL: "$25M", marketShare: 0.3, volume24h: "$1M" },
  Terra: { id: "terra", icon: "🌍", totalTVL: "$10M", marketShare: 0.1, volume24h: "$0.5M" },
  Tezos: { id: "tezos", icon: "🔵", totalTVL: "$15M", marketShare: 0.2, volume24h: "$0.5M" },
  Wanchain: { id: "wanchain", icon: "🔗", totalTVL: "$10M", marketShare: 0.1, volume24h: "$0.3M" },
  Cardano: { id: "cardano", icon: "🔵", totalTVL: "$20M", marketShare: 0.2, volume24h: "$0.5M" },
}

export async function GET() {
  try {
    // Fetch live chain TVL map, fallback to empty map on failure
    const chainTvlMap = await fetchChainTvlMap().catch((err) => {
      console.error("[chains] Failed to fetch live chain TVL:", err)
      return new Map<string, number>()
    })

    // Derive unique chains from active bridges in config
    const activeBridges = BRIDGE_CONFIG.filter((b) => b.status === "active")

    // Count how many active bridges support each chain
    const bridgeCountMap = new Map<string, number>()

    for (const bridge of activeBridges) {
      const chains = new Set(bridge.fromChains.concat(bridge.toChains))
      for (const chain of Array.from(chains)) {
        bridgeCountMap.set(chain, (bridgeCountMap.get(chain) ?? 0) + 1)
      }
    }

    // Build ChainData[] — only include chains that appear in CHAIN_META
    const chains: ChainData[] = []

    for (const [chainName, count] of Array.from(bridgeCountMap.entries())) {
      const meta = CHAIN_META[chainName]
      if (!meta) continue // skip exotic/niche chains not in our curated list

      const liveTvl = chainTvlMap.get(chainName)
      const totalTVL = liveTvl !== undefined ? formatUSD(liveTvl, meta.totalTVL) : meta.totalTVL
      const bridgeableTokens = getBridgeableTokens(chainName, BRIDGE_CONFIG)

      chains.push({
        id: meta.id,
        name: chainName,
        icon: meta.icon,
        bridges: count,
        totalTVL,
        marketShare: meta.marketShare,
        volume24h: meta.volume24h,
        status: "active",
        bridgeableTokens,
        lastUpdated: new Date().toISOString(),
      })
    }

    // Sort by bridge count descending so most-connected chains appear first
    chains.sort((a, b) => b.bridges - a.bridges)

    const response: ApiResponse<ChainData[]> = {
      data: chains,
      success: true,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("[chains] Unexpected error:", error)

    const errorResponse: ApiResponse<ChainData[]> = {
      data: [],
      success: false,
      lastUpdated: new Date().toISOString(),
      error: "Failed to fetch chain data",
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}