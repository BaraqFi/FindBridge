import { NextResponse } from "next/server"
import type { Bridge, ApiResponse } from "@/types/bridge"
import { BRIDGE_CONFIG } from "@/lib/bridgeConfig"
import { fetchLiveMaps, DefiLlamaError } from "@/lib/defillama"
import { mergeBridgeWithLiveData } from "@/lib/transforms"

/**
 * Single Bridge API Endpoint
 *
 * Returns a single bridge by id with live TVL and 24h volume data.
 * The DeFiLlama fetch calls are cached at the fetch() level, so if
 * /api/bridges was already called in the same 24h window, this is instant.
 */
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params

  // Find the bridge in static config first — fast, no network call
  const config = BRIDGE_CONFIG.find((b) => b.id === id)

  if (!config) {
    const notFound: ApiResponse<Bridge> = {
      data: {} as Bridge,
      success: false,
      lastUpdated: new Date().toISOString(),
      error: `Bridge with id "${id}" not found`,
    }
    return NextResponse.json(notFound, { status: 404 })
  }

  try {
    const { protocolMap, volumeMap } = await fetchLiveMaps()
    const bridge = mergeBridgeWithLiveData(config, protocolMap, volumeMap)

    const response: ApiResponse<Bridge> = {
      data: bridge,
      success: true,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    if (error instanceof DefiLlamaError) {
      console.error(`[bridges/${id}] DeFiLlama error on ${error.endpoint} (${error.status}): ${error.message}`)
    } else {
      console.error(`[bridges/${id}] Unexpected error:`, error)
    }

    // Fall back to static values for this specific bridge
    const staticBridge = mergeBridgeWithLiveData(config, new Map(), new Map())

    const fallbackResponse: ApiResponse<Bridge> & { dataSource: string } = {
      data: staticBridge,
      success: true,
      lastUpdated: new Date().toISOString(),
      dataSource: "static",
    }

    return NextResponse.json(fallbackResponse)
  }
}