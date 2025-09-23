import { NextResponse } from "next/server"
import type { MarketSummary, ApiResponse } from "@/types/bridge"

export async function GET() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Calculate actual bridge counts from the data
    // In a real app, this would fetch from the bridges API or database
    const activeBridges = 45 // Count of active bridges from our data
    const pausedBridges = 0 // Count of paused bridges from our data  
    const inactiveBridges = 3 // Count of inactive bridges from our data

    const mockMarketSummary: MarketSummary = {
      totalTVL: "$8.5B",
      totalVolume: "$350M",
      activeBridges,
      pausedBridges,
      inactiveBridges,
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
