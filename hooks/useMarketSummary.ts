"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"
import type { MarketSummary } from "@/types/bridge"

export function useMarketSummary() {
  const [marketSummary, setMarketSummary] = useState<MarketSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

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

  const refreshData = async () => {
    await fetchMarketSummary()
  }

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
