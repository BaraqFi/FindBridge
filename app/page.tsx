"use client"

import { useState, useMemo } from "react"
import { Search, ExternalLink, Filter, TrendingUp, Activity, Globe, DollarSign, Users, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Footer } from "@/components/footer"
import { BridgeCardSkeleton, MarketSummarySkeleton } from "@/components/loading-skeleton"
import { useBridges } from "@/hooks/useBridges"
import { useMarketSummary } from "@/hooks/useMarketSummary"
import Link from "next/link"

export default function FindBridge() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sourceChain, setSourceChain] = useState("all")
  const [destinationChain, setDestinationChain] = useState("all")

  const { bridges, loading: bridgesLoading, error: bridgesError, refreshData: refreshBridges } = useBridges()
  const {
    marketSummary,
    loading: summaryLoading,
    error: summaryError,
    refreshData: refreshSummary,
  } = useMarketSummary()

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

  const handleRefresh = async () => {
    await Promise.all([refreshBridges(), refreshSummary()])
  }

  return (
    <div className="min-h-screen bg-background gradient-bg">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Globe className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">FindBridge</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-primary font-medium">
                Bridges
              </Link>
              <Link href="/chains" className="text-muted-foreground hover:text-foreground transition-colors">
                Chains
              </Link>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Analytics
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Resources
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Research
              </a>
            </nav>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                disabled={bridgesLoading || summaryLoading}
                className="h-9 w-9"
              >
                <RefreshCw className={`h-4 w-4 ${bridgesLoading || summaryLoading ? "animate-spin" : ""}`} />
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Multi-Chain
            <br />
            <span className="text-primary">Bridge Aggregator</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Comprehensive analytics for cross-chain bridges across multiple blockchains. Monitor TVL, fees, and activity
            with live updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              View Bridges
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/chains">Explore Chains</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Market Summary */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-primary">Market Summary</h2>
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
                <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Total TVL</p>
                        <p className="text-2xl font-bold text-foreground">{marketSummary.totalTVL}</p>
                        <p className="text-sm text-green-500 flex items-center mt-1">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +5.2%
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">24h Volume</p>
                        <p className="text-2xl font-bold text-foreground">{marketSummary.totalVolume}</p>
                        <p className="text-sm text-green-500 flex items-center mt-1">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +12.8%
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Activity className="h-5 w-5 text-blue-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Active Bridges</p>
                        <p className="text-2xl font-bold text-foreground">{marketSummary.activeBridges}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {bridges.filter((b) => b.status === "paused").length} paused
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Top Destination</p>
                        <p className="text-lg font-bold text-foreground">{marketSummary.topDestination?.name}</p>
                        <p className="text-2xl font-bold text-primary">{marketSummary.topDestination?.percentage}%</p>
                      </div>
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Globe className="h-5 w-5 text-purple-500" />
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
      <section className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold text-foreground">Filter Bridges</h2>
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBridges.map((bridge) => (
                  <Card
                    key={bridge.id}
                    className="bg-card/50 border-border/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-200 flex flex-col h-full"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-foreground">{bridge.name}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              bridge.status === "active" ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                          <Badge variant={bridge.status === "active" ? "default" : "destructive"}>
                            {bridge.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 flex-1 flex flex-col">
                      <div className="flex-1 space-y-4">
                        {/* TVL and Volume */}
                        {bridge.tvl && bridge.volume24h && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground mb-1">TVL</h4>
                              <p className="text-lg font-bold text-foreground">{bridge.tvl}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground mb-1">24h Volume</h4>
                              <p className="text-lg font-bold text-foreground">{bridge.volume24h}</p>
                            </div>
                          </div>
                        )}

                        {/* Chains */}
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">Supported Routes</h4>
                          <div className="text-sm text-muted-foreground">
                            <div className="mb-1">
                              <span className="font-medium text-foreground">From:</span> {bridge.fromChains.join(", ")}
                            </div>
                            <div>
                              <span className="font-medium text-foreground">To:</span> {bridge.toChains.join(", ")}
                            </div>
                          </div>
                        </div>

                        {/* Tokens */}
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">Supported Tokens</h4>
                          <div className="flex flex-wrap gap-1">
                            {bridge.supportedTokens.map((token) => (
                              <Badge key={token} variant="secondary" className="text-xs bg-secondary/50">
                                {token}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Speed and Fee */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Speed</h4>
                            <p className="text-sm text-foreground">{bridge.transferSpeed}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Fee</h4>
                            <p className="text-sm text-foreground">{bridge.fee}</p>
                          </div>
                        </div>
                      </div>

                      {/* Use Bridge Button */}
                      <div className="mt-auto pt-4">
                        <Button className="w-full" asChild disabled={bridge.status === "paused"}>
                          <a
                            href={bridge.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center space-x-2"
                          >
                            <span>{bridge.status === "paused" ? "Bridge Paused" : "Use Bridge"}</span>
                            {bridge.status === "active" && <ExternalLink className="h-4 w-4" />}
                          </a>
                        </Button>
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
  )
}
