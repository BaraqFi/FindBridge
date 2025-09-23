"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"
import type { ChainData } from "@/types/bridge"

export function useChains() {
  const [chains, setChains] = useState<ChainData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const fetchChains = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getChains()

      if (response.success) {
        setChains(response.data)
        setLastUpdated(response.lastUpdated)
      } else {
        setError(response.error || "Failed to fetch chains")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    await fetchChains()
  }

  useEffect(() => {
    fetchChains()
  }, [])

  return {
    chains,
    loading,
    error,
    lastUpdated,
    refreshData,
  }
}
