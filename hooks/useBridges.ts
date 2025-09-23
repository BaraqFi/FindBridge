"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"
import type { Bridge } from "@/types/bridge"

/**
 * Custom hook for managing bridge data
 * 
 * Provides state management for bridge data including loading states,
 * error handling, and data refresh functionality. Automatically fetches
 * bridge data on component mount.
 * 
 * @returns Object containing bridge data, loading state, error state, and refresh function
 */
export function useBridges() {
  // State management for bridge data
  const [bridges, setBridges] = useState<Bridge[]>([]) // Array of bridge objects
  const [loading, setLoading] = useState(true) // Loading state indicator
  const [error, setError] = useState<string | null>(null) // Error message if fetch fails
  const [lastUpdated, setLastUpdated] = useState<string | null>(null) // Last update timestamp

  /**
   * Fetch bridge data from the API
   * Handles loading states, error states, and data updates
   */
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

  /**
   * Refresh bridge data manually
   * Useful for user-triggered data updates
   */
  const refreshData = async () => {
    await fetchBridges()
  }

  // Fetch bridge data on component mount
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
