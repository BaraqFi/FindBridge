export interface Bridge {
  id: string
  name: string
  status: "active" | "paused" | "inactive"
  fromChains: string[]
  toChains: string[]
  supportedTokens: string[]
  transferSpeed: string
  fee: string
  link: string
  tvl?: string
  volume24h?: string
  lastUpdated?: string
}

export interface ChainData {
  id: string
  name: string
  icon: string
  bridges: number
  totalTVL: string
  marketShare: number
  volume24h: string
  status: "active" | "limited"
  lastUpdated?: string
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  lastUpdated: string
  error?: string
}

export interface MarketSummary {
  totalTVL: string
  totalVolume: string
  activeBridges: number
  pausedBridges?: number
  inactiveBridges?: number
  topDestination: {
    name: string
    percentage: string
  } | null
}
