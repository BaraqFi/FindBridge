import { NextResponse } from "next/server"
import type { Bridge, ApiResponse } from "@/types/bridge"
import { BRIDGE_CONFIG } from "@/lib/bridgeConfig"
import { fetchLiveMaps, DefiLlamaError } from "@/lib/defillama"
import { mergeAllBridges } from "@/lib/transforms"

/**
 * Bridges API Endpoint
 *
 * Returns the full list of 45 bridges with live TVL and 24h volume data
 * from DeFiLlama, merged with static config data.
 *
 * Caching: DeFiLlama fetch calls revalidate once per day (86400s).
 * All users within a 24h window are served from the cached response.
 *
 * Fallback: if DeFiLlama is unreachable, static config values are used
 * and the response includes dataSource: "static" for observability.
 */
export async function GET() {
  try {
    const { protocolMap, volumeMap } = await fetchLiveMaps()
    const bridges = mergeAllBridges(BRIDGE_CONFIG, protocolMap, volumeMap)

    const response: ApiResponse<Bridge[]> = {
      data: bridges,
      success: true,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    // DeFiLlama unavailable — serve static config values so the app
    // never goes dark. Log the error for observability.
    if (error instanceof DefiLlamaError) {
      console.error(`[bridges] DeFiLlama error on ${error.endpoint} (${error.status}): ${error.message}`)
    } else {
      console.error("[bridges] Unexpected error:", error)
    }

    const staticBridges = mergeAllBridges(
      BRIDGE_CONFIG,
      new Map(), // empty maps → all bridges use static fallback values
      new Map()
    )

    const fallbackResponse: ApiResponse<Bridge[]> & { dataSource: string } = {
      data: staticBridges,
      success: true, // still a valid response, just from static data
      lastUpdated: new Date().toISOString(),
      dataSource: "static",
    }

    return NextResponse.json(fallbackResponse)
  }
}