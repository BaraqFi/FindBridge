import { NextResponse } from "next/server"
import type { MarketSummary, ApiResponse } from "@/types/bridge"

/**
 * Market Summary API Endpoint
 * 
 * Provides aggregated market data including TVL, volume, and bridge statistics.
 * This endpoint calculates summary statistics from bridge data for dashboard display.
 * 
 * @returns {Promise<NextResponse>} JSON response with market summary data
 */
export async function GET() {
  try {
    // Simulate API processing delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Calculate actual bridge counts from the data
    // In a real app, this would fetch from the bridges API or database
    // Based on the bridge data: 46 total bridges
    const activeBridges = 43 // Count of active bridges from our data
    const pausedBridges = 0 // Count of paused bridges from our data  
    const inactiveBridges = 3 // Count of inactive bridges from our data

    // Create market summary with calculated statistics
    const mockMarketSummary: MarketSummary = {
      totalTVL: "$17.88B", // Total Value Locked across all bridges
      totalVolume: "$318M", // 24-hour trading volume
      activeBridges, // Number of currently active bridges
      pausedBridges, // Number of temporarily paused bridges
      inactiveBridges, // Number of permanently inactive bridges
      topDestination: {
        name: "Ethereum", // Most popular destination chain
        percentage: "45.2", // Market share percentage
      },
    }

    // Return successful response with market data
    const response: ApiResponse<MarketSummary> = {
      data: mockMarketSummary,
      success: true,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    // Handle any errors and return error response
    const errorResponse: ApiResponse<MarketSummary> = {
      data: {} as MarketSummary,
      success: false,
      lastUpdated: new Date().toISOString(),
      error: "Failed to fetch market summary",
    }

    return NextResponse.json(errorResponse, { status: 500 })
  }
}
