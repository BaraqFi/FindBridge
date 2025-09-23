import type { Bridge, ChainData, ApiResponse, MarketSummary } from "@/types/bridge"

const API_BASE_URL = process.env.NODE_ENV === "production" ? "https://your-domain.com/api" : "/api"

export class ApiClient {
  private async fetchApi<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
        },
        // Add cache control for production
        next: { revalidate: 300 }, // 5 minutes cache
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

  async getBridges(): Promise<ApiResponse<Bridge[]>> {
    return this.fetchApi<Bridge[]>("/bridges")
  }

  async getBridge(id: string): Promise<ApiResponse<Bridge>> {
    return this.fetchApi<Bridge>(`/bridges/${id}`)
  }

  async getChains(): Promise<ApiResponse<ChainData[]>> {
    return this.fetchApi<ChainData[]>("/chains")
  }

  async getMarketSummary(): Promise<ApiResponse<MarketSummary>> {
    return this.fetchApi<MarketSummary>("/market-summary")
  }

  // Method to refresh data (for future real-time updates)
  async refreshBridgeData(bridgeId?: string): Promise<void> {
    const endpoint = bridgeId ? `/bridges/${bridgeId}/refresh` : "/bridges/refresh"
    await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
    })
  }
}

export const apiClient = new ApiClient()
