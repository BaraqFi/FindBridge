/**
 * Bridge interface representing a cross-chain bridge protocol
 * 
 * Contains all essential information about a bridge including its operational
 * status, supported chains and tokens, performance metrics, and accessibility.
 */
export interface Bridge {
  id: string // Unique identifier for the bridge
  name: string // Display name of the bridge protocol
  status: "active" | "paused" | "inactive" // Current operational status
  fromChains: string[] // Source blockchain networks
  toChains: string[] // Destination blockchain networks
  supportedTokens: string[] // List of supported cryptocurrency tokens
  transferSpeed: string // Estimated transfer completion time
  fee: string // Fee structure (percentage or fixed amount)
  link: string // URL to access the bridge
  tvl?: string // Total Value Locked (optional)
  volume24h?: string // 24-hour trading volume (optional)
  lastUpdated?: string // Last data update timestamp (optional)
}

/**
 * ChainData interface representing blockchain network information
 * 
 * Contains statistics and metadata about individual blockchain networks
 * including bridge connectivity, TVL, and market metrics.
 */
export interface ChainData {
  id: string // Unique identifier for the chain
  name: string // Display name of the blockchain
  icon: string // Emoji or icon representation
  bridges: number // Number of bridges connected to this chain
  totalTVL: string // Total Value Locked on this chain
  marketShare: number // Percentage of total market share
  volume24h: string // 24-hour trading volume
  status: "active" | "limited" // Chain operational status
  lastUpdated?: string // Last data update timestamp (optional)
}

/**
 * Generic API response wrapper
 * 
 * Standardized response format for all API endpoints with consistent
 * error handling and metadata structure.
 */
export interface ApiResponse<T> {
  data: T // The actual response data
  success: boolean // Whether the request was successful
  lastUpdated: string // Timestamp of last data update
  error?: string // Error message if request failed (optional)
}

/**
 * MarketSummary interface for aggregated market data
 * 
 * Provides high-level statistics about the cross-chain bridge ecosystem
 * including total TVL, volume, bridge counts, and top destinations.
 */
export interface MarketSummary {
  totalTVL: string // Total Value Locked across all bridges
  totalVolume: string // 24-hour total trading volume
  activeBridges: number // Count of currently active bridges
  pausedBridges?: number // Count of temporarily paused bridges (optional)
  inactiveBridges?: number // Count of permanently inactive bridges (optional)
  topDestination: {
    name: string // Name of the most popular destination chain
    percentage: string // Market share percentage
  } | null // Top destination chain data (null if no data available)
}
