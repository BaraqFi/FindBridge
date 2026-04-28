import { NextResponse } from "next/server"
import type { MarketSummary, ApiResponse } from "@/types/bridge"
import { BRIDGE_CONFIG, BRIDGE_COUNTS } from "@/lib/bridgeConfig"
import { fetchLiveMaps, DefiLlamaError } from "@/lib/defillama"
import { aggregateTotalTVL, aggregateTotalVolume } from "@/lib/transforms"

/**
 * Market Summary API Endpoint
 *
 * Aggregates live TVL and 24h volume across all active bridges using
 * DeFiLlama data (where slugs are available) plus static fallback values
 * for bridges without a DeFiLlama listing.
 *
 * Bridge counts (active/paused/inactive) come directly from BRIDGE_CONFIG
 * so they always reflect the actual state of the config file.
 *
 * topDestination is kept as a curated static value — deriving this
 * dynamically would require per-chain volume data which is outside the
 * scope of the free DeFiLlama endpoints we use.
 */
export async function GET() {
  try {
    const { protocolMap, volumeMap } = await fetchLiveMaps()

    const totalTVL = aggregateTotalTVL(BRIDGE_CONFIG, protocolMap)
    const totalVolume = aggregateTotalVolume(BRIDGE_CONFIG, volumeMap)

    const summary: MarketSummary = {
      totalTVL,
      totalVolume,
      activeBridges: BRIDGE_COUNTS.active,
      pausedBridges: BRIDGE_COUNTS.paused,
      inactiveBridges: BRIDGE_COUNTS.inactive,
      topDestination: {
        name: "Ethereum",
        percentage: "45.2",
      },
    }

    const response: ApiResponse<MarketSummary> = {
      data: summary,
      success: true,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    if (error instanceof DefiLlamaError) {
      console.error(`[market-summary] DeFiLlama error on ${error.endpoint} (${error.status}): ${error.message}`)
    } else {
      console.error("[market-summary] Unexpected error:", error)
    }

    // Fallback: aggregate from static strings only
    const totalTVL = aggregateTotalTVL(BRIDGE_CONFIG, new Map())
    const totalVolume = aggregateTotalVolume(BRIDGE_CONFIG, new Map())

    const fallbackSummary: MarketSummary = {
      totalTVL,
      totalVolume,
      activeBridges: BRIDGE_COUNTS.active,
      pausedBridges: BRIDGE_COUNTS.paused,
      inactiveBridges: BRIDGE_COUNTS.inactive,
      topDestination: {
        name: "Ethereum",
        percentage: "45.2",
      },
    }

    const fallbackResponse: ApiResponse<MarketSummary> & { dataSource: string } = {
      data: fallbackSummary,
      success: true,
      lastUpdated: new Date().toISOString(),
      dataSource: "static",
    }

    return NextResponse.json(fallbackResponse)
  }
}