"use client"

import { useState } from "react"
import { Search, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import { useChains } from "@/hooks/useChains"
import { MobileNav } from "@/components/mobile-nav"
import Link from "next/link"

export default function ChainsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const { chains, loading, error } = useChains()

  const filteredChains = chains.filter((chain) => chain.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const totalTVL = chains.reduce((sum, chain) => {
    const tvl = Number.parseFloat(chain.totalTVL.replace(/[$BM]/g, ""))
    const multiplier = chain.totalTVL.includes("B") ? 1000 : 1
    return sum + tvl * multiplier
  }, 0)

  return (
    <div className="min-h-screen bg-background gradient-bg">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">F</span>
              </div>
              <span className="text-xl font-bold text-foreground">FindBridge</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Bridges
              </Link>
              <Link href="/chains" className="text-primary font-medium">
                Chains
              </Link>
              <Link href="/resources" className="text-muted-foreground hover:text-foreground transition-colors">
                Resources
              </Link>
            </nav>
            <div className="flex items-center space-x-2">
              <div className="hidden md:block">
                <div className="w-9 h-9" />
              </div>
              <MobileNav currentPage="chains" />
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Chains</h1>
          <p className="text-xl text-muted-foreground">
            Explore all blockchain networks with cross-chain bridge activity
          </p>
          {error && (
            <div className="mt-2 text-sm text-destructive">Failed to load chain data. Please try refreshing.</div>
          )}
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chains..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50"
              disabled={loading}
            />
          </div>
        </div>

        {/* Chains Table */}
        <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
          <CardContent className="p-0">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-6 border-b border-border/50 text-sm font-medium text-muted-foreground">
              <div className="col-span-4">Chain</div>
              <div className="col-span-2 text-center">Bridges</div>
              <div className="col-span-2 text-center">Total TVL</div>
              <div className="col-span-2 text-center">Market Share</div>
              <div className="col-span-2 text-center">Action</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-border/50">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-12 gap-4 p-6">
                      <div className="col-span-4 flex items-center space-x-3">
                        <div className="w-8 h-8 bg-muted animate-pulse rounded-full" />
                        <div className="space-y-2">
                          <div className="h-4 bg-muted animate-pulse rounded w-24" />
                          <div className="h-3 bg-muted animate-pulse rounded w-16" />
                        </div>
                      </div>
                      <div className="col-span-2 flex items-center justify-center">
                        <div className="h-4 bg-muted animate-pulse rounded w-8" />
                      </div>
                      <div className="col-span-2 flex items-center justify-center">
                        <div className="h-4 bg-muted animate-pulse rounded w-16" />
                      </div>
                      <div className="col-span-2 flex items-center justify-center">
                        <div className="h-4 bg-muted animate-pulse rounded w-12" />
                      </div>
                      <div className="col-span-2 flex items-center justify-center">
                        <div className="h-8 bg-muted animate-pulse rounded w-16" />
                      </div>
                    </div>
                  ))
                : filteredChains.map((chain) => (
                    <div key={chain.id} className="grid grid-cols-12 gap-4 p-6 hover:bg-accent/50 transition-colors">
                      {/* Chain */}
                      <div className="col-span-4 flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-lg">
                          {chain.icon}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{chain.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {chain.status === "active" ? "Active" : "Limited"}
                          </div>
                        </div>
                      </div>

                      {/* Bridges */}
                      <div className="col-span-2 flex items-center justify-center">
                        <span className="text-foreground font-medium">{chain.bridges}</span>
                      </div>

                      {/* Total TVL */}
                      <div className="col-span-2 flex items-center justify-center">
                        <span className="text-foreground font-medium">{chain.totalTVL}</span>
                      </div>

                      {/* Market Share */}
                      <div className="col-span-2 flex items-center justify-center">
                        <span className="text-foreground font-medium">{chain.marketShare}%</span>
                      </div>

                      {/* Action */}
                      <div className="col-span-2 flex items-center justify-center">
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                          View
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-foreground mb-2">
                {loading ? <div className="h-8 bg-muted animate-pulse rounded w-8 mx-auto" /> : chains.length}
              </div>
              <div className="text-muted-foreground">Total Chains</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-foreground mb-2">
                {loading ? (
                  <div className="h-8 bg-muted animate-pulse rounded w-16 mx-auto" />
                ) : (
                  `$${totalTVL.toFixed(1)}B`
                )}
              </div>
              <div className="text-muted-foreground">Combined TVL</div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-foreground mb-2">
                {loading ? (
                  <div className="h-8 bg-muted animate-pulse rounded w-8 mx-auto" />
                ) : (
                  chains.filter((c) => c.status === "active").length
                )}
              </div>
              <div className="text-muted-foreground">Active Chains</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
