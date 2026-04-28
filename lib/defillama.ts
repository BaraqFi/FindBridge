/**
 * DeFiLlama API Wrapper
 *
 * Two typed fetch functions covering all live data needs for FindBridge.
 * Uses an in-memory cache for the processed Maps (slug -> number) since
 * the raw DeFiLlama responses exceed Next.js's 2MB fetch cache limit.
 *
 * Cache strategy:
 *   - Module-level Maps cached with a 24h TTL
 *   - Only the processed data is stored (a few KB), not the raw response (26MB+)
 *   - Concurrent requests share a single in-flight fetch (stampede protection)
 *   - If the cache is fresh, fetchLiveMaps() returns instantly from memory
 *
 * Base URL is read from DEFILLAMA_BASE_URL env var with a fallback,
 * so switching to a different plan or mirror is a one-line env change.
 *
 * Error handling: both functions throw DefiLlamaError on non-200 responses.
 * Route handlers catch this and fall back to static config values.
 */

const BASE_URL = process.env.DEFILLAMA_BASE_URL ?? "https://api.llama.fi"

// 24 hours in milliseconds
const CACHE_TTL_MS = 24 * 60 * 60 * 1000

// ─── Error type ──────────────────────────────────────────────────────────────

export class DefiLlamaError extends Error {
    constructor(
        public readonly endpoint: string,
        public readonly status: number,
        message: string
    ) {
        super(message)
        this.name = "DefiLlamaError"
    }
}

// ─── Raw response shapes (subset of what DeFiLlama actually returns) ─────────

export interface DLProtocol {
    slug: string
    name: string
    tvl: number | null
    change_1d: number | null   // % change — not directly used, but available
    change_7d: number | null
    chains: string[]
}

export interface ProtocolData {
    tvl: number | null
    change_7d: number | null
    chains: string[]
}

export interface DLFeesProtocol {
    slug: string
    name: string
    total24h: number | null    // 24h fee/volume in USD
    total7d: number | null
}

export interface DLFeesOverview {
    protocols: DLFeesProtocol[]
}

// ─── In-memory cache ─────────────────────────────────────────────────────────

interface LiveMapsCache {
    protocolMap: Map<string, ProtocolData>
    volumeMap: Map<string, number>
    fetchedAt: number  // Date.now() timestamp
}

let cache: LiveMapsCache | null = null
let inflight: Promise<LiveMapsCache> | null = null

function isCacheFresh(): boolean {
    if (!cache) return false
    return Date.now() - cache.fetchedAt < CACHE_TTL_MS
}

// ─── Fetch functions (internal, no caching) ──────────────────────────────────

/**
 * Fetches all protocols from DeFiLlama.
 * Returns a slug-keyed Map for O(1) protocol lookup per bridge.
 *
 * Endpoint: GET /protocols
 * Uses cache: "no-store" to skip the broken Next.js 2MB fetch cache.
 */
async function fetchProtocolMap(): Promise<Map<string, ProtocolData>> {
    const url = `${BASE_URL}/protocols`

    const res = await fetch(url, { cache: "no-store" })

    if (!res.ok) {
        throw new DefiLlamaError("/protocols", res.status, `DeFiLlama /protocols returned ${res.status}`)
    }

    const protocols: DLProtocol[] = await res.json()

    const map = new Map<string, ProtocolData>()
    for (const p of protocols) {
        if (p.slug && p.tvl !== null && p.tvl !== undefined) {
            map.set(p.slug, {
                tvl: p.tvl,
                change_7d: p.change_7d,
                chains: p.chains || []
            })
        }
    }

    return map
}

/**
 * Fetches the fees/volume overview from DeFiLlama.
 * Returns a slug-keyed Map for O(1) volume24h lookup per bridge.
 *
 * Endpoint: GET /overview/fees
 * The `total24h` field represents 24h fee revenue — the closest free
 * proxy for bridge volume available without a Pro subscription.
 */
async function fetchVolumeMap(): Promise<Map<string, number>> {
    const url = `${BASE_URL}/overview/fees`

    const res = await fetch(url, { cache: "no-store" })

    if (!res.ok) {
        throw new DefiLlamaError("/overview/fees", res.status, `DeFiLlama /overview/fees returned ${res.status}`)
    }

    const body: DLFeesOverview = await res.json()

    const map = new Map<string, number>()
    for (const p of body.protocols) {
        if (p.slug && p.total24h !== null && p.total24h !== undefined) {
            map.set(p.slug, p.total24h)
        }
    }

    return map
}

// ─── Public entry point ──────────────────────────────────────────────────────

/**
 * Returns cached TVL and volume Maps, fetching from DeFiLlama only if
 * the cache is stale (>24h) or empty.
 *
 * Stampede protection: if a fetch is already in-flight, concurrent callers
 * await the same promise instead of firing duplicate requests.
 *
 * Preferred entry point for all route handlers.
 */
export async function fetchLiveMaps(): Promise<{
    protocolMap: Map<string, ProtocolData>
    volumeMap: Map<string, number>
}> {
    // Return cached data immediately if fresh
    if (isCacheFresh() && cache) {
        return { protocolMap: cache.protocolMap, volumeMap: cache.volumeMap }
    }

    // If a fetch is already in-flight, piggyback on it
    if (inflight) {
        const result = await inflight
        return { protocolMap: result.protocolMap, volumeMap: result.volumeMap }
    }

    // Initiate a new fetch and store the promise for concurrent callers
    inflight = (async (): Promise<LiveMapsCache> => {
        try {
            const [protocolMap, volumeMap] = await Promise.all([fetchProtocolMap(), fetchVolumeMap()])
            const entry: LiveMapsCache = { protocolMap, volumeMap, fetchedAt: Date.now() }
            cache = entry
            return entry
        } finally {
            inflight = null
        }
    })()

    const result = await inflight
    return { protocolMap: result.protocolMap, volumeMap: result.volumeMap }
}

/**
 * Fetches total TVL for all chains from DeFiLlama.
 * Endpoint: GET /v2/chains
 * Caches for 24 hours using Next.js fetch cache.
 */
export async function fetchChainTvlMap(): Promise<Map<string, number>> {
    const url = `${BASE_URL}/v2/chains`

    const res = await fetch(url, { next: { revalidate: 86400 } })

    if (!res.ok) {
        throw new DefiLlamaError("/v2/chains", res.status, `DeFiLlama /v2/chains returned ${res.status}`)
    }

    const chains: { name: string, tvl: number }[] = await res.json()
    const map = new Map<string, number>()

    const DL_CHAIN_NAME_MAP: Record<string, string> = {
        "Binance": "BSC",
        "Avalanche": "Avalanche",
        "xDai": "Gnosis",
        "Matic": "Polygon",
    }

    for (const chain of chains) {
        const normalizedName = DL_CHAIN_NAME_MAP[chain.name] || chain.name
        map.set(normalizedName, chain.tvl)
    }

    return map
}