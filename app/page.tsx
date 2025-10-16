"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, ExternalLink, Filter, TrendingUp, Activity, Globe, DollarSign, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
import { BridgeCardSkeleton, MarketSummarySkeleton } from "@/components/loading-skeleton"
import { useBridges } from "@/hooks/useBridges"
import { useMarketSummary } from "@/hooks/useMarketSummary"
import Link from "next/link"

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "FindBridge",
  "description": "Cross-chain bridge aggregator for seamless cryptocurrency transfers across multiple blockchains",
  "url": "https://findbridge.vercel.app",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "creator": {
    "@type": "Organization",
    "name": "FindBridge Team"
  },
  "featureList": [
    "Cross-chain bridge comparison",
    "Real-time TVL tracking",
    "Bridge analytics",
    "Multi-chain support",
    "Fee comparison",
    "Transfer speed analysis"
  ]
}

export default function FindBridge() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sourceChain, setSourceChain] = useState("all")
  const [destinationChain, setDestinationChain] = useState("all")
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)

  const { bridges, loading: bridgesLoading, error: bridgesError } = useBridges()
  const {
    marketSummary,
    loading: summaryLoading,
    error: summaryError,
  } = useMarketSummary()

  // Handle scroll behavior to hide/show header
  useEffect(() => {
    const handleScroll = () => {
      const bridgeFiltersElement = document.getElementById('bridge-filters')
      if (bridgeFiltersElement) {
        const rect = bridgeFiltersElement.getBoundingClientRect()
        // Hide header when bridge filters section is in view
        setIsHeaderVisible(rect.top > 100)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Get unique chains for filter dropdowns
  const allChains = useMemo(() => {
    const chains = new Set<string>()
    bridges.forEach((bridge) => {
      bridge.fromChains.forEach((chain) => chains.add(chain))
      bridge.toChains.forEach((chain) => chains.add(chain))
    })
    return Array.from(chains).sort()
  }, [bridges])

  // Filter bridges based on search and chain filters
  const filteredBridges = useMemo(() => {
    return bridges.filter((bridge) => {
      const matchesSearch =
        searchTerm === "" ||
        bridge.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bridge.supportedTokens.some((token) => token.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesSourceChain = sourceChain === "all" || 
        bridge.fromChains.includes(sourceChain) || 
        bridge.toChains.includes(sourceChain)
      const matchesDestinationChain = destinationChain === "all" || 
        bridge.toChains.includes(destinationChain) || 
        bridge.fromChains.includes(destinationChain)

      return matchesSearch && matchesSourceChain && matchesDestinationChain
    })
  }, [bridges, searchTerm, sourceChain, destinationChain])


  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      <div className="min-h-screen bg-background gradient-bg noise-texture">
      {/* Header */}
      <header className="sticky top-0 left-0 right-0 z-50 border-b border-border/40 backdrop-blur-md bg-background/90 transition-all duration-300 header-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2 group">
              <img 
                src="/findbridge.png" 
                alt="FindBridge Logo" 
                className="w-8 h-8 rounded-lg transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-xl font-extrabold text-foreground">FindBridge</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-primary font-semibold link-hover">
                Bridges
              </Link>
              <Link href="/chains" className="text-muted-foreground hover:text-foreground transition-colors font-medium link-hover">
                Chains
              </Link>
              <Link href="/resources" className="text-muted-foreground hover:text-foreground transition-colors font-medium link-hover">
                Resources
              </Link>
            </nav>

            <div className="flex items-center space-x-2">
              <div className="hidden md:block">
                <ThemeToggle />
              </div>
              <MobileNav currentPage="bridges" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 gradient-bg-hero">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-foreground mb-6 tracking-tight">
            Multi-Chain
            <br />
            <span className="gradient-text">Bridge Aggregator</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Comprehensive analytics for cross-chain bridges across multiple blockchains. Monitor TVL, fees, and activity
            with live updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="shadow-xl hover:shadow-2xl"
              onClick={() => {
                document.getElementById('bridge-filters')?.scrollIntoView({ 
                  behavior: 'smooth' 
                })
              }}
            >
              View Bridges
            </Button>
            <Button size="lg" variant="outline" asChild className="hover:border-primary">
              <Link href="/chains">Explore Chains</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Market Summary */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 gradient-bg-content">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Market Summary</h2>
            {summaryError && <div className="text-sm text-destructive">Failed to load market data</div>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {summaryLoading ? (
              <>
                <MarketSummarySkeleton />
                <MarketSummarySkeleton />
                <MarketSummarySkeleton />
                <MarketSummarySkeleton />
              </>
            ) : marketSummary ? (
              <>
                <Card className="bg-card/50 border-border/50 backdrop-blur-sm card-enhanced hover:bg-card/70">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Total TVL</p>
                        <p className="text-3xl font-extrabold text-foreground">{marketSummary.totalTVL}</p>
                        <p className="text-sm text-green-500 flex items-center mt-2 font-semibold">
                          <TrendingUp className="h-4 w-4 mr-1 stroke-[2.5]" />
                          +5.2%
                        </p>
                      </div>
                      <div className="w-14 h-14 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-xl flex items-center justify-center shadow-lg">
                        <DollarSign className="h-7 w-7 icon-financial stroke-[2.5]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-border/50 backdrop-blur-sm card-enhanced hover:bg-card/70">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">24h Volume</p>
                        <p className="text-3xl font-extrabold text-foreground">{marketSummary.totalVolume}</p>
                        <p className="text-sm text-green-500 flex items-center mt-2 font-semibold">
                          <TrendingUp className="h-4 w-4 mr-1 stroke-[2.5]" />
                          +12.8%
                        </p>
                      </div>
                      <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl flex items-center justify-center shadow-lg">
                        <Activity className="h-7 w-7 icon-activity stroke-[2.5]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-border/50 backdrop-blur-sm card-enhanced hover:bg-card/70">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Active Bridges</p>
                        <p className="text-3xl font-extrabold text-foreground">{marketSummary.activeBridges}</p>
                        <div className="text-xs text-muted-foreground mt-2 space-y-1 font-medium">
                          {marketSummary.pausedBridges && marketSummary.pausedBridges > 0 && (
                            <div>{marketSummary.pausedBridges} paused</div>
                          )}
                          {marketSummary.inactiveBridges && marketSummary.inactiveBridges > 0 && (
                            <div>{marketSummary.inactiveBridges} inactive</div>
                          )}
                        </div>
                      </div>
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl flex items-center justify-center shadow-lg">
                        <Users className="h-7 w-7 icon-status-active stroke-[2.5]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-border/50 backdrop-blur-sm card-enhanced hover:bg-card/70">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Top Destination</p>
                        <p className="text-lg font-bold text-foreground">{marketSummary.topDestination?.name}</p>
                        <p className="text-3xl font-extrabold text-primary mt-1">{marketSummary.topDestination?.percentage}%</p>
                      </div>
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-violet-600/20 rounded-xl flex items-center justify-center shadow-lg">
                        <Globe className="h-7 w-7 text-purple-500 stroke-[2.5]" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : null}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section id="bridge-filters" className="px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <Filter className="h-6 w-6 text-primary stroke-[2.5]" />
                <h2 className="text-xl font-bold text-foreground">Filter Bridges</h2>
                {bridgesError && <div className="text-sm text-destructive ml-auto">Failed to load bridge data</div>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search bridges or tokens..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background/50"
                    disabled={bridgesLoading}
                  />
                </div>

                <Select value={sourceChain} onValueChange={setSourceChain} disabled={bridgesLoading}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="From Chain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Source Chains</SelectItem>
                    {allChains.map((chain) => (
                      <SelectItem key={chain} value={chain}>
                        {chain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={destinationChain} onValueChange={setDestinationChain} disabled={bridgesLoading}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="To Chain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Destination Chains</SelectItem>
                    {allChains.map((chain) => (
                      <SelectItem key={chain} value={chain}>
                        {chain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Bridge Results */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          {bridgesLoading ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="h-5 bg-muted animate-pulse rounded w-32" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <BridgeCardSkeleton key={i} />
                ))}
              </div>
            </>
          ) : filteredBridges.length === 0 ? (
            <div className="text-center py-12">
              <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No bridges found</h3>
                  <p className="text-muted-foreground">
                    {bridgesError
                      ? "Failed to load bridge data. Please try refreshing the page."
                      : "Try adjusting your search terms or filters to find more bridges."}
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <p className="text-muted-foreground">
                    Showing {filteredBridges.length} bridge{filteredBridges.length !== 1 ? "s" : ""}
                  </p>
                  <Badge variant="outline" className="text-xs bg-muted/50 text-muted-foreground">
                    Data updated weekly
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBridges.map((bridge) => (
                  <Card
                    key={bridge.id}
                    className={`bg-card/50 border-border/50 backdrop-blur-sm card-enhanced flex flex-col h-full ${
                      bridge.status === "active" 
                        ? "border-accent-green" 
                        : bridge.status === "paused" 
                        ? "border-accent-amber" 
                        : "border-accent-gray"
                    }`}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl font-bold text-foreground">{bridge.name}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${
                              bridge.status === "active" 
                                ? "bg-green-500 pulse-active" 
                                : bridge.status === "paused" 
                                ? "bg-amber-500" 
                                : "bg-gray-500"
                            }`}
                          />
                          <Badge 
                            variant={
                              bridge.status === "active" 
                                ? "success" 
                                : bridge.status === "paused" 
                                ? "warning" 
                                : "inactive"
                            }
                          >
                            {bridge.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-5 flex-1 flex flex-col p-8 pt-0">
                      <div className="flex-1 space-y-5">
                        {/* TVL and Volume */}
                        {bridge.tvl && bridge.volume24h && (
                          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                            <div>
                              <h4 className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">TVL</h4>
                              <p className="text-xl font-extrabold text-foreground">{bridge.tvl}</p>
                            </div>
                            <div>
                              <h4 className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">24h Volume</h4>
                              <p className="text-xl font-extrabold text-foreground">{bridge.volume24h}</p>
                            </div>
                          </div>
                        )}

                        {/* Chains */}
                        <div>
                          <h4 className="text-sm font-bold text-muted-foreground mb-3">Supported Routes</h4>
                          <div className="text-sm text-muted-foreground space-y-2">
                            <div className="flex items-start">
                              <span className="font-semibold text-foreground min-w-[45px]">From:</span>
                              <span className="flex-1">{bridge.fromChains.join(", ")}</span>
                            </div>
                            <div className="flex items-start">
                              <span className="font-semibold text-foreground min-w-[45px]">To:</span>
                              <span className="flex-1">{bridge.toChains.join(", ")}</span>
                            </div>
                          </div>
                        </div>

                        {/* Tokens */}
                        <div>
                          <h4 className="text-sm font-bold text-muted-foreground mb-3">Supported Tokens</h4>
                          <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                            {bridge.supportedTokens.map((token) => (
                              <Badge key={token} variant="secondary" className="text-xs bg-secondary/60 hover:bg-secondary/80 transition-colors">
                                {token}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Speed and Fee */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Speed</h4>
                            <p className="text-sm font-bold text-foreground">{bridge.transferSpeed}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Fee</h4>
                            <p className="text-sm font-bold text-foreground">{bridge.fee}</p>
                          </div>
                        </div>
                      </div>

                      {/* Use Bridge Button */}
                      <div className="mt-auto pt-6">
                        {bridge.status === "inactive" ? (
                          <div className="w-full bg-muted/50 text-muted-foreground border border-border rounded-lg px-4 py-3 text-center cursor-not-allowed font-semibold">
                            <span className="flex items-center justify-center space-x-2">
                              <span>Bridge Inactive</span>
                            </span>
                          </div>
                        ) : (
                          <Button 
                            className="w-full shadow-md hover:shadow-xl" 
                            asChild 
                            disabled={bridge.status === "paused"}
                            size="lg"
                          >
                            <a
                              href={bridge.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center space-x-2"
                            >
                              <span>
                                {bridge.status === "paused" 
                                  ? "Bridge Paused" 
                                  : "Use Bridge"
                                }
                              </span>
                              {bridge.status === "active" && <ExternalLink className="h-4 w-4 stroke-[2.5]" />}
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
      </div>
    </>
  )
}
