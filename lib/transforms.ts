/**
 * Transform Utilities
 *
 * Pure functions that convert raw DeFiLlama numbers into the display-string
 * format the FindBridge UI already expects ("$800M", "$1.2B", "NIL", etc.)
 * and merge static BridgeConfig entries with live data maps into Bridge objects.
 *
 * All functions are side-effect free and never throw — worst case they return
 * the static fallback value, so the UI always has something to render.
 */

import type { Bridge } from "@/types/bridge"
import type { BridgeConfig } from "@/lib/bridgeConfig"
import type { ProtocolData } from "@/lib/defillama"

// ─── Format helpers ───────────────────────────────────────────────────────────

/**
 * Formats a raw USD number (from DeFiLlama) into a compact display string.
 *
 * Examples:
 *   1_500_000_000 → "$1.5B"
 *   800_000_000   → "$800M"
 *   500_000       → "$500K"
 *   0             → "$0"
 *   null          → fallback (default "N/A")
 */
export function formatUSD(
    raw: number | null | undefined,
    fallback = "N/A"
): string {
    if (raw === null || raw === undefined) return fallback
    if (raw === 0) return "$0"

    const abs = Math.abs(raw)

    if (abs >= 1_000_000_000) {
        const val = raw / 1_000_000_000
        return `$${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}B`
    }

    if (abs >= 1_000_000) {
        const val = raw / 1_000_000
        return `$${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}M`
    }

    if (abs >= 1_000) {
        const val = raw / 1_000
        return `$${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}K`
    }

    return `$${raw.toFixed(0)}`
}

/**
 * Formats a percentage change value.
 *
 * Examples:
 *   4.45  → "+4.4%"
 *   -12.2 → "-12.2%"
 *   null  → null
 */
export function formatChange(raw: number | null | undefined): string | null {
    if (raw === null || raw === undefined || raw === 0) return null
    const prefix = raw > 0 ? "+" : ""
    return `${prefix}${raw.toFixed(1)}%`
}

// ─── Bridge merge ─────────────────────────────────────────────────────────────

/**
 * Merges a static BridgeConfig entry with live DeFiLlama data maps
 * into a complete Bridge object matching types/bridge.ts.
 *
 * Resolution order for tvl / volume24h:
 *   1. defillamaSlug is null           → always use staticTvl / staticVolume24h
 *   2. slug present, found in map      → format the live number
 *   3. slug present, missing from map  → fall back to static value silently
 *      (bridge not indexed on DeFiLlama, or slug mismatch)
 */
export function mergeBridgeWithLiveData(
    config: BridgeConfig,
    protocolMap: Map<string, ProtocolData>,
    volumeMap: Map<string, number>
): Bridge {
    let tvl = config.staticTvl
    let volume24h = config.staticVolume24h
    let change7d: string | null = null
    let fromChains = config.fromChains
    let toChains = config.toChains

    if (config.defillamaSlug !== null) {
        const protocolData = protocolMap.get(config.defillamaSlug)
        const liveVolume = volumeMap.get(config.defillamaSlug)

        if (protocolData) {
            if (protocolData.tvl !== undefined && protocolData.tvl !== null) {
                tvl = formatUSD(protocolData.tvl, config.staticTvl)
            }
            if (protocolData.change_7d !== undefined && protocolData.change_7d !== null) {
                change7d = formatChange(protocolData.change_7d)
            }
            if (protocolData.chains && protocolData.chains.length > 0 && !config.overrideChains) {
                fromChains = protocolData.chains
                toChains = protocolData.chains
            }
        }

        if (liveVolume !== undefined) {
            volume24h = formatUSD(liveVolume, config.staticVolume24h)
        }
    }

    return {
        id: config.id,
        name: config.name,
        status: config.status,
        fromChains,
        toChains,
        supportedTokens: config.supportedTokens,
        transferSpeed: config.transferSpeed,
        fee: config.fee,
        link: config.link,
        bridgeType: config.bridgeType,
        tvl,
        change7d,
        volume24h,
        lastUpdated: new Date().toISOString(),
    }
}

/**
 * Merges all bridges in a config array with live data maps.
 * Returns the full Bridge[] the /api/bridges route serves.
 */
export function mergeAllBridges(
    configs: BridgeConfig[],
    protocolMap: Map<string, ProtocolData>,
    volumeMap: Map<string, number>
): Bridge[] {
    return configs.map((config) => mergeBridgeWithLiveData(config, protocolMap, volumeMap))
}

// ─── Market summary aggregation ───────────────────────────────────────────────

/**
 * Sums TVL across all bridges that have a DeFiLlama slug and a live value.
 * Falls back to parsing static strings for bridges without a slug.
 *
 * Returns a formatted string e.g. "$4.2B"
 */
export function aggregateTotalTVL(
    configs: BridgeConfig[],
    protocolMap: Map<string, ProtocolData>
): string {
    let total = 0

    for (const config of configs) {
        if (config.status === "inactive") continue

        if (config.defillamaSlug !== null) {
            const protocolData = protocolMap.get(config.defillamaSlug)
            if (protocolData && protocolData.tvl !== undefined && protocolData.tvl !== null) {
                total += protocolData.tvl
                continue
            }
        }

        // Parse static fallback string for bridges with no live data
        total += parseStaticUSD(config.staticTvl)
    }

    return formatUSD(total, "$0")
}

/**
 * Sums 24h volume across all active bridges.
 */
export function aggregateTotalVolume(
    configs: BridgeConfig[],
    volumeMap: Map<string, number>
): string {
    let total = 0

    for (const config of configs) {
        if (config.status === "inactive") continue

        if (config.defillamaSlug !== null) {
            const live = volumeMap.get(config.defillamaSlug)
            if (live !== undefined) {
                total += live
                continue
            }
        }

        total += parseStaticUSD(config.staticVolume24h)
    }

    return formatUSD(total, "$0")
}

/**
 * Parses a static display string like "$800M", "$1.2B", "$500K" back to a number.
 * Returns 0 for "NIL", "N/A", or any unparseable value.
 * Used only for fallback aggregation when DeFiLlama data is unavailable.
 */
export function parseStaticUSD(value: string): number {
    if (!value || value === "NIL" || value === "N/A" || value === "$0") return 0

    const cleaned = value.replace(/[$,\s]/g, "").toUpperCase()

    if (cleaned.endsWith("B")) return parseFloat(cleaned) * 1_000_000_000
    if (cleaned.endsWith("M")) return parseFloat(cleaned) * 1_000_000
    if (cleaned.endsWith("K")) return parseFloat(cleaned) * 1_000

    return parseFloat(cleaned) || 0
}

/**
 * Aggregates all bridgeable tokens for a given chain.
 * Sorts tokens by how many bridges support them (frequency).
 */
export function getBridgeableTokens(chainName: string, bridges: BridgeConfig[]): string[] {
    const tokenCounts = new Map<string, number>()
    
    for (const bridge of bridges) {
        if (bridge.status === "inactive") continue
        
        // Count tokens if this bridge supports the destination chain
        if (bridge.toChains.includes(chainName)) {
            for (const token of bridge.supportedTokens) {
                tokenCounts.set(token, (tokenCounts.get(token) || 0) + 1)
            }
        }
    }
    
    // Sort by frequency descending, then return just the token names
    return Array.from(tokenCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([token]) => token)
}