"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"
import type { Bridge } from "@/types/bridge"

export function useBridges() {
  const [bridges, setBridges] = useState<Bridge[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const fetchBridges = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.getBridges()

      if (response.success) {
        setBridges(response.data)
        setLastUpdated(response.lastUpdated)
      } else {
        setError(response.error || "Failed to fetch bridges")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    await fetchBridges()
  }

  useEffect(() => {
    fetchBridges()
  }, [])

  return {
    bridges,
    loading,
    error,
    lastUpdated,
    refreshData,
  }
}
