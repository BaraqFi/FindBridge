import { NextResponse } from "next/server"
import type { MarketSummary, ApiResponse } from "@/types/bridge"

export async function GET() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 100))

    // In production, this would calculate from real bridge data
    const mockMarketSummary: MarketSummary = {
      totalTVL: "$8.5B",
      totalVolume: "$350M",
      activeBridges: 30,
      topDestination: {
        name: "Ethereum",
        percentage: "45.2",
      },
    }

    const response: ApiResponse<MarketSummary> = {
      data: mockMarketSummary,
      success: true,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    const errorResponse: ApiResponse<MarketSummary> = {
      data: {} as MarketSummary,
      success: false,
      lastUpdated: new Date().toISOString(),
      error: "Failed to fetch market summary",
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}
