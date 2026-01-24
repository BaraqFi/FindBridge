"use client"

import { useState, useEffect } from "react"
import { Search, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Footer } from "@/components/footer"
import { useChains } from "@/hooks/useChains"
import { MobileNav } from "@/components/mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export default function ChainsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const { chains, loading, error } = useChains()

  // Handle scroll behavior to hide/show header
  useEffect(() => {
    const handleScroll = () => {
      const mainContent = document.querySelector('main') || document.querySelector('.chains-content')
      if (mainContent) {
        const rect = mainContent.getBoundingClientRect()
        // Hide header when main content is in view
        setIsHeaderVisible(rect.top > 100)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const filteredChains = chains.filter((chain) => chain.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const totalTVL = chains.reduce((sum, chain) => {
    const tvl = Number.parseFloat(chain.totalTVL.replace(/[$BM]/g, ""))
    const multiplier = chain.totalTVL.includes("B") ? 1000 : 1
    return sum + tvl * multiplier
  }, 0)

  return (
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
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors font-medium link-hover">
                Bridges
              </Link>
              <Link href="/chains" className="text-primary font-semibold link-hover">
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
              <MobileNav currentPage="chains" />
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-extrabold text-foreground mb-4 tracking-tight">Chains</h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
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
              className="loot-input pl-10"
              disabled={loading}
            />
          </div>
        </div>

        {/* Chains Table */}
        <Card className="border-[4px] border-black bg-white shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
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
                    <div key={chain.id} className="grid grid-cols-12 gap-4 p-6 table-row-hover">
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
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="market-summary-card market-summary-card--orange">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-extrabold text-foreground mb-2">
                {loading ? <div className="h-8 bg-muted animate-pulse rounded w-8 mx-auto" /> : chains.length}
              </div>
              <div className="text-muted-foreground font-semibold">Total Chains</div>
            </CardContent>
          </Card>

          <Card className="market-summary-card market-summary-card--green">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-extrabold text-foreground mb-2">
                {loading ? (
                  <div className="h-8 bg-muted animate-pulse rounded w-16 mx-auto" />
                ) : (
                  `$${totalTVL.toFixed(1)}B`
                )}
              </div>
              <div className="text-muted-foreground font-semibold">Combined TVL</div>
            </CardContent>
          </Card>

          <Card className="market-summary-card market-summary-card--pink">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-extrabold text-foreground mb-2">
                {loading ? (
                  <div className="h-8 bg-muted animate-pulse rounded w-8 mx-auto" />
                ) : (
                  chains.filter((c) => c.status === "active").length
                )}
              </div>
              <div className="text-muted-foreground font-semibold">Active Chains</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
