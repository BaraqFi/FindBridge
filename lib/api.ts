import type { Bridge, ChainData, ApiResponse, MarketSummary } from "@/types/bridge"

// Base URL for API endpoints - uses relative URLs for both development and production
const API_BASE_URL = "/api"

/**
 * API Client for handling all bridge-related API requests
 * 
 * Provides a centralized interface for making API calls with consistent
 * error handling, caching, and response formatting.
 */
export class ApiClient {
  /**
   * Generic method for making API requests with consistent error handling
   * 
   * @param endpoint - The API endpoint to fetch from
   * @returns Promise resolving to API response with typed data
   */
  private async fetchApi<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
        },
        // Add cache control for production - 5 minutes cache
        next: { revalidate: 300 },
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Failed to fetch ${endpoint}:`, error)
      throw error
    }
  }

  /**
   * Fetch all available bridges
   * @returns Promise resolving to array of bridge data
   */
  async getBridges(): Promise<ApiResponse<Bridge[]>> {
    return this.fetchApi<Bridge[]>("/bridges")
  }

  /**
   * Fetch a specific bridge by ID
   * @param id - The unique identifier of the bridge
   * @returns Promise resolving to single bridge data
   */
  async getBridge(id: string): Promise<ApiResponse<Bridge>> {
    return this.fetchApi<Bridge>(`/bridges/${id}`)
  }

  /**
   * Fetch all supported blockchain chains
   * @returns Promise resolving to array of chain data
   */
  async getChains(): Promise<ApiResponse<ChainData[]>> {
    return this.fetchApi<ChainData[]>("/chains")
  }

  /**
   * Fetch aggregated market summary data
   * @returns Promise resolving to market summary statistics
   */
  async getMarketSummary(): Promise<ApiResponse<MarketSummary>> {
    return this.fetchApi<MarketSummary>("/market-summary")
  }

  /**
   * Refresh bridge data (for future real-time updates)
   * @param bridgeId - Optional specific bridge ID to refresh
   * @returns Promise that resolves when refresh is complete
   */
  async refreshBridgeData(bridgeId?: string): Promise<void> {
    const endpoint = bridgeId ? `/bridges/${bridgeId}/refresh` : "/bridges/refresh"
    await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
    })
  }
}

export const apiClient = new ApiClient()
