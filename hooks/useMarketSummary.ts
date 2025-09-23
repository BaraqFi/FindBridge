"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"
import type { MarketSummary } from "@/types/bridge"

/**
 * Custom hook for managing market summary data
 * 
 * Provides state management for aggregated market data including TVL,
 * volume, bridge counts, and top destinations. Automatically fetches
 * market summary data on component mount.
 * 
 * @returns Object containing market summary data, loading state, error state, and refresh function
 */
export function useMarketSummary() {
  // State management for market summary data
  const [marketSummary, setMarketSummary] = useState<MarketSummary | null>(null) // Market summary object
  const [loading, setLoading] = useState(true) // Loading state indicator
  const [error, setError] = useState<string | null>(null) // Error message if fetch fails
  const [lastUpdated, setLastUpdated] = useState<string | null>(null) // Last update timestamp

  /**
   * Fetch market summary data from the API
   * Handles loading states, error states, and data updates
   */
  const fetchMarketSummary = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getMarketSummary()

      if (response.success) {
        setMarketSummary(response.data)
        setLastUpdated(response.lastUpdated)
      } else {
        setError(response.error || "Failed to fetch market summary")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  /**
   * Refresh market summary data manually
   * Useful for user-triggered data updates
   */
  const refreshData = async () => {
    await fetchMarketSummary()
  }

  // Fetch market summary data on component mount
  useEffect(() => {
    fetchMarketSummary()
  }, [])

  return {
    marketSummary,
    loading,
    error,
    lastUpdated,
    refreshData,
  }
}
